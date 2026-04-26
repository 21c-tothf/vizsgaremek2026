package com.example.usedcars.service.impl;

import com.example.usedcars.dto.CarDto;
import com.example.usedcars.entity.Car;
import com.example.usedcars.entity.User;
import com.example.usedcars.mapper.CarMapper;
import com.example.usedcars.repository.CarRepository;
import com.example.usedcars.repository.FavoriteCarRepository;
import com.example.usedcars.repository.UserRepository;
import com.example.usedcars.service.CarService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final CarMapper carMapper;
    private final UserRepository userRepository;
    private final FavoriteCarRepository favoriteCarRepository;

    @Override
    public CarDto createCar(CarDto carDto) {
        if (carDto == null) {
            throw new IllegalArgumentException("carDto must not be null");
        }
        if (carDto.getUserId() == null) {
            throw new IllegalArgumentException("userId must not be null");
        }
        Car entity = carMapper.toEntity(carDto);
        User user = userRepository.findById(carDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        entity.setUser(user);
        return carMapper.toDto(carRepository.save(entity));
    }

    @Override
    public CarDto getCarById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("id must not be null");
        }
        return carRepository.findById(id)
                .map(carMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
    }

    @Override
    public List<CarDto> getAllCars() {
        return carRepository.findAll().stream()
                .map(carMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getDistinctBrands() {
        return carRepository.findDistinctBrands();
    }

    @Override
    public CarDto updateCar(Long id, CarDto carDto) {
        if (id == null) {
            throw new IllegalArgumentException("id must not be null");
        }
        if (carDto == null) {
            throw new IllegalArgumentException("carDto must not be null");
        }
        Car entity = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));

        entity.setBrand(carDto.getBrand());
        entity.setModel(carDto.getModel());
        entity.setTitle(carDto.getTitle());
        entity.setYear(carDto.getYear());
        entity.setMileage(carDto.getMileage());
        entity.setFuelType(carDto.getFuelType());
        entity.setPrice(carDto.getPrice());
        if (carDto.getIsActive() != null) {
            entity.setIsActive(carDto.getIsActive());
        }
        entity.setDescription(carDto.getDescription());
        entity.setLocation(carDto.getLocation());
        entity.setSellerName(carDto.getSellerName());
        entity.setSellerPhone(carDto.getSellerPhone());
        entity.setSellerEmail(carDto.getSellerEmail());
        entity.setTransmission(carDto.getTransmission());
        entity.setBodyType(carDto.getBodyType());
        entity.setColor(carDto.getColor());
        entity.setEngineSize(carDto.getEngineSize());
        entity.setHorsepower(carDto.getHorsepower());
        if (carDto.getUserId() != null) {
            User user = userRepository.findById(carDto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            entity.setUser(user);
        }

        return carMapper.toDto(carRepository.save(entity));
    }

    @Override
    public void deleteCar(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("id must not be null");
        }
        // Elobb toroljuk a kapcsolodo kedvenceket, hogy ne legyen FK hiba.
        favoriteCarRepository.deleteByCarId(id);
        carRepository.deleteById(id);
    }
}
