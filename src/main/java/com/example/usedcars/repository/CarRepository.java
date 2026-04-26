package com.example.usedcars.repository;

import com.example.usedcars.entity.Car;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByUserId(Long userId);

    List<Car> findByBrandIgnoreCase(String brand);

    @Query("SELECT DISTINCT c.brand FROM Car c ORDER BY c.brand")
    List<String> findDistinctBrands();
}
