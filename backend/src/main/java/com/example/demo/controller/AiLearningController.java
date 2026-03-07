package com.example.demo.controller;

import com.example.demo.dto.AiLearningPathResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.GroqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ai-learning")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class AiLearningController {

    private final GroqService groqService;

    @PostMapping("/generate")
    public ResponseEntity<AiLearningPathResponse> generateLearningPath(
            @RequestParam(required = false) String syllabusText,
            @RequestParam(required = false) MultipartFile pdfFile,
            @RequestParam(required = false) String examDate,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        LocalDate parsedExamDate = examDate != null && !examDate.isBlank()
                ? LocalDate.parse(examDate)
                : null;
        return ResponseEntity.ok(groqService.generateLearningPath(userDetails, syllabusText, pdfFile, parsedExamDate));
    }

    @GetMapping("/history")
    public ResponseEntity<List<AiLearningPathResponse>> getHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(groqService.getHistory(userDetails));
    }
}
