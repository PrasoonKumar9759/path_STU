package com.example.demo.repository;

import com.example.demo.entity.TokenTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenTransactionRepository extends JpaRepository<TokenTransaction, Long> {

    List<TokenTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
