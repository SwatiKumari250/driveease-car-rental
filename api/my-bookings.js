import { db } from "hatchable";

export const access = "user";
export const methods = ["GET"];

export default async function (req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Please sign in first." });

  const { rows } = await db.query(
    `SELECT b.id, b.car_id, b.pickup_location, b.dropoff_location,
            b.pickup_at, b.dropoff_at, b.total_amount, b.status,
            b.customer_name, b.customer_phone, b.created_at,
            c.name AS car_name, c.brand, c.category, c.image_url,
            c.seats, c.transmission, c.fuel, c.price_per_day
     FROM bookings b
     JOIN cars c ON c.id = b.car_id
     WHERE b.user_id = $1
     ORDER BY b.pickup_at DESC, b.id DESC`,
    [userId]
  );

  res.json({ bookings: rows });
}