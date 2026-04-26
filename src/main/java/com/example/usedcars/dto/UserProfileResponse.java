package com.example.usedcars.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private Boolean isEnabled;
    private LocalDateTime createdAt;
}
