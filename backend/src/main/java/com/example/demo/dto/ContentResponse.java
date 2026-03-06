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
public class ContentResponse {

    private Long id;
    private String title;
    private String subject;
    private String topic;
    private String resourceUrl;
    private String description;
    private Long creatorId;
    private String creatorName;
    private LocalDateTime createdAt;
}
