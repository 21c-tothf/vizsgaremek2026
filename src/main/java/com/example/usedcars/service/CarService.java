package com.example.usedcars.service;

import com.example.usedcars.dto.CarDto;
import java.util.List;

public interface CarService {

    CarDto createCar(CarDto carDto);

    CarDto getCarById(Long id);

    List<CarDto> getAllCars();

    /**
     * Egyedi markanevek a szurokhoz.
     */
    List<String> getDistinctBrands();

    CarDto updateCar(Long id, CarDto carDto);

    void deleteCar(Long id);
}
