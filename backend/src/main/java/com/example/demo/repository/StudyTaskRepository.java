package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.StudyTask;

@Repository
public interface StudyTaskRepository extends JpaRepository<StudyTask, Long> {

    List<StudyTask> findByStudentIdAndAssignedDateOrderByIdAsc(Long studentId, LocalDate assignedDate);

    List<StudyTask> findByStudentIdOrderByAssignedDateAscIdAsc(Long studentId);

    Optional<StudyTask> findByIdAndStudentId(Long taskId, Long studentId);

    void deleteByStudentIdAndCompletedFalse(Long studentId);

    List<StudyTask> findByStudentIdAndCompletedFalseAndAssignedDateBeforeOrderByAssignedDateAsc(
            Long studentId, LocalDate date);

    List<StudyTask> findByStudentIdAndCompletedFalseAndAssignedDateGreaterThanEqualOrderByAssignedDateAsc(
            Long studentId, LocalDate date);

    List<StudyTask> findByStudentIdAndCompletedFalseOrderByAssignedDateAsc(Long studentId);

    List<StudyTask> findByStudentIdAndCompletedTrueOrderByCompletedAtDesc(Long studentId);
}
