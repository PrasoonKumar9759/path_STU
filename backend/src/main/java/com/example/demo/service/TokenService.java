package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.ContentResponse;
import com.example.demo.dto.TokenBalanceResponse;
import com.example.demo.dto.TokenTransactionResponse;
import com.example.demo.entity.ContentUnlock;
import com.example.demo.entity.StudyContent;
import com.example.demo.entity.TokenTransaction;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.ContentUnlockRepository;
import com.example.demo.repository.StudyContentRepository;
import com.example.demo.repository.TokenTransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final UserRepository userRepository;
    private final TokenTransactionRepository tokenTransactionRepository;
    private final ContentUnlockRepository contentUnlockRepository;
    private final StudyContentRepository studyContentRepository;

    public TokenBalanceResponse getBalance(CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TokenTransactionResponse> recent = tokenTransactionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .limit(20)
                .map(this::toTransactionResponse)
                .toList();

        return TokenBalanceResponse.builder()
                .balance(user.getTokenBalance() == null ? 0 : user.getTokenBalance())
                .recentTransactions(recent)
                .build();
    }

    @Transactional
    public TokenBalanceResponse unlockContent(CustomUserDetails userDetails, Long contentId) {
        User student = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (student.getRole() != UserRole.STUDENT) {
            throw new RuntimeException("Only students can unlock content");
        }

        StudyContent content = studyContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        if (!Boolean.TRUE.equals(content.getPremium())) {
            throw new RuntimeException("This content is not premium");
        }

        if (contentUnlockRepository.existsByStudentIdAndContentId(student.getId(), contentId)) {
            throw new RuntimeException("Content already unlocked");
        }

        int cost = content.getTokenCost() != null ? content.getTokenCost() : 0;
        int balance = student.getTokenBalance() != null ? student.getTokenBalance() : 0;

        if (balance < cost) {
            throw new RuntimeException("Insufficient tokens. You need " + cost + " but have " + balance);
        }

        // Deduct tokens
        student.setTokenBalance(balance - cost);
        userRepository.save(student);

        // Record unlock
        contentUnlockRepository.save(ContentUnlock.builder()
                .student(student)
                .content(content)
                .tokensSpent(cost)
                .build());

        // Record transaction
        tokenTransactionRepository.save(TokenTransaction.builder()
                .user(student)
                .amount(-cost)
                .type(TokenTransaction.TransactionType.CONTENT_UNLOCK)
                .description("Unlocked: " + content.getTitle())
                .build());

        return getBalance(userDetails);
    }

    public List<ContentResponse> getUnlockedContent(CustomUserDetails userDetails) {
        Long studentId = userDetails.getId();
        return contentUnlockRepository.findByStudentId(studentId).stream()
                .map(unlock -> {
                    StudyContent c = unlock.getContent();
                    return ContentResponse.builder()
                            .id(c.getId())
                            .title(c.getTitle())
                            .subject(c.getSubject())
                            .topic(c.getTopic())
                            .resourceUrl(c.getResourceUrl())
                            .description(c.getDescription())
                            .creatorId(c.getCreator().getId())
                            .creatorName(c.getCreator().getName())
                            .premium(c.getPremium())
                            .tokenCost(c.getTokenCost())
                            .campus(c.getCampus())
                            .unlocked(true)
                            .createdAt(c.getCreatedAt())
                            .build();
                })
                .toList();
    }

    private TokenTransactionResponse toTransactionResponse(TokenTransaction tx) {
        return TokenTransactionResponse.builder()
                .id(tx.getId())
                .amount(tx.getAmount())
                .type(tx.getType().name())
                .description(tx.getDescription())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
