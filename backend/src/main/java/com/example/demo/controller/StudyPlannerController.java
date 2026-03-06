package com.example.demo.controller;

import com.example.demo.dto.StudyPlanRequest;
import com.example.demo.dto.StudyPlanResponse;
import com.example.demo.dto.StudyTaskResponse;
import com.example.demo.dto.TaskCompletionResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.StudyPlannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/planner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudyPlannerController {

    private final StudyPlannerService studyPlannerService;

    @PostMapping("/generate")
    public ResponseEntity<StudyPlanResponse> generatePlan(
            @Valid @RequestBody StudyPlanRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(studyPlannerService.generatePlan(userDetails, request));
    }

    @GetMapping("/tasks/today")
    public ResponseEntity<List<StudyTaskResponse>> getTodayTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(studyPlannerService.getTodayTasks(userDetails));
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<StudyTaskResponse>> getAllTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(studyPlannerService.getAllTasks(userDetails));
    }

    @PostMapping("/tasks/{taskId}/complete")
    public ResponseEntity<TaskCompletionResponse> completeTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(studyPlannerService.completeTask(userDetails, taskId));
    }
}
