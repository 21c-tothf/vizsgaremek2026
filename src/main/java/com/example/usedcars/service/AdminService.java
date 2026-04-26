package com.example.usedcars.service;

import com.example.usedcars.dto.AdminDashboardResponse;
import com.example.usedcars.dto.ListingSummaryResponse;
import com.example.usedcars.dto.UserProfileResponse;
import java.util.List;

public interface AdminService {

    AdminDashboardResponse getDashboardStatistics();

    List<UserProfileResponse> getAllUsers();

    List<ListingSummaryResponse> getAllListings();

    ListingSummaryResponse enableListing(Long listingId);

    ListingSummaryResponse disableListing(Long listingId);

    UserProfileResponse enableUser(Long userId);

    UserProfileResponse disableUser(Long userId);

    void deleteUser(Long userId);

    void deleteListing(Long listingId);
}

