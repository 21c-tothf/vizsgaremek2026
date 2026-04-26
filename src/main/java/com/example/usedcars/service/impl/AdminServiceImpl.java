package com.example.usedcars.service.impl;

import com.example.usedcars.dto.AdminDashboardResponse;
import com.example.usedcars.dto.ListingSummaryResponse;
import com.example.usedcars.dto.UserProfileResponse;
import com.example.usedcars.entity.Car;
import com.example.usedcars.entity.User;
import com.example.usedcars.repository.CarRepository;
import com.example.usedcars.repository.FavoriteCarRepository;
import com.example.usedcars.repository.UserRepository;
import com.example.usedcars.service.AdminService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final FavoriteCarRepository favoriteCarRepository;

    @Override
    public AdminDashboardResponse getDashboardStatistics() {
        AdminDashboardResponse response = new AdminDashboardResponse();

        List<Car> cars = carRepository.findAll();
        long activeListings = cars.stream().filter(car -> Boolean.TRUE.equals(car.getIsActive())).count();
        long inactiveListings = cars.size() - activeListings;

        response.setTotalUsers(userRepository.count());
        response.setTotalListings((long) cars.size());
        response.setActiveListings(activeListings);
        response.setInactiveListings(inactiveListings);
        response.setFeaturedListings(0L);
        response.setTotalFavorites(0L);

        return response;
    }

    @Override
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserProfile).toList();
    }

    @Override
    public List<ListingSummaryResponse> getAllListings() {
        return carRepository.findAll().stream().map(this::toListingSummary).toList();
    }

    @Override
    @Transactional
    public ListingSummaryResponse enableListing(Long listingId) {
        Car car = carRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        car.setIsActive(true);
        return toListingSummary(carRepository.save(car));
    }

    @Override
    @Transactional
    public ListingSummaryResponse disableListing(Long listingId) {
        Car car = carRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        car.setIsActive(false);
        return toListingSummary(carRepository.save(car));
    }

    @Override
    @Transactional
    public UserProfileResponse enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsEnabled(true);
        return toUserProfile(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserProfileResponse disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() != null && user.getRole().toUpperCase().contains("ADMIN")) {
            throw new IllegalArgumentException("Admin account cannot be disabled");
        }
        user.setIsEnabled(false);
        return toUserProfile(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() != null && user.getRole().toUpperCase().contains("ADMIN")) {
            throw new IllegalArgumentException("Admin account cannot be deleted");
        }
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional
    public void deleteListing(Long listingId) {
        if (!carRepository.existsById(listingId)) {
            throw new IllegalArgumentException("Listing not found");
        }
        // Elobb toroljuk a kapcsolodo kedvenceket, hogy ne legyen FK hiba.
        favoriteCarRepository.deleteByCarId(listingId);
        carRepository.deleteById(listingId);
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

    private ListingSummaryResponse toListingSummary(Car car) {
        ListingSummaryResponse response = new ListingSummaryResponse();
        response.setId(car.getId());
        response.setTitle(car.getBrand() + " " + car.getModel());
        response.setPrice(car.getPrice() == null ? null : java.math.BigDecimal.valueOf(car.getPrice()));
        response.setBrand(car.getBrand());
        response.setModel(car.getModel());
        response.setManufactureYear(car.getYear());
        response.setMileage(car.getMileage());
        response.setLocation("Hungary");
        response.setSellerName(car.getUser() != null ? car.getUser().getName() : null);
        response.setCoverImageUrl(car.getImages().stream().findFirst().map(image -> image.getImagePath()).orElse(null));
        response.setIsActive(car.getIsActive());
        response.setIsFeatured(false);
        response.setCreatedAt(car.getCreatedAt());
        return response;
    }
}

