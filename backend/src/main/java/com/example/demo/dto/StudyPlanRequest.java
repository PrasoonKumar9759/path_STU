package com.example.demo.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class StudyPlanRequest {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotEmpty(message = "At least one topic is required")
    private List<@NotBlank(message = "Topic cannot be blank") String> topics;

    @NotNull(message = "Target completion date is required")
    @FutureOrPresent(message = "Target completion date cannot be in the past")
    private LocalDate targetDate;
}
