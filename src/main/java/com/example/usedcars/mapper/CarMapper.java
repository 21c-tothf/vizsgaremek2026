package com.example.usedcars.mapper;

import com.example.usedcars.dto.CarDto;
import com.example.usedcars.entity.Car;
import org.springframework.stereotype.Component;

@Component
public class CarMapper {

    public CarDto toDto(Car car) {
        if (car == null) {
            return null;
        }

        CarDto dto = new CarDto();
        dto.setId(car.getId());
        dto.setBrand(car.getBrand());
        dto.setModel(car.getModel());
        dto.setTitle(car.getTitle());
        dto.setYear(car.getYear());
        dto.setMileage(car.getMileage());
        dto.setFuelType(car.getFuelType());
        dto.setPrice(car.getPrice());
        dto.setIsActive(car.getIsActive());
        dto.setDescription(car.getDescription());
        dto.setLocation(car.getLocation());
        dto.setSellerName(car.getSellerName());
        dto.setSellerPhone(car.getSellerPhone());
        dto.setSellerEmail(car.getSellerEmail());
        dto.setTransmission(car.getTransmission());
        dto.setBodyType(car.getBodyType());
        dto.setColor(car.getColor());
        dto.setEngineSize(car.getEngineSize());
        dto.setHorsepower(car.getHorsepower());
        dto.setUserId(car.getUser() != null ? car.getUser().getId() : null);
        dto.setCreatedAt(car.getCreatedAt());
        return dto;
    }

    public Car toEntity(CarDto dto) {
        if (dto == null) {
            return null;
        }

        Car car = new Car();
        car.setBrand(dto.getBrand());
        car.setModel(dto.getModel());
        car.setTitle(dto.getTitle());
        car.setYear(dto.getYear());
        car.setMileage(dto.getMileage());
        car.setFuelType(dto.getFuelType());
        car.setPrice(dto.getPrice());
        car.setIsActive(dto.getIsActive());
        car.setDescription(dto.getDescription());
        car.setLocation(dto.getLocation());
        car.setSellerName(dto.getSellerName());
        car.setSellerPhone(dto.getSellerPhone());
        car.setSellerEmail(dto.getSellerEmail());
        car.setTransmission(dto.getTransmission());
        car.setBodyType(dto.getBodyType());
        car.setColor(dto.getColor());
        car.setEngineSize(dto.getEngineSize());
        car.setHorsepower(dto.getHorsepower());
        return car;
    }
}
