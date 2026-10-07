CREATE TABLE cars (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  fuel TEXT NOT NULL,
  price_per_day NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  description TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_cars_active ON cars(active);
CREATE INDEX idx_cars_category ON cars(category);

CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  car_id BIGINT NOT NULL REFERENCES cars(id),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_at TIMESTAMP NOT NULL,
  dropoff_at TIMESTAMP NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT bookings_dates_valid CHECK (dropoff_at > pickup_at)
);

CREATE INDEX idx_bookings_user ON bookings(user_id, created_at DESC);
CREATE INDEX idx_bookings_car_dates ON bookings(car_id, pickup_at, dropoff_at);