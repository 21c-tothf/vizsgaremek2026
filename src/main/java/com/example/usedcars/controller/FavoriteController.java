package com.example.usedcars.controller;

import com.example.usedcars.dto.FavoriteResponse;
import com.example.usedcars.entity.Car;
import com.example.usedcars.entity.FavoriteCar;
import com.example.usedcars.entity.User;
import com.example.usedcars.repository.CarRepository;
import com.example.usedcars.repository.FavoriteCarRepository;
import com.example.usedcars.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteController {

    private final FavoriteCarRepository favoriteCarRepository;
    private final UserRepository userRepository;
    private final CarRepository carRepository;

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites(Authentication authentication) {
        User user = resolveCurrentUser(authentication);
        List<FavoriteResponse> response = favoriteCarRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{listingId}")
    @Transactional
    public ResponseEntity<FavoriteResponse> addFavorite(
            @PathVariable("listingId") Long listingId,
            Authentication authentication
    ) {
        User user = resolveCurrentUser(authentication);
        Car car = carRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        FavoriteCar favorite = favoriteCarRepository.findByUserIdAndCarId(user.getId(), listingId)
                .orElseGet(() -> {
                    FavoriteCar next = new FavoriteCar();
                    next.setUser(user);
                    next.setCar(car);
                    return favoriteCarRepository.save(next);
                });

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(favorite));
    }

    @DeleteMapping("/{listingId}")
    @Transactional
    public ResponseEntity<Void> removeFavorite(
            @PathVariable("listingId") Long listingId,
            Authentication authentication
    ) {
        User user = resolveCurrentUser(authentication);
        favoriteCarRepository.deleteByUserIdAndCarId(user.getId(), listingId);
        return ResponseEntity.noContent().build();
    }

    private User resolveCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    private FavoriteResponse toResponse(FavoriteCar favorite) {
        FavoriteResponse response = new FavoriteResponse();
        response.setId(favorite.getId());
        response.setUserId(favorite.getUser().getId());
        response.setListingId(favorite.getCar().getId());
        response.setListingTitle(favorite.getCar().getBrand() + " " + favorite.getCar().getModel());
        response.setListingPrice(favorite.getCar().getPrice() == null ? null : java.math.BigDecimal.valueOf(favorite.getCar().getPrice()));
        response.setListingImageUrl(favorite.getCar().getImages().stream().findFirst().map(image -> image.getImagePath()).orElse(null));
        response.setCreatedAt(favorite.getCreatedAt());
        return response;
    }
}
