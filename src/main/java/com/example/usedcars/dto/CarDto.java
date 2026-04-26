package com.example.usedcars.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class CarDto {

    private Long id;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    private String title;

    @NotNull
    @Min(1886)
    private Integer year;

    @NotNull
    @Min(0)
    private Integer mileage;

    @NotBlank
    private String fuelType;

    @NotNull
    @Min(0)
    private Integer price;

    private Boolean isActive;

    private String description;

    private String location;
    private String sellerName;
    private String sellerPhone;
    private String sellerEmail;
    private String transmission;
    private String bodyType;
    private String color;
    private BigDecimal engineSize;
    private Integer horsepower;

    private Long userId;
    private LocalDateTime createdAt;
}
