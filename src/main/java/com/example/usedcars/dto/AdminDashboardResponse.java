package com.example.usedcars.dto;

import java.util.List;
import lombok.Data;

@Data
public class AdminDashboardResponse {

    private Long totalUsers;
    private Long totalListings;
    private Long activeListings;
    private Long inactiveListings;
    private Long featuredListings;
    private Long totalFavorites;
    private List<ListingSummaryResponse> recentListings;
}
