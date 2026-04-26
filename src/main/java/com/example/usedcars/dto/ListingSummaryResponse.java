package com.example.usedcars.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ListingSummaryResponse {

    private Long id;
    private String title;
    private BigDecimal price;
    private String brand;
    private String model;
    private Integer manufactureYear;
    private Integer mileage;
    private String location;
    private String sellerName;
    private String coverImageUrl;
    private Boolean isActive;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
}
