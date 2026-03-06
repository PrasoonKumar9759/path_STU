package com.example.demo.service;

import com.example.demo.dto.StudyPlanRequest;
import com.example.demo.dto.StudyPlanResponse;
import com.example.demo.dto.StudyTaskResponse;
import com.example.demo.dto.TaskCompletionResponse;
import com.example.demo.entity.StudyTask;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.StudyTaskRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyPlannerService {

    private static final int XP_PER_TASK = 50;

    private final StudyTaskRepository studyTaskRepository;
    private final UserRepository userRepository;

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
                    .build();
        }

        task.setCompleted(true);
        task.setCompletedAt(LocalDateTime.now());
        StudyTask savedTask = studyTaskRepository.save(task);

        int totalXp = safeInt(student.getTotalXp()) + XP_PER_TASK;
        student.setTotalXp(totalXp);

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

        userRepository.save(student);

        return TaskCompletionResponse.builder()
                .task(toTaskResponse(savedTask))
                .xpAwarded(XP_PER_TASK)
                .totalXp(student.getTotalXp())
                .currentStreak(student.getCurrentStreak())
                .longestStreak(student.getLongestStreak())
                .build();
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
