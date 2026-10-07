import { db } from "hatchable";

export const access = "public";
export const methods = ["GET"];

export default async function (req, res) {
  const id = Number(req.query?.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "A valid car id is required." });
  }

  const { rows } = await db.query(
    `SELECT id, name, brand, category, seats, transmission, fuel,
            price_per_day, image_url, description, featured
     FROM cars
     WHERE id = $1 AND active = true`,
    [id]
  );

  if (!rows.length) return res.status(404).json({ error: "Car not found." });
  return res.json({ car: rows[0] });
}