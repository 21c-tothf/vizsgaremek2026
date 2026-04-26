package com.example.usedcars.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class FavoriteResponse {

    private Long id;
    private Long userId;
    private Long listingId;
    private String listingTitle;
    private BigDecimal listingPrice;
    private String listingImageUrl;
    private LocalDateTime createdAt;
}
