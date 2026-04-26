package com.example.usedcars.service;

import com.example.usedcars.dto.ImageResponse;
import java.util.List;

public interface ImageService {

    ImageResponse addImage(Long carId, Long actorUserId, boolean isAdmin, String imagePath);

    List<ImageResponse> getImagesByCarId(Long carId);

    void deleteImage(Long imageId, Long actorUserId, boolean isAdmin);
}
