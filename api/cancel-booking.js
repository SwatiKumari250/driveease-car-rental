import { db } from "hatchable";

export const access = "user";
export const methods = ["POST"];

export default async function (req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Please sign in first." });

  const bookingId = Number(req.body?.bookingId);
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({ error: "Choose a valid booking." });
  }

  const { rows } = await db.query(
    `SELECT id, car_id, pickup_at, status
     FROM bookings
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [bookingId, userId]
  );

  if (!rows.length) return res.status(404).json({ error: "Booking not found." });

  const booking = rows[0];
  if (booking.status === "cancelled") {
    return res.status(409).json({ error: "This booking is already cancelled." });
  }
  if (booking.status !== "confirmed" && booking.status !== "pending") {
    return res.status(409).json({ error: "This booking cannot be cancelled." });
  }

  const pickup = new Date(booking.pickup_at);
  if (pickup <= new Date()) {
    return res.status(409).json({
      error: "This booking can no longer be cancelled because the pickup time has started."
    });
  }

  const { rows: updated } = await db.query(
    `UPDATE bookings
     SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1 AND user_id = $2
       AND status IN ('pending', 'confirmed')
       AND pickup_at > NOW()
     RETURNING id, car_id, status, pickup_at`,
    [bookingId, userId]
  );

  if (!updated.length) {
    return res.status(409).json({ error: "The booking could not be cancelled. Please refresh and try again." });
  }

  res.json({
    success: true,
    bookingId: updated[0].id,
    status: updated[0].status,
    message: "Your booking has been cancelled and the car is available again."
  });
}