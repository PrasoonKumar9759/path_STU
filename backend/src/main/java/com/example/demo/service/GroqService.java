package com.example.demo.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.AiLearningPathResponse;
import com.example.demo.entity.AiLearningPath;
import com.example.demo.entity.TokenTransaction;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.AiLearningPathRepository;
import com.example.demo.repository.TokenTransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroqService {

    private static final int AI_PATH_TOKEN_COST = 5;
    private static final int MAX_SYLLABUS_LENGTH = 8000;

    @Value("${app.groq.api-key}")
    private String apiKey;

    @Value("${app.groq.model}")
    private String model;

    @Value("${app.groq.api-url}")
    private String apiUrl;

    private final AiLearningPathRepository aiLearningPathRepository;
    private final UserRepository userRepository;
    private final TokenTransactionRepository tokenTransactionRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public AiLearningPathResponse generateLearningPath(
            CustomUserDetails userDetails,
            String syllabusText,
            MultipartFile pdfFile,
            LocalDate examDate) {

        User student = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (student.getRole() != UserRole.STUDENT) {
            throw new RuntimeException("Only students can generate AI learning paths");
        }

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Groq API key is not configured. Please set GROQ_API_KEY environment variable.");
        }

        // Extract text from PDF if provided
        String inputText = syllabusText;
        if (pdfFile != null && !pdfFile.isEmpty()) {
            inputText = extractPdfText(pdfFile);
        }

        if (inputText == null || inputText.isBlank()) {
            throw new RuntimeException("Please provide syllabus text or upload a PDF file");
        }

        // Truncate if too long
        if (inputText.length() > MAX_SYLLABUS_LENGTH) {
            inputText = inputText.substring(0, MAX_SYLLABUS_LENGTH);
        }

        // Deduct tokens
        int balance = student.getTokenBalance() != null ? student.getTokenBalance() : 0;
        if (balance < AI_PATH_TOKEN_COST) {
            throw new RuntimeException(
                    "Insufficient tokens. AI path generation costs " + AI_PATH_TOKEN_COST + " tokens, you have " + balance);
        }

        student.setTokenBalance(balance - AI_PATH_TOKEN_COST);
        userRepository.save(student);

        tokenTransactionRepository.save(TokenTransaction.builder()
                .user(student)
                .amount(-AI_PATH_TOKEN_COST)
                .type(TokenTransaction.TransactionType.AI_PATH_GENERATION)
                .description("AI Learning Path generation")
                .build());

        // Call Groq API
        String aiResponse = callGroqApi(inputText, examDate);

        // Save the learning path
        AiLearningPath path = AiLearningPath.builder()
                .student(student)
                .syllabusText(inputText)
                .generatedPath(aiResponse)
                .examDate(examDate)
                .build();

        AiLearningPath saved = aiLearningPathRepository.save(path);

        return toResponse(saved);
    }

    public List<AiLearningPathResponse> getHistory(CustomUserDetails userDetails) {
        return aiLearningPathRepository.findByStudentIdOrderByCreatedAtDesc(userDetails.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private String extractPdfText(MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            try (PDDocument document = Loader.loadPDF(bytes)) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to extract text from PDF: " + e.getMessage());
        }
    }

    private String callGroqApi(String syllabusText, LocalDate examDate) {
        String examInfo = examDate != null
                ? "The exam is on " + examDate + ". Today is " + LocalDate.now() + "."
                : "No specific exam date provided.";

        String systemPrompt = """
                You are an expert academic advisor and exam preparation strategist.
                Analyze the provided syllabus/exam content and generate a comprehensive, actionable learning path.
                
                Your response MUST be in the following structured format:
                
                ## 🎯 High-Probability Exam Concepts
                List the topics most likely to appear on the exam, ranked by probability (high/medium/low).
                For each concept, explain WHY it's high-probability (frequency in past papers, foundational importance, etc).
                
                ## 📋 Personalized Learning Path
                Create a day-by-day study schedule. For each day:
                - **Topic**: What to study
                - **Priority**: High / Medium / Low
                - **Time**: Estimated hours
                - **Strategy**: How to study it (practice problems, concept mapping, flashcards, etc)
                
                ## 💡 Smart Study Tips
                - Key connections between topics
                - Common exam traps to avoid
                - Quick-revision strategies for the last 2 days
                
                ## ⚡ Quick-Win Topics
                Topics that are easy to learn but frequently tested — study these first for maximum marks per hour.
                
                Keep the response practical, specific, and motivating. No generic advice.
                """;

        String userPrompt = examInfo + "\n\nHere is the syllabus/exam content to analyze:\n\n" + syllabusText;

        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    ),
                    "temperature", 0.3,
                    "max_tokens", 4000
            );

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Groq API returned status " + response.statusCode() + ": " + response.body());
            }

            JsonNode root = objectMapper.readTree(response.body());
            return root.path("choices").path(0).path("message").path("content").asText();

        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new RuntimeException("Failed to call Groq API: " + e.getMessage());
        }
    }

    private AiLearningPathResponse toResponse(AiLearningPath path) {
        return AiLearningPathResponse.builder()
                .id(path.getId())
                .generatedPath(path.getGeneratedPath())
                .examDate(path.getExamDate())
                .createdAt(path.getCreatedAt())
                .build();
    }

    public String generateContentDescription(String title, String subject, String topic) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Groq API key is not configured.");
        }

        String systemPrompt = """
                You are an expert educational content writer. Given a study resource's title, subject, and topic,
                generate a concise, engaging description (2-4 sentences, max 200 words) that:
                - Clearly explains what students will learn from this resource
                - Highlights key concepts covered
                - Uses a friendly, encouraging tone
                Do NOT use markdown formatting. Return plain text only.
                """;

        String userPrompt = "Title: " + title + "\nSubject: " + subject + "\nTopic: " + topic;

        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    ),
                    "temperature", 0.7,
                    "max_tokens", 300
            );

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Groq API returned status " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            return root.path("choices").path(0).path("message").path("content").asText();

        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new RuntimeException("Failed to generate description: " + e.getMessage());
        }
    }
}
