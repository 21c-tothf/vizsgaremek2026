package com.example.usedcars.controller;

import com.example.usedcars.dto.AdminDashboardResponse;
import com.example.usedcars.dto.ListingSummaryResponse;
import com.example.usedcars.dto.UserProfileResponse;
import com.example.usedcars.service.AdminService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStatistics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/enable")
    public ResponseEntity<UserProfileResponse> enableUser(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adminService.enableUser(id));
    }

    @PatchMapping("/users/{id}/disable")
    public ResponseEntity<UserProfileResponse> disableUser(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adminService.disableUser(id));
    }

    @GetMapping("/listings")
    public ResponseEntity<List<ListingSummaryResponse>> getListings() {
        return ResponseEntity.ok(adminService.getAllListings());
    }

    @PatchMapping("/listings/{id}/enable")
    public ResponseEntity<ListingSummaryResponse> enableListing(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adminService.enableListing(id));
    }

    @PatchMapping("/listings/{id}/disable")
    public ResponseEntity<ListingSummaryResponse> disableListing(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adminService.disableListing(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/listings/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable("id") Long id) {
        adminService.deleteListing(id);
        return ResponseEntity.noContent().build();
    }
}
