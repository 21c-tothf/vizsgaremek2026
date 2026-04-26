package com.example.usedcars.service.impl;

import com.example.usedcars.dto.ImageResponse;
import com.example.usedcars.entity.Car;
import com.example.usedcars.entity.Image;
import com.example.usedcars.repository.CarRepository;
import com.example.usedcars.repository.ImageRepository;
import com.example.usedcars.service.ImageService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ImageServiceImpl implements ImageService {

    private static final int MAX_IMAGES_PER_LISTING = 8;

    private final CarRepository carRepository;
    private final ImageRepository imageRepository;

    @Override
    @Transactional
    public ImageResponse addImage(Long carId, Long actorUserId, boolean isAdmin, String imagePath) {
        Car car = getCarOrThrow(carId);
        validateOwnershipOrAdmin(car, actorUserId, isAdmin);
        if (imageRepository.countByCarId(carId) >= MAX_IMAGES_PER_LISTING) {
            throw new IllegalArgumentException("Maximum 8 images can be uploaded per listing");
        }

        Image image = Image.builder()
                .car(car)
                .imagePath(imagePath)
                .build();

        return toImageResponse(imageRepository.save(image));
    }

    @Override
    public List<ImageResponse> getImagesByCarId(Long carId) {
        return imageRepository.findByCarId(carId).stream().map(this::toImageResponse).toList();
    }

    @Override
    @Transactional
    public void deleteImage(Long imageId, Long actorUserId, boolean isAdmin) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        validateOwnershipOrAdmin(image.getCar(), actorUserId, isAdmin);
        imageRepository.delete(image);
    }

    private Car getCarOrThrow(Long carId) {
        return carRepository.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
    }

    private void validateOwnershipOrAdmin(Car car, Long actorUserId, boolean isAdmin) {
        if (isAdmin) {
            return;
        }
        if (car.getUser() == null || !car.getUser().getId().equals(actorUserId)) {
            throw new IllegalStateException("You can only modify images of your own cars");
        }
    }

    private ImageResponse toImageResponse(Image image) {
        ImageResponse response = new ImageResponse();
        response.setId(image.getId());
        response.setImagePath(image.getImagePath());
        return response;
    }
}
