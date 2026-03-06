package com.example.demo.service;

import com.example.demo.dto.ContentCreateRequest;
import com.example.demo.dto.ContentResponse;
import com.example.demo.entity.StudyContent;
import com.example.demo.entity.User;
import com.example.demo.repository.StudyContentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final StudyContentRepository studyContentRepository;
    private final UserRepository userRepository;

    public ContentResponse createContent(ContentCreateRequest request, CustomUserDetails userDetails) {
        User creator = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        String cleanedUrl = request.getResourceUrl().trim();
        validateUrl(cleanedUrl);

        StudyContent content = StudyContent.builder()
                .creator(creator)
                .title(request.getTitle().trim())
                .subject(request.getSubject().trim())
                .topic(request.getTopic().trim())
                .resourceUrl(cleanedUrl)
                .description(request.getDescription() == null ? null : request.getDescription().trim())
                .build();

        StudyContent saved = studyContentRepository.save(content);
        return toResponse(saved);
    }

    public List<ContentResponse> searchContent(String subject, String query) {
        String normalizedSubject = normalizeFilter(subject);
        String normalizedQuery = normalizeFilter(query);

        return studyContentRepository.search(normalizedSubject, normalizedQuery)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<String> listSubjects() {
        return studyContentRepository.findDistinctSubjects();
    }

    private String normalizeFilter(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void validateUrl(String url) {
        String lower = url.toLowerCase();
        if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
            throw new RuntimeException("Resource URL must start with http:// or https://");
        }
    }

    private ContentResponse toResponse(StudyContent content) {
        return ContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .subject(content.getSubject())
                .topic(content.getTopic())
                .resourceUrl(content.getResourceUrl())
                .description(content.getDescription())
                .creatorId(content.getCreator().getId())
                .creatorName(content.getCreator().getName())
                .createdAt(content.getCreatedAt())
                .build();
    }
}
