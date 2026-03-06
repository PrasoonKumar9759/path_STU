package com.example.demo.controller;

import com.example.demo.dto.ContentCreateRequest;
import com.example.demo.dto.ContentResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @PostMapping
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<ContentResponse> createContent(
            @Valid @RequestBody ContentCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(contentService.createContent(request, userDetails));
    }

    @GetMapping
    public ResponseEntity<List<ContentResponse>> browseContent(
            @RequestParam(required = false) String subject,
            @RequestParam(name = "q", required = false) String query
    ) {
        return ResponseEntity.ok(contentService.searchContent(subject, query));
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<String>> listSubjects() {
        return ResponseEntity.ok(contentService.listSubjects());
    }
}
