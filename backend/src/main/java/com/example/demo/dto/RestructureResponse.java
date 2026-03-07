package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestructureResponse {

    private int overdueTasks;
    private int redistributedTasks;
    private int remainingDays;
    private String message;
    private List<StudyTaskResponse> updatedTasks;
}
