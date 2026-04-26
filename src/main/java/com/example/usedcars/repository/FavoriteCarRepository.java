package com.example.usedcars.repository;

import com.example.usedcars.entity.FavoriteCar;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteCarRepository extends JpaRepository<FavoriteCar, Long> {

    List<FavoriteCar> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<FavoriteCar> findByUserIdAndCarId(Long userId, Long carId);

    void deleteByUserIdAndCarId(Long userId, Long carId);

    void deleteByCarId(Long carId);
}
