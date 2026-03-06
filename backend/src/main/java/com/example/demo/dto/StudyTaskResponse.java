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
public class StudyTaskResponse {

    private Long id;
    private String subject;
    private String topic;
    private LocalDate assignedDate;
    private boolean completed;
    private LocalDateTime completedAt;
}
