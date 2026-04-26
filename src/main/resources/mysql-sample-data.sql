INSERT INTO users (id, name, email, password, role, is_enabled, created_at, phone_number)
VALUES
    (23, 'Virag Balint Aladar', 'balintaladar67@gmail.com', 'seed-user-password', 'USER', true, '2026-04-26 16:00:00', '+36506352978'),
    (24, 'Seed Admin', 'seed-admin@usedcars.local', 'seed-admin-password', 'ADMIN', true, '2026-04-26 16:00:00', '+36100000000')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO cars (
    id, brand, model, title, year, mileage, fuel_type, price, is_active, created_at, description,
    location, seller_name, seller_phone, seller_email, transmission, body_type, color, engine_size, horsepower, user_id
)
VALUES
    (45, 'Volkswagen', 'Caddy', 'VW CADDY', 2025, 124000, 'Diesel', 6000000, true, '2026-04-26 16:26:05', 'EladA3 2025-As vw caddy, hibA!tlan A!llapotban garanciA!val!', 'NyA�regyhA!za', 'SzilA!gyi BA!lint', '+36111111111', 'szilko@gmail.com', 'Automatic', '3', 'FehAcr', 2.00, 130, 23),
    (46, 'Mercedes', 'CLA 250E', 'HibA!tlan A!llapot!', 2024, 43000, 'Hybrid', 22999999, true, '2026-04-26 16:33:51', 'EladA3 hibA!tlan A!llapotban, friss mA+szakival nem dohA!nyzA3 autA3! MegkA�mAclt tAcli felni szettel Acs Aoj Continental gumikkal van felszerelve. TAbb extrA!Acrt keress meg.', 'NyA�regyhA!za', 'Makara MilA!n', '+36111111111', 'mkraboss@gmail.com', 'Automatic', '5', 'FehAcr', 1.30, 218, 23),
    (47, 'BMW', 'M4', 'BMW M4 COMP', 2021, 67000, 'Petrol', 30000000, true, '2026-04-26 16:40:23', 'Alig hasznA!lt bmw full extrA!val Acs friss kAtelezA? szervA�zzel olajcsere levegA?szA+rA? olajszA+rA? Akrapovich tuningolt kipufogA3rendszerrel.', 'KecskemAct', 'RA3ka Imre', '+36111111111', 'hresko@gmail.com', 'Automatic', '5', 'Fekete', 3.00, 467, 23),
    (48, 'Dodge', 'Challenger 170', 'Dodge challenger demon 170', 2017, 98000, 'Petrol', 76000000, true, '2026-04-26 16:44:34', 'V8 twin turbA3val felszerelt. 2.3 sec alatt 0-100 km/h. AutA3t beszA!mA�tok A!r alkukAcpes.', 'Budapest', 'BillentyA+zet BA!lint Barbara', '+36111111111', 'bbb@gmail.com', 'Automatic', '3', 'Piros', 6.20, 1025, 23),
    (49, 'Bentley', 'Continental GT', 'HibA!tlan A!llapotA3 megkA�mAclt darab', 2010, 83000, 'Diesel', 46000000, true, '2026-04-26 16:49:02', 'HibA!tlan elegA!ns Bentley Continental GT eladA3! Karcmentes, megkA�mAclt, nem dohA!nyzA3. TovA!bbi informA!ciA3Acrt: +36205432746', 'Szeged', 'Trab Antal', '+36111111111', 'trabianti@icloud.com', 'Automatic', '3', 'BAczs', 6.00, 430, 23),
    (50, 'Rolls Royce', 'Phantom', 'Phantom', 2006, 210000, 'Diesel', 39999999, true, '2026-04-26 16:54:04', 'SzemAclyes megtekintAcs HActfA?-PAcntek 8:00-16:00-ig SzAckesfehAcrvA!r Szent Ferenc utca 67.', 'SzAckesfehAcrvA!r', 'Borsy NA!ndor', '+36111111111', 'borsyjunior@icloud.com', 'Automatic', '5', 'Fekete', 4.00, 354, 23),
    (51, 'Iphone', '16 pro max', 'Iphone', 2022, 0, 'Electric', 300000, false, '2026-04-26 21:43:04', 'Telefon eladA3', 'NyA�regyhA!za', 'Mountain Dew', '+3667136767', 'toferi@gmail.com', 'Manual', '0', 'AsztroszA1rke', 0.00, 1, 23),
    (55, 'Volvo', 'XC90', 'Volvo SUV', 2020, 198000, 'Electric', 17999999, true, '2026-04-26 21:46:57', 'EladA3 hibA!tlan A!llapotAo volvo.', 'A?csAd', 'Minta AladA!r', '+3615398464', 'aladar@gmail.com', 'Automatic', '5', 'SzA1rke', 2.00, 256, 23),
    (56, 'Suzuki', 'sx4 s-cross', 'suzuki sx4 s-cross', 2018, 134000, 'Hybrid', 9800000, true, '2026-04-26 21:50:30', 'Nincs leA�rA!s', 'BalatonfA1red', 'VirA!g BA!lint AladA!r', '+36506352978', 'balintaladar67@gmail.com', 'Manual', '5', 'SzA1rke', 1.90, 160, 23)
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO images (id, image_path, car_id)
VALUES
    (15, '/uploads/57d720a9-322a-470c-b6ad-adbbcc56d975.jpg', 45),
    (16, '/uploads/7fec4118-44ba-4379-9518-6b905d588cd4.jpg', 45),
    (17, '/uploads/edc02037-f5ba-489c-8d59-2e8074cf73e5.jpg', 46),
    (18, '/uploads/aca8cb6c-de85-4b19-8915-35059f08c1d3.jpg', 46),
    (19, '/uploads/6d4884b9-a861-428b-9c2b-292ed33a06be.jpg', 46),
    (20, '/uploads/84d05c43-9c25-48f0-98d9-122460d72847.jpg', 47),
    (21, '/uploads/196569ee-d27a-4d96-ac18-a3e65c78342a.jpg', 47),
    (22, '/uploads/c260d2e4-6d35-4d49-beb1-aa1b2a7c7155.jpg', 48),
    (23, '/uploads/c190d37e-7906-402d-8c28-55afb38f5067.jpg', 48),
    (24, '/uploads/a895e475-1a99-444d-803b-46358dcbf330.jpg', 49),
    (25, '/uploads/c8d46472-e7e9-4ce6-a4e0-a6030f9a63f7.jpg', 49),
    (26, '/uploads/27010d52-8801-4ef2-a708-9abea8aef096.jpg', 50),
    (27, '/uploads/91514ac5-f18c-4747-b81d-80656d7804f5.jpg', 50),
    (28, '/uploads/a02e0aa0-56b8-4b00-9ccc-e1cd230d2308.jpg', 51),
    (30, '/uploads/0c68003a-c665-4da2-8821-2e7f06810341.jpg', 55),
    (31, '/uploads/0efa2024-6002-4e38-b165-80c58c61c51e.jpg', 56),
    (32, '/uploads/c3bf2a2d-92a4-4bc9-90f8-817cfdfe8063.jpg', 56)
ON DUPLICATE KEY UPDATE id = id;
