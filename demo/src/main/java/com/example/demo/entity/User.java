package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    private String profilePicture;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer totalXp = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer currentStreak = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer longestStreak = 0;
    
    private LocalDateTime lastActivityDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;
    
    private String providerId;
    
    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum AuthProvider {
        LOCAL,
        GOOGLE
    }
}
