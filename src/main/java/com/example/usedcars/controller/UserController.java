package com.example.usedcars.controller;

import com.example.usedcars.dto.UpdateUserMeRequest;
import com.example.usedcars.dto.UserProfileResponse;
import com.example.usedcars.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMe(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMe(
            Authentication authentication,
            @Valid @RequestBody UpdateUserMeRequest request
    ) {
        return ResponseEntity.ok(userService.updateCurrentUserProfile(authentication.getName(), request));
    }
}
