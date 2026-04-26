package com.example.usedcars.repository;

import com.example.usedcars.entity.Image;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findByCarId(Long carId);

    boolean existsByCarId(Long carId);

    long countByCarId(Long carId);
}
