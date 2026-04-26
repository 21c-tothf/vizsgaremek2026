package com.example.usedcars.service;

import com.example.usedcars.dto.RegisterRequest;
import com.example.usedcars.dto.UpdateUserMeRequest;
import com.example.usedcars.dto.UserProfileResponse;
import java.util.List;

public interface UserService {

    UserProfileResponse register(RegisterRequest request);

    UserProfileResponse getUserProfile(Long userId);

    UserProfileResponse getCurrentUserProfile(String email);

    UserProfileResponse updateCurrentUserProfile(String email, UpdateUserMeRequest request);

    List<UserProfileResponse> getAllUsers();

    void deleteUser(Long userId);
}
