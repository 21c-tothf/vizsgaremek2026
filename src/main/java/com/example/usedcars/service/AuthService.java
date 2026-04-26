package com.example.usedcars.service;

import com.example.usedcars.dto.AuthResponse;
import com.example.usedcars.dto.LoginRequest;
import com.example.usedcars.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
