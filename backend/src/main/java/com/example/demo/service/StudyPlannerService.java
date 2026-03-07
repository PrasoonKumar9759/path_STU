package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.RestructureResponse;
import com.example.demo.dto.StudyPlanRequest;
import com.example.demo.dto.StudyPlanResponse;
import com.example.demo.dto.StudyTaskResponse;
import com.example.demo.dto.TaskCompletionResponse;
import com.example.demo.entity.StudyTask;
import com.example.demo.entity.TokenTransaction;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.StudyTaskRepository;
import com.example.demo.repository.TokenTransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudyPlannerService {

    private static final int XP_PER_TASK = 50;
    private static final int TOKENS_PER_TASK = 10;

    private final StudyTaskRepository studyTaskRepository;
    private final UserRepository userRepository;
    private final TokenTransactionRepository tokenTransactionRepository;

    public StudyPlanResponse generatePlan(CustomUserDetails userDetails, StudyPlanRequest request) {
        User student = getStudentUser(userDetails.getId());

        List<String> topics = request.getTopics().stream()
                .map(String::trim)
                .filter(topic -> !topic.isBlank())
                .toList();

        if (topics.isEmpty()) {
            throw new RuntimeException("At least one valid topic is required");
        }

        LocalDate startDate = LocalDate.now();
        LocalDate targetDate = request.getTargetDate();
        long availableDays = ChronoUnit.DAYS.between(startDate, targetDate) + 1;

        if (availableDays <= 0) {
            throw new RuntimeException("Target date must be today or in the future");
        }

        studyTaskRepository.deleteByStudentIdAndCompletedFalse(student.getId());

        int totalTopics = topics.size();
        int totalDays = (int) availableDays;
        int basePerDay = totalTopics / totalDays;
        int extraDays = totalTopics % totalDays;

        List<StudyTask> generatedTasks = new ArrayList<>();
        int topicIndex = 0;

        for (int dayIndex = 0; dayIndex < totalDays && topicIndex < totalTopics; dayIndex++) {
            int tasksForDay = basePerDay + (dayIndex < extraDays ? 1 : 0);
            LocalDate assignedDate = startDate.plusDays(dayIndex);

            for (int i = 0; i < tasksForDay && topicIndex < totalTopics; i++) {
                StudyTask task = StudyTask.builder()
                        .student(student)
                        .subject(request.getSubject().trim())
                        .topic(topics.get(topicIndex))
                        .assignedDate(assignedDate)
                        .build();
                generatedTasks.add(task);
                topicIndex++;
            }
        }

        List<StudyTask> savedTasks = studyTaskRepository.saveAll(generatedTasks);

        return StudyPlanResponse.builder()
                .startDate(startDate)
                .targetDate(targetDate)
                .availableDays(availableDays)
                .totalTopics(totalTopics)
                .generatedTasks(savedTasks.stream().map(this::toTaskResponse).toList())
                .build();
    }

    @Transactional
    public RestructureResponse restructurePlan(CustomUserDetails userDetails) {
        User student = getStudentUser(userDetails.getId());
        LocalDate today = LocalDate.now();

        // Find overdue incomplete tasks (assigned before today, not completed)
        List<StudyTask> overdueTasks = studyTaskRepository
                .findByStudentIdAndCompletedFalseAndAssignedDateBeforeOrderByAssignedDateAsc(
                        student.getId(), today);

        if (overdueTasks.isEmpty()) {
            return RestructureResponse.builder()
                    .overdueTasks(0)
                    .redistributedTasks(0)
                    .remainingDays(0)
                    .message("No overdue tasks found. Your plan is on track!")
                    .updatedTasks(List.of())
                    .build();
        }

        // Find future incomplete tasks (today or later, not completed)
        List<StudyTask> futureTasks = studyTaskRepository
                .findByStudentIdAndCompletedFalseAndAssignedDateGreaterThanEqualOrderByAssignedDateAsc(
                        student.getId(), today);

        // Combine all incomplete tasks to redistribute
        List<StudyTask> allIncompleteTasks = new ArrayList<>();
        allIncompleteTasks.addAll(overdueTasks);
        allIncompleteTasks.addAll(futureTasks);

        // Find the latest assigned date to determine target
        LocalDate targetDate = allIncompleteTasks.stream()
                .map(StudyTask::getAssignedDate)
                .max(LocalDate::compareTo)
                .orElse(today);

        // If target is in the past, extend to give at least a few days buffer
        if (!targetDate.isAfter(today)) {
            targetDate = today.plusDays(Math.max(3, allIncompleteTasks.size()));
        }

        // Add buffer days proportional to overdue count to keep plan realistic
        long extraDays = Math.min(overdueTasks.size(), 7);
        targetDate = targetDate.plusDays(extraDays);

        long remainingDays = ChronoUnit.DAYS.between(today, targetDate) + 1;
        int totalTasks = allIncompleteTasks.size();
        int totalDays = (int) remainingDays;
        int basePerDay = totalTasks / totalDays;
        int extraTaskDays = totalTasks % totalDays;

        // Redistribute tasks evenly across remaining days
        int taskIndex = 0;
        for (int dayIndex = 0; dayIndex < totalDays && taskIndex < totalTasks; dayIndex++) {
            int tasksForDay = basePerDay + (dayIndex < extraTaskDays ? 1 : 0);
            LocalDate assignedDate = today.plusDays(dayIndex);

            for (int i = 0; i < tasksForDay && taskIndex < totalTasks; i++) {
                allIncompleteTasks.get(taskIndex).setAssignedDate(assignedDate);
                taskIndex++;
            }
        }

        List<StudyTask> savedTasks = studyTaskRepository.saveAll(allIncompleteTasks);

        return RestructureResponse.builder()
                .overdueTasks(overdueTasks.size())
                .redistributedTasks(totalTasks)
                .remainingDays(totalDays)
                .message(String.format(
                        "Restructured %d overdue tasks. %d total tasks spread across %d days. You've got this!",
                        overdueTasks.size(), totalTasks, totalDays))
                .updatedTasks(savedTasks.stream().map(this::toTaskResponse).toList())
                .build();
    }

    public List<StudyTaskResponse> getTodayTasks(CustomUserDetails userDetails) {
        Long studentId = userDetails.getId();
        LocalDate today = LocalDate.now();

        return studyTaskRepository.findByStudentIdAndAssignedDateOrderByIdAsc(studentId, today)
                .stream()
                .map(this::toTaskResponse)
                .toList();
    }

    public List<StudyTaskResponse> getAllTasks(CustomUserDetails userDetails) {
        Long studentId = userDetails.getId();

        return studyTaskRepository.findByStudentIdOrderByAssignedDateAscIdAsc(studentId)
                .stream()
                .map(this::toTaskResponse)
                .toList();
    }

    public int getOverdueCount(Long studentId) {
        return studyTaskRepository
                .findByStudentIdAndCompletedFalseAndAssignedDateBeforeOrderByAssignedDateAsc(
                        studentId, LocalDate.now())
                .size();
    }

    public List<StudyTaskResponse> getCompletedTasks(CustomUserDetails userDetails) {
        return studyTaskRepository.findByStudentIdAndCompletedTrueOrderByCompletedAtDesc(userDetails.getId())
                .stream()
                .map(this::toTaskResponse)
                .toList();
    }

    @Transactional
    public TaskCompletionResponse completeTask(CustomUserDetails userDetails, Long taskId) {
        Long studentId = userDetails.getId();

        StudyTask task = studyTaskRepository.findByIdAndStudentId(taskId, studentId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User student = getStudentUser(studentId);

        if (task.isCompleted()) {
            return TaskCompletionResponse.builder()
                    .task(toTaskResponse(task))
                    .xpAwarded(0)
                    .totalXp(safeInt(student.getTotalXp()))
                    .currentStreak(safeInt(student.getCurrentStreak()))
                    .longestStreak(safeInt(student.getLongestStreak()))
                    .tokensAwarded(0)
                    .tokenBalance(safeInt(student.getTokenBalance()))
                    .build();
        }

        task.setCompleted(true);
        task.setCompletedAt(LocalDateTime.now());
        StudyTask savedTask = studyTaskRepository.save(task);

        // Award XP
        int totalXp = safeInt(student.getTotalXp()) + XP_PER_TASK;
        student.setTotalXp(totalXp);

        // Award tokens for task completion
        int tokensAwarded = TOKENS_PER_TASK;
        int tokenBalance = safeInt(student.getTokenBalance()) + tokensAwarded;
        student.setTokenBalance(tokenBalance);

        // Record token transaction
        tokenTransactionRepository.save(TokenTransaction.builder()
                .user(student)
                .amount(tokensAwarded)
                .type(TokenTransaction.TransactionType.TASK_COMPLETION)
                .description("Completed: " + task.getTopic())
                .build());

        // Update streak
        LocalDate today = LocalDate.now();
        LocalDate lastActivityDate = student.getLastActivityDate() == null
                ? null
                : student.getLastActivityDate().toLocalDate();

        int currentStreak = safeInt(student.getCurrentStreak());
        if (lastActivityDate == null) {
            currentStreak = 1;
        } else if (lastActivityDate.isEqual(today.minusDays(1))) {
            currentStreak += 1;
        } else if (!lastActivityDate.isEqual(today)) {
            currentStreak = 1;
        }

        student.setCurrentStreak(currentStreak);
        student.setLongestStreak(Math.max(safeInt(student.getLongestStreak()), currentStreak));
        student.setLastActivityDate(LocalDateTime.now());

        // Check for streak bonuses
        int streakBonus = calculateStreakBonus(currentStreak);
        if (streakBonus > 0 && (lastActivityDate == null || !lastActivityDate.isEqual(today))) {
            tokensAwarded += streakBonus;
            student.setTokenBalance(safeInt(student.getTokenBalance()) + streakBonus);

            tokenTransactionRepository.save(TokenTransaction.builder()
                    .user(student)
                    .amount(streakBonus)
                    .type(TokenTransaction.TransactionType.STREAK_BONUS)
                    .description(currentStreak + "-day streak bonus!")
                    .build());
        }

        userRepository.save(student);

        return TaskCompletionResponse.builder()
                .task(toTaskResponse(savedTask))
                .xpAwarded(XP_PER_TASK)
                .totalXp(student.getTotalXp())
                .currentStreak(student.getCurrentStreak())
                .longestStreak(student.getLongestStreak())
                .tokensAwarded(tokensAwarded)
                .tokenBalance(student.getTokenBalance())
                .build();
    }

    private int calculateStreakBonus(int currentStreak) {
        if (currentStreak >= 30) return 200;
        if (currentStreak >= 14) return 100;
        if (currentStreak >= 7) return 50;
        if (currentStreak >= 3) return 20;
        return 0;
    }

    private User getStudentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.STUDENT) {
            throw new RuntimeException("Only students can access planner tasks");
        }

        return user;
    }

    private int safeInt(Integer value) {
        return value == null ? 0 : value;
    }

    private StudyTaskResponse toTaskResponse(StudyTask task) {
        return StudyTaskResponse.builder()
                .id(task.getId())
                .subject(task.getSubject())
                .topic(task.getTopic())
                .assignedDate(task.getAssignedDate())
                .completed(task.isCompleted())
                .completedAt(task.getCompletedAt())
                .build();
    }
}
