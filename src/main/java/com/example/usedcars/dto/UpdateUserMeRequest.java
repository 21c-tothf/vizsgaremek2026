package com.example.usedcars.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserMeRequest {

    @NotBlank
    @Size(min = 2, max = 150)
    private String name;

    @Size(max = 20)
    private String phoneNumber;
}
