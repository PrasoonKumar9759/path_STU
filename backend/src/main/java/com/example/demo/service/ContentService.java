package com.example.demo.service;

import com.example.demo.dto.ContentCreateRequest;
import com.example.demo.dto.ContentResponse;
import com.example.demo.dto.PagedContentResponse;
import com.example.demo.entity.StudyContent;
import com.example.demo.entity.User;
import com.example.demo.repository.ContentUnlockRepository;
import com.example.demo.repository.StudyContentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final StudyContentRepository studyContentRepository;
    private final ContentUnlockRepository contentUnlockRepository;
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
                .premium(request.getPremium() != null && request.getPremium())
                .tokenCost(request.getTokenCost() != null ? request.getTokenCost() : 0)
                .campus(request.getCampus() == null ? null : request.getCampus().trim())
                .build();

        StudyContent saved = studyContentRepository.save(content);
        return toResponse(saved, null);
    }

    public List<ContentResponse> searchContent(String subject, String query) {
        String normalizedSubject = normalizeFilter(subject);
        String normalizedQuery = normalizeFilter(query);

        return studyContentRepository.search(normalizedSubject, normalizedQuery)
                .stream()
                .map(c -> toResponse(c, null))
                .toList();
    }

    public PagedContentResponse searchContentPaged(String subject, String query, int page, int size, Long viewerId) {
        String normalizedSubject = normalizeFilter(subject);
        String normalizedQuery = normalizeFilter(query);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<StudyContent> contentPage = studyContentRepository.searchPaged(normalizedSubject, normalizedQuery, pageable);

        // Load unlocked content IDs for the current viewer
        Set<Long> unlockedIds = viewerId != null
                ? contentUnlockRepository.findByStudentId(viewerId).stream()
                    .map(u -> u.getContent().getId())
                    .collect(Collectors.toSet())
                : Set.of();

        List<ContentResponse> items = contentPage.getContent().stream()
                .map(c -> toResponse(c, unlockedIds))
                .toList();

        return PagedContentResponse.builder()
                .content(items)
                .page(contentPage.getNumber())
                .size(contentPage.getSize())
                .totalElements(contentPage.getTotalElements())
                .totalPages(contentPage.getTotalPages())
                .last(contentPage.isLast())
                .build();
    }

    public List<ContentResponse> getCreatorContent(Long creatorId) {
        return studyContentRepository.findByCreatorIdOrderByCreatedAtDesc(creatorId)
                .stream()
                .map(c -> toResponse(c, null))
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

    private ContentResponse toResponse(StudyContent content, Set<Long> unlockedIds) {
        boolean isUnlocked = unlockedIds != null && unlockedIds.contains(content.getId());
        return ContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .subject(content.getSubject())
                .topic(content.getTopic())
                .resourceUrl(content.getResourceUrl())
                .description(content.getDescription())
                .creatorId(content.getCreator().getId())
                .creatorName(content.getCreator().getName())
                .premium(content.getPremium())
                .tokenCost(content.getTokenCost())
                .campus(content.getCampus())
                .unlocked(isUnlocked)
                .createdAt(content.getCreatedAt())
                .build();
    }
}
