CREATE DATABASE IF NOT EXISTS used_cars_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE used_cars_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NULL,
  phone VARCHAR(50) NULL,
  role VARCHAR(50) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listings (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price DECIMAL(12,2) NOT NULL,
  brand VARCHAR(100) NULL,
  model VARCHAR(100) NULL,
  manufacture_year INT NULL,
  mileage INT NULL,
  fuel_type VARCHAR(50) NULL,
  transmission VARCHAR(50) NULL,
  body_type VARCHAR(50) NULL,
  color VARCHAR(50) NULL,
  engine_size DECIMAL(4,1) NULL,
  horsepower INT NULL,
  location VARCHAR(150) NULL,
  seller_name VARCHAR(150) NULL,
  seller_phone VARCHAR(50) NULL,
  seller_email VARCHAR(150) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_listings_user_id (user_id),
  KEY idx_listings_brand_model (brand, model),
  KEY idx_listings_price (price),
  KEY idx_listings_created_at (created_at),
  CONSTRAINT fk_listings_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listing_images (
  id BIGINT NOT NULL AUTO_INCREMENT,
  file_name VARCHAR(200) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_url VARCHAR(500) NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at DATETIME NOT NULL,
  listing_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_listing_images_listing_id (listing_id),
  CONSTRAINT fk_listing_images_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at DATETIME NOT NULL,
  user_id BIGINT NOT NULL,
  listing_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_favorite_user_listing (user_id, listing_id),
  KEY idx_favorites_user_id (user_id),
  KEY idx_favorites_listing_id (listing_id),
  CONSTRAINT fk_favorites_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_favorites_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
