package com.example.demo.repository;

import com.example.demo.entity.StudyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudyTaskRepository extends JpaRepository<StudyTask, Long> {

    List<StudyTask> findByStudentIdAndAssignedDateOrderByIdAsc(Long studentId, LocalDate assignedDate);

    List<StudyTask> findByStudentIdOrderByAssignedDateAscIdAsc(Long studentId);

    Optional<StudyTask> findByIdAndStudentId(Long taskId, Long studentId);

    void deleteByStudentIdAndCompletedFalse(Long studentId);
}
