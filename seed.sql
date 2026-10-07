INSERT INTO cars (name, brand, category, seats, transmission, fuel, price_per_day, image_url, description, featured)
SELECT 'City Cruiser', 'Toyota', 'Economy', 5, 'Automatic', 'Petrol', 42.00, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80', 'Comfortable, efficient and easy to drive around the city.', true
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE name = 'City Cruiser');

INSERT INTO cars (name, brand, category, seats, transmission, fuel, price_per_day, image_url, description, featured)
SELECT 'Executive Sedan', 'BMW', 'Premium', 5, 'Automatic', 'Petrol', 89.00, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', 'A refined sedan for business trips, airport runs and special occasions.', true
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE name = 'Executive Sedan');

INSERT INTO cars (name, brand, category, seats, transmission, fuel, price_per_day, image_url, description, featured)
SELECT 'Adventure SUV', 'Jeep', 'SUV', 7, 'Automatic', 'Diesel', 76.00, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', 'Spacious seven-seat SUV built for longer journeys and weekend escapes.', true
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE name = 'Adventure SUV');

INSERT INTO cars (name, brand, category, seats, transmission, fuel, price_per_day, image_url, description, featured)
SELECT 'Urban Hatch', 'Volkswagen', 'Compact', 5, 'Manual', 'Petrol', 49.00, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80', 'A practical compact car with a clean interior and low running cost.', false
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE name = 'Urban Hatch');