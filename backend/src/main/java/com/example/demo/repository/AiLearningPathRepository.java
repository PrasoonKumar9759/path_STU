package com.example.demo.repository;

import com.example.demo.entity.AiLearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiLearningPathRepository extends JpaRepository<AiLearningPath, Long> {

    List<AiLearningPath> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
