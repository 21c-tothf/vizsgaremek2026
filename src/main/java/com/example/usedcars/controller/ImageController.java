package com.example.usedcars.controller;

import com.example.usedcars.dto.ImageResponse;
import com.example.usedcars.entity.User;
import com.example.usedcars.repository.UserRepository;
import com.example.usedcars.service.ImageService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final UserRepository userRepository;
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/api/cars/{carId}/images")
    public ResponseEntity<ImageResponse> addImage(
            @PathVariable("carId") Long carId,
            Authentication authentication,
            @RequestParam String imagePath
    ) {
        Long userId = resolveCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);
        ImageResponse response = imageService.addImage(
                carId,
                userId,
                isAdmin,
                imagePath
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/api/listings/{listingId}/images")
    public ResponseEntity<ImageResponse> uploadListingImage(
            @PathVariable("listingId") Long listingId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }
        Long userId = resolveCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);
        String publicPath = storeFile(file);
        ImageResponse response = imageService.addImage(
                listingId,
                userId,
                isAdmin,
                publicPath
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/api/images/{id}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable("id") Long imageId,
            Authentication authentication
    ) {
        Long userId = resolveCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);
        imageService.deleteImage(imageId, userId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        return user.getId();
    }

    private String storeFile(MultipartFile file) {
        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            String original = file.getOriginalFilename();
            String extension = "";
            if (original != null) {
                int dotIndex = original.lastIndexOf('.');
                if (dotIndex >= 0) {
                    extension = original.substring(dotIndex);
                }
            }
            String filename = UUID.randomUUID() + extension;
            Path destination = dir.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to store image file", ex);
        }
    }
}
