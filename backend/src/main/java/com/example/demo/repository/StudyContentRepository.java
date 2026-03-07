package com.example.demo.repository;

import com.example.demo.entity.StudyContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyContentRepository extends JpaRepository<StudyContent, Long> {

    @Query("""
            SELECT c
            FROM StudyContent c
            WHERE (:subject IS NULL OR LOWER(c.subject) = LOWER(:subject))
              AND (
                  :query IS NULL
                  OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%'))
                  OR LOWER(c.topic) LIKE LOWER(CONCAT('%', :query, '%'))
              )
            ORDER BY c.createdAt DESC
            """)
    List<StudyContent> search(@Param("subject") String subject, @Param("query") String query);

    @Query("""
            SELECT c
            FROM StudyContent c
            WHERE (:subject IS NULL OR LOWER(c.subject) = LOWER(:subject))
              AND (
                  :query IS NULL
                  OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%'))
                  OR LOWER(c.topic) LIKE LOWER(CONCAT('%', :query, '%'))
              )
            """)
    Page<StudyContent> searchPaged(@Param("subject") String subject,
                                   @Param("query") String query,
                                   Pageable pageable);

    @Query("""
            SELECT DISTINCT c.subject
            FROM StudyContent c
            ORDER BY c.subject ASC
            """)
    List<String> findDistinctSubjects();

    List<StudyContent> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);
}
