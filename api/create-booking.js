import { db } from "hatchable";

export const access = "user";
export const methods = ["POST"];

function bad(res, message) {
  return res.status(400).json({ error: message });
}

export default async function (req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Please sign in first." });

  const body = req.body || {};
  const carId = Number(body.carId);
  const pickupLocation = String(body.pickupLocation || "").trim();
  const dropoffLocation = String(body.dropoffLocation || "").trim();
  const pickupAt = String(body.pickupAt || "").trim();
  const dropoffAt = String(body.dropoffAt || "").trim();
  const customerName = String(body.customerName || "").trim();
  const customerPhone = String(body.customerPhone || "").trim();

  if (!Number.isInteger(carId) || carId <= 0) return bad(res, "Choose a valid car.");
  if (!pickupLocation || !dropoffLocation) return bad(res, "Pickup and drop-off locations are required.");
  if (!pickupAt || !dropoffAt) return bad(res, "Pickup and return date/time are required.");
  if (!customerName || customerName.length < 2) return bad(res, "Enter your full name.");
  if (!/^[0-9+()\-\s]{7,20}$/.test(customerPhone)) return bad(res, "Enter a valid phone number.");

  const start = new Date(pickupAt);
  const end = new Date(dropoffAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return bad(res, "Enter valid rental dates.");
  if (end <= start) return bad(res, "Return time must be after pickup time.");
  if (start < new Date()) return bad(res, "Pickup time must be in the future.");

  const { rows: cars } = await db.query(
    `SELECT id, name, price_per_day
     FROM cars WHERE id = $1 AND active = true LIMIT 1`,
    [carId]
  );
  if (!cars.length) return res.status(404).json({ error: "That car is no longer available." });

  const { rows: conflicts } = await db.query(
    `SELECT id
     FROM bookings
     WHERE car_id = $1
       AND status IN ('pending', 'confirmed')
       AND pickup_at < $3
       AND dropoff_at > $2
     LIMIT 1`,
    [carId, start, end]
  );
  if (conflicts.length) {
    return res.status(409).json({
      error: "This car is not available for those dates. Please choose different dates or another car.",
      available: false
    });
  }

  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
  const total = Number(cars[0].price_per_day) * days;

  const { rows } = await db.query(
    `INSERT INTO bookings
      (user_id, car_id, pickup_location, dropoff_location, pickup_at, dropoff_at,
       total_amount, status, customer_name, customer_phone)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'confirmed',$8,$9)
     RETURNING id, car_id, pickup_location, dropoff_location, pickup_at,
               dropoff_at, total_amount, status, customer_name, customer_phone, created_at`,
    [userId, carId, pickupLocation, dropoffLocation, start, end, total, customerName, customerPhone]
  );

  res.status(201).json({
    booking: rows[0],
    rentalDays: days,
    carName: cars[0].name,
    message: "Your car is available and the reservation is confirmed."
  });
}