package com.example.usedcars.service.impl;

import com.example.usedcars.dto.RegisterRequest;
import com.example.usedcars.dto.UpdateUserMeRequest;
import com.example.usedcars.dto.UserProfileResponse;
import com.example.usedcars.entity.User;
import com.example.usedcars.repository.UserRepository;
import com.example.usedcars.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role("USER")
                .build();

        return toUserProfile(userRepository.save(user));
    }

    @Override
    public UserProfileResponse getUserProfile(Long userId) {
        return toUserProfile(getUserOrThrow(userId));
    }

    @Override
    public UserProfileResponse getCurrentUserProfile(String email) {
        return toUserProfile(getUserByEmailOrThrow(email));
    }

    @Override
    @Transactional
    public UserProfileResponse updateCurrentUserProfile(String email, UpdateUserMeRequest request) {
        User user = getUserByEmailOrThrow(email);
        user.setName(request.getName().trim());
        String phone = request.getPhoneNumber();
        user.setPhoneNumber(phone == null || phone.trim().isEmpty() ? null : phone.trim());
        return toUserProfile(userRepository.save(user));
    }

    @Override
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserProfile).toList();
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(userId);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private User getUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private UserProfileResponse toUserProfile(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setIsEnabled(user.getIsEnabled());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
