package com.example.usedcars.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class ListingUpdateRequest {

    @Size(max = 200)
    private String title;

    @Size(max = 5000)
    private String description;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;

    @Size(max = 100)
    private String brand;

    @Size(max = 100)
    private String model;

    @Min(1900)
    @Max(2100)
    private Integer manufactureYear;

    @Min(0)
    private Integer mileage;

    @Size(max = 50)
    private String fuelType;

    @Size(max = 50)
    private String transmission;

    @Size(max = 50)
    private String bodyType;

    @Size(max = 50)
    private String color;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal engineSize;

    @Min(1)
    private Integer horsepower;

    @Size(max = 150)
    private String location;

    @Size(max = 150)
    private String sellerName;

    @Size(max = 50)
    private String sellerPhone;

    @Email
    @Size(max = 150)
    private String sellerEmail;

    private Boolean isActive;
    private Boolean isFeatured;
}
