package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiLearningPathResponse {

    private Long id;
    private String generatedPath;
    private LocalDate examDate;
    private LocalDateTime createdAt;
}
