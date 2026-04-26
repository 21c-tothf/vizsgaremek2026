package com.example.usedcars.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ListingResponse {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private BigDecimal price;
    private String brand;
    private String model;
    private Integer manufactureYear;
    private Integer mileage;
    private String fuelType;
    private String transmission;
    private String bodyType;
    private String color;
    private BigDecimal engineSize;
    private Integer horsepower;
    private String location;
    private String sellerName;
    private String sellerPhone;
    private String sellerEmail;
    private Boolean isActive;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer favoriteCount;
    private List<ImageResponse> images;
}
