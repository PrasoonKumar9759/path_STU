package com.example.demo.repository;

import com.example.demo.entity.ContentUnlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentUnlockRepository extends JpaRepository<ContentUnlock, Long> {

    boolean existsByStudentIdAndContentId(Long studentId, Long contentId);

    List<ContentUnlock> findByStudentId(Long studentId);
}
