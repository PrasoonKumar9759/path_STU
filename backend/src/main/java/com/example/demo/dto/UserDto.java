package com.example.demo.dto;

import com.example.demo.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String profilePicture;
    private UserRole role;
    private Integer totalXp;
    private Integer currentStreak;
    private Integer longestStreak;
}
