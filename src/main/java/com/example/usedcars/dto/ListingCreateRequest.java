package com.example.usedcars.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class ListingCreateRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 5000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;

    @NotBlank
    @Size(max = 100)
    private String brand;

    @NotBlank
    @Size(max = 100)
    private String model;

    @NotNull
    @Min(1900)
    @Max(2100)
    private Integer manufactureYear;

    @NotNull
    @Min(0)
    private Integer mileage;

    @NotBlank
    @Size(max = 50)
    private String fuelType;

    @NotBlank
    @Size(max = 50)
    private String transmission;

    @NotBlank
    @Size(max = 50)
    private String bodyType;

    @NotBlank
    @Size(max = 50)
    private String color;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal engineSize;

    @NotNull
    @Min(1)
    private Integer horsepower;

    @NotBlank
    @Size(max = 150)
    private String location;

    @NotBlank
    @Size(max = 150)
    private String sellerName;

    @NotBlank
    @Size(max = 50)
    private String sellerPhone;

    @NotBlank
    @Email
    @Size(max = 150)
    private String sellerEmail;

    private Boolean isActive;
    private Boolean isFeatured;
}
