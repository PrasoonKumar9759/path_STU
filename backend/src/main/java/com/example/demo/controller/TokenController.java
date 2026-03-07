package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ContentResponse;
import com.example.demo.dto.TokenBalanceResponse;
import com.example.demo.dto.UnlockContentRequest;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.TokenService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tokens")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class TokenController {

    private final TokenService tokenService;

    @GetMapping("/balance")
    public ResponseEntity<TokenBalanceResponse> getBalance(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(tokenService.getBalance(userDetails));
    }

    @PostMapping("/unlock")
    public ResponseEntity<TokenBalanceResponse> unlockContent(
            @Valid @RequestBody UnlockContentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(tokenService.unlockContent(userDetails, request.getContentId()));
    }

    @GetMapping("/unlocked")
    public ResponseEntity<List<ContentResponse>> getUnlockedContent(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(tokenService.getUnlockedContent(userDetails));
    }
}
