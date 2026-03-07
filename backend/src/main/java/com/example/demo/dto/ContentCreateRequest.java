package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContentCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be at most 200 characters")
    private String title;

    @NotBlank(message = "Subject is required")
    @Size(max = 120, message = "Subject must be at most 120 characters")
    private String subject;

    @NotBlank(message = "Topic is required")
    @Size(max = 200, message = "Topic must be at most 200 characters")
    private String topic;

    @NotBlank(message = "Resource URL is required")
    @Size(max = 2000, message = "Resource URL is too long")
    private String resourceUrl;

    @Size(max = 1200, message = "Description must be at most 1200 characters")
    private String description;

    private Boolean premium;

    private Integer tokenCost;

    @Size(max = 120, message = "Campus must be at most 120 characters")
    private String campus;
}
