import { db } from "hatchable";

export const access = "public";
export const methods = ["GET"];

export default async function (req, res) {
  const carId = Number(req.query?.carId);
  const pickupAt = String(req.query?.pickupAt || "").trim();
  const dropoffAt = String(req.query?.dropoffAt || "").trim();

  if (!Number.isInteger(carId) || carId <= 0) return res.status(400).json({ error: "Choose a valid car." });

  const start = new Date(pickupAt);
  const end = new Date(dropoffAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ error: "Choose valid pickup and return times." });
  }
  if (end <= start) return res.status(400).json({ error: "Return time must be after pickup time." });

  const { rows: cars } = await db.query(
    `SELECT id, name, price_per_day
     FROM cars WHERE id = $1 AND active = true LIMIT 1`,
    [carId]
  );
  if (!cars.length) return res.status(404).json({ error: "Car not found." });

  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS conflicts
     FROM bookings
     WHERE car_id = $1
       AND status IN ('pending', 'confirmed')
       AND pickup_at < $3
       AND dropoff_at > $2`,
    [carId, start, end]
  );

  const available = Number(rows[0].conflicts) === 0;
  res.json({
    available,
    carId,
    carName: cars[0].name,
    pickupAt,
    dropoffAt,
    message: available ? "This car is available for your selected dates." : "This car is already booked for part of that period."
  });
}