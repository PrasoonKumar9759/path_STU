package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskCompletionResponse {

    private StudyTaskResponse task;
    private Integer xpAwarded;
    private Integer totalXp;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer tokensAwarded;
    private Integer tokenBalance;
}
