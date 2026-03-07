package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PagedContentResponse {

    private List<ContentResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
