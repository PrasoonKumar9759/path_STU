package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyPlanResponse {

    private LocalDate startDate;
    private LocalDate targetDate;
    private long availableDays;
    private int totalTopics;
    private List<StudyTaskResponse> generatedTasks;
}
