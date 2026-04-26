package com.example.usedcars.controller;

import com.example.usedcars.dto.CarDto;
import com.example.usedcars.dto.ListingCreateRequest;
import com.example.usedcars.dto.ListingResponse;
import com.example.usedcars.dto.ListingSummaryResponse;
import com.example.usedcars.dto.ListingUpdateRequest;
import com.example.usedcars.entity.User;
import com.example.usedcars.repository.UserRepository;
import com.example.usedcars.service.CarService;
import com.example.usedcars.service.ImageService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingCompatController {

    private final CarService carService;
    private final UserRepository userRepository;
    private final ImageService imageService;

    /**
     * Hirdetesek listazasa query paramos szurokkel.
     */
    @GetMapping
    public ResponseEntity<List<ListingSummaryResponse>> getListings(
            @RequestParam(name = "size", required = false) Integer size,
            @RequestParam(name = "query", required = false) String query,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "model", required = false) String model,
            @RequestParam(name = "minPrice", required = false) Integer minPrice,
            @RequestParam(name = "maxPrice", required = false) Integer maxPrice,
            @RequestParam(name = "minYear", required = false) Integer minYear,
            @RequestParam(name = "maxYear", required = false) Integer maxYear,
            @RequestParam(name = "minMileage", required = false) Integer minMileage,
            @RequestParam(name = "maxMileage", required = false) Integer maxMileage,
            @RequestParam(name = "fuelType", required = false) String fuelType,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "sortDirection", required = false) String sortDirection
    ) {
        String effectiveSort = resolveSort(sort, sortBy, sortDirection);
        List<ListingSummaryResponse> mapped = carService.getAllCars().stream()
                .filter(car -> matchesQuery(car, query))
                .filter(car -> matchesBrand(car, brand))
                .filter(car -> matchesModel(car, model))
                .filter(car -> minPrice == null || (car.getPrice() != null && car.getPrice() >= minPrice))
                .filter(car -> maxPrice == null || (car.getPrice() != null && car.getPrice() <= maxPrice))
                .filter(car -> minYear == null || (car.getYear() != null && car.getYear() >= minYear))
                .filter(car -> maxYear == null || (car.getYear() != null && car.getYear() <= maxYear))
                .filter(car -> minMileage == null
                        || (car.getMileage() != null && car.getMileage() >= minMileage))
                .filter(car -> maxMileage == null
                        || (car.getMileage() != null && car.getMileage() <= maxMileage))
                .filter(car -> matchesFuelType(car, fuelType))
                .map(this::toSummary)
                .collect(Collectors.toCollection(ArrayList::new));
        sortInPlace(mapped, effectiveSort);
        if (size != null && size > 0 && mapped.size() > size) {
            return ResponseEntity.ok(new ArrayList<>(mapped.subList(0, size)));
        }
        return ResponseEntity.ok(mapped);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingSummaryResponse>> getMyListings(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        List<ListingSummaryResponse> mapped = carService.getAllCars().stream()
                .filter(car -> user.getId().equals(car.getUserId()))
                .map(this::toSummary)
                .toList();
        return ResponseEntity.ok(mapped);
    }

    @PostMapping
    public ResponseEntity<ListingResponse> createListing(
            @Valid @RequestBody ListingCreateRequest request,
            Authentication authentication
    ) {
        User user = resolveCurrentUser(authentication);
        CarDto create = new CarDto();
        create.setBrand(request.getBrand());
        create.setModel(request.getModel());
        create.setTitle(request.getTitle());
        create.setYear(request.getManufactureYear());
        create.setMileage(request.getMileage());
        create.setFuelType(request.getFuelType());
        create.setPrice(request.getPrice().intValue());
        create.setDescription(request.getDescription());
        create.setLocation(request.getLocation());
        create.setSellerName(request.getSellerName());
        create.setSellerPhone(request.getSellerPhone());
        create.setSellerEmail(request.getSellerEmail());
        create.setTransmission(request.getTransmission());
        create.setBodyType(request.getBodyType());
        create.setColor(request.getColor());
        create.setEngineSize(request.getEngineSize());
        create.setHorsepower(request.getHorsepower());
        create.setIsActive(true);
        create.setUserId(user.getId());

        CarDto saved = carService.createCar(create);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDetails(saved, request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> updateListing(
            @PathVariable("id") Long id,
            @Valid @RequestBody ListingUpdateRequest request
    ) {
        CarDto current = carService.getCarById(id);
        CarDto update = new CarDto();
        update.setBrand(request.getBrand() != null ? request.getBrand() : current.getBrand());
        update.setModel(request.getModel() != null ? request.getModel() : current.getModel());
        update.setTitle(request.getTitle() != null ? request.getTitle() : current.getTitle());
        update.setYear(request.getManufactureYear() != null ? request.getManufactureYear() : current.getYear());
        update.setMileage(request.getMileage() != null ? request.getMileage() : current.getMileage());
        update.setFuelType(request.getFuelType() != null ? request.getFuelType() : current.getFuelType());
        update.setPrice(request.getPrice() != null ? request.getPrice().intValue() : current.getPrice());
        update.setDescription(request.getDescription() != null ? request.getDescription() : current.getDescription());
        update.setLocation(request.getLocation() != null ? request.getLocation() : current.getLocation());
        update.setSellerName(request.getSellerName() != null ? request.getSellerName() : current.getSellerName());
        update.setSellerPhone(request.getSellerPhone() != null ? request.getSellerPhone() : current.getSellerPhone());
        update.setSellerEmail(request.getSellerEmail() != null ? request.getSellerEmail() : current.getSellerEmail());
        update.setTransmission(request.getTransmission() != null ? request.getTransmission() : current.getTransmission());
        update.setBodyType(request.getBodyType() != null ? request.getBodyType() : current.getBodyType());
        update.setColor(request.getColor() != null ? request.getColor() : current.getColor());
        update.setEngineSize(request.getEngineSize() != null ? request.getEngineSize() : current.getEngineSize());
        update.setHorsepower(request.getHorsepower() != null ? request.getHorsepower() : current.getHorsepower());
        update.setIsActive(current.getIsActive());
        update.setUserId(current.getUserId());

        CarDto saved = carService.updateCar(id, update);
        return ResponseEntity.ok(toDetails(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable("id") Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> listBrands() {
        return ResponseEntity.ok(carService.getDistinctBrands());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable("id") Long id) {
        CarDto car = carService.getCarById(id);
        return ResponseEntity.ok(toDetails(car));
    }

    private ListingSummaryResponse toSummary(CarDto car) {
        String coverImage = null;
        if (car.getId() != null) {
            coverImage = imageService.getImagesByCarId(car.getId()).stream()
                    .findFirst()
                    .map(image -> image.getImagePath())
                    .orElse(null);
        }
        ListingSummaryResponse response = new ListingSummaryResponse();
        response.setId(car.getId());
        response.setBrand(car.getBrand());
        response.setModel(car.getModel());
        response.setTitle(resolveTitle(car));
        response.setPrice(BigDecimal.valueOf(car.getPrice() == null ? 0 : car.getPrice()));
        response.setManufactureYear(car.getYear());
        response.setMileage(car.getMileage());
        response.setLocation(car.getLocation() != null ? car.getLocation() : "Hungary");
        response.setSellerName(null);
        response.setIsActive(car.getIsActive());
        response.setIsFeatured(false);
        response.setCoverImageUrl(coverImage);
        response.setCreatedAt(car.getCreatedAt());
        return response;
    }

    private ListingResponse toDetails(CarDto car) {
        return toDetails(car, null, null);
    }

    private ListingResponse toDetails(CarDto car, ListingCreateRequest request, User user) {
        User owner = user;
        if (owner == null && car.getUserId() != null) {
            owner = userRepository.findById(car.getUserId()).orElse(null);
        }

        ListingResponse response = new ListingResponse();
        response.setId(car.getId());
        response.setUserId(car.getUserId());
        response.setTitle(resolveTitle(car));
        response.setDescription(car.getDescription());
        response.setPrice(BigDecimal.valueOf(car.getPrice() == null ? 0 : car.getPrice()));
        response.setBrand(car.getBrand());
        response.setModel(car.getModel());
        response.setManufactureYear(car.getYear());
        response.setMileage(car.getMileage());
        response.setFuelType(car.getFuelType());
        response.setTransmission(car.getTransmission() != null ? car.getTransmission() : "Unknown");
        response.setBodyType(car.getBodyType() != null ? car.getBodyType() : "Unknown");
        response.setColor(car.getColor());
        response.setEngineSize(car.getEngineSize());
        response.setHorsepower(car.getHorsepower());
        response.setLocation(car.getLocation() != null
                ? car.getLocation()
                : (request != null ? request.getLocation() : "Hungary"));
        response.setSellerName(request != null
                ? request.getSellerName()
                : (car.getSellerName() != null ? car.getSellerName() : (owner != null ? owner.getName() : "Seller")));
        response.setSellerPhone(request != null
                ? request.getSellerPhone()
                : (car.getSellerPhone() != null ? car.getSellerPhone() : (owner != null ? owner.getPhoneNumber() : null)));
        response.setSellerEmail(request != null
                ? request.getSellerEmail()
                : (car.getSellerEmail() != null ? car.getSellerEmail() : (owner != null ? owner.getEmail() : null)));
        response.setIsActive(car.getIsActive());
        response.setIsFeatured(request != null ? Boolean.TRUE.equals(request.getIsFeatured()) : false);
        response.setCreatedAt(null);
        response.setUpdatedAt(null);
        response.setFavoriteCount(0);
        if (car.getId() != null) {
            response.setImages(imageService.getImagesByCarId(car.getId()));
        } else {
            response.setImages(List.of());
        }
        return response;
    }

    private User resolveCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    private static boolean matchesQuery(CarDto car, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }
        String t = car.getTitle() == null ? "" : car.getTitle();
        String b = car.getBrand() == null ? "" : car.getBrand();
        String m = car.getModel() == null ? "" : car.getModel();
        return (t + " " + b + " " + m).toLowerCase().contains(query.toLowerCase());
    }

    private static String resolveTitle(CarDto car) {
        if (car.getTitle() != null && !car.getTitle().isBlank()) {
            return car.getTitle();
        }
        return car.getBrand() + " " + car.getModel();
    }

    private static boolean matchesBrand(CarDto car, String brand) {
        if (brand == null || brand.isBlank()) {
            return true;
        }
        return car.getBrand() != null && car.getBrand().equalsIgnoreCase(brand.trim());
    }

    private static boolean matchesModel(CarDto car, String model) {
        if (model == null || model.isBlank()) {
            return true;
        }
        return car.getModel() != null && car.getModel().equalsIgnoreCase(model.trim());
    }

    private static boolean matchesFuelType(CarDto car, String fuelType) {
        if (fuelType == null || fuelType.isBlank()) {
            return true;
        }
        return car.getFuelType() != null && car.getFuelType().equalsIgnoreCase(fuelType.trim());
    }

    /**
     * Rendezes mezo es irany alapjan.
     * Letrehozas szerinti rendezesnel ideiglenesen az azonositot hasznaljuk.
     */
    private static String resolveSort(
            String sort,
            String sortBy,
            String sortDirection
    ) {
        // A kulon kuldott rendezesi adatok megbizhatobbak.
        if (sortBy != null && !sortBy.isBlank() && sortDirection != null && !sortDirection.isBlank()) {
            return sortBy.trim() + "," + sortDirection.trim();
        }
        if (sort != null && !sort.isBlank()) {
            return sort.trim();
        }
        return "createdAt,desc";
    }

    private static void sortInPlace(
            List<ListingSummaryResponse> list,
            String sort
    ) {
        if (list == null || list.isEmpty()) {
            return;
        }
        String[] parts = sort.split(",");
        String field = parts[0].trim();
        String direction = "desc";
        if (parts.length > 1) {
            direction = parts[1].trim();
        }
        boolean asc = "asc".equalsIgnoreCase(direction);

        Comparator<ListingSummaryResponse> cmp = switch (field) {
            case "price" -> Comparator.comparing(
                    ListingSummaryResponse::getPrice,
                    Comparator.nullsLast(Comparator.naturalOrder())
            );
            case "manufactureYear" -> Comparator.comparing(
                    ListingSummaryResponse::getManufactureYear,
                    Comparator.nullsLast(Comparator.naturalOrder())
            );
            case "mileage" -> Comparator.comparing(
                    ListingSummaryResponse::getMileage,
                    Comparator.nullsLast(Comparator.naturalOrder())
            );
            case "createdAt" -> Comparator.comparing(
                    ListingSummaryResponse::getId,
                    Comparator.nullsLast(Comparator.naturalOrder())
            );
            default -> Comparator.comparing(
                    ListingSummaryResponse::getId,
                    Comparator.nullsLast(Comparator.naturalOrder())
            );
        };
        if (!asc) {
            cmp = cmp.reversed();
        }
        list.sort(cmp);
    }
}
