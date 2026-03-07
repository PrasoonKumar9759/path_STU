package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenTransactionResponse {

    private Long id;
    private Integer amount;
    private String type;
    private String description;
    private LocalDateTime createdAt;
}
