package com.example.usedcars.config;

import com.example.usedcars.entity.User;
import com.example.usedcars.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createOrUpdateUser(
                "Admin User",
                "admin@usedcars.com",
                "Admin123!",
                "+36111111111",
                "ADMIN"
        );

        createOrUpdateUser(
                "Normal User",
                "user@usedcars.com",
                "User123!",
                "+36222222222",
                "USER"
        );

        createOrUpdateUser(
                "Seed Admin",
                "seed-admin@usedcars.local",
                "seed-admin-password",
                "+36100000000",
                "ADMIN"
        );

        createOrUpdateUser(
                "Virag Balint Aladar",
                "balintaladar67@gmail.com",
                "seed-user-password",
                "+36506352978",
                "USER"
        );
    }

    private void createOrUpdateUser(String name, String email, String rawPassword, String phoneNumber, String role) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPhoneNumber(phoneNumber);
        user.setRole(role);
        user.setIsEnabled(true);
        userRepository.save(user);
    }
}
