package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ContentCreateRequest;
import com.example.demo.dto.ContentResponse;
import com.example.demo.dto.PagedContentResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.ContentService;
import com.example.demo.service.GroqService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;
    private final GroqService groqService;

    @PostMapping
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<ContentResponse> createContent(
            @Valid @RequestBody ContentCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(contentService.createContent(request, userDetails));
    }

    @GetMapping
    public ResponseEntity<PagedContentResponse> browseContent(
            @RequestParam(required = false) String subject,
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long viewerId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(contentService.searchContentPaged(subject, query, page, size, viewerId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<List<ContentResponse>> getMyContent(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(contentService.getCreatorContent(userDetails.getId()));
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<String>> listSubjects() {
        return ResponseEntity.ok(contentService.listSubjects());
    }

    @PostMapping("/ai-description")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<Map<String, String>> generateAiDescription(
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam String topic
    ) {
        String description = groqService.generateContentDescription(title, subject, topic);
        return ResponseEntity.ok(Map.of("description", description));
    }
}
