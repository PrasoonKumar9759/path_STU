package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RestructureResponse;
import com.example.demo.dto.StudyPlanRequest;
import com.example.demo.dto.StudyPlanResponse;
import com.example.demo.dto.StudyTaskResponse;
import com.example.demo.dto.TaskCompletionResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.StudyPlannerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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

    @PostMapping("/restructure")
    public ResponseEntity<RestructureResponse> restructurePlan(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(studyPlannerService.restructurePlan(userDetails));
    }

    @GetMapping("/tasks/today")
    public ResponseEntity<List<StudyTaskResponse>> getTodayTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(studyPlannerService.getTodayTasks(userDetails));
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<StudyTaskResponse>> getAllTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(studyPlannerService.getAllTasks(userDetails));
    }

    @GetMapping("/overdue-count")
    public ResponseEntity<Map<String, Integer>> getOverdueCount(@AuthenticationPrincipal CustomUserDetails userDetails) {
        int count = studyPlannerService.getOverdueCount(userDetails.getId());
        return ResponseEntity.ok(Map.of("overdueCount", count));
    }

    @PostMapping("/tasks/{taskId}/complete")
    public ResponseEntity<TaskCompletionResponse> completeTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(studyPlannerService.completeTask(userDetails, taskId));
    }

    @GetMapping("/tasks/completed")
    public ResponseEntity<List<StudyTaskResponse>> getCompletedTasks(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(studyPlannerService.getCompletedTasks(userDetails));
    }
}
