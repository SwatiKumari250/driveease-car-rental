import { db } from "hatchable";

export const access = "public";
export const methods = ["GET"];

export default async function (req, res) {
  const q = String(req.query?.q || "").trim();
  const category = String(req.query?.category || "").trim();
  const maxPrice = Number(req.query?.maxPrice || 0);

  const { rows } = await db.query(
    `SELECT id, name, brand, category, seats, transmission, fuel,
            price_per_day, image_url, description, featured
     FROM cars
     WHERE active = true
       AND ($1 = '' OR lower(name || ' ' || brand || ' ' || category) LIKE lower('%' || $1 || '%'))
       AND ($2 = '' OR category = $2)
       AND ($3 = 0 OR price_per_day <= $3)
     ORDER BY featured DESC, price_per_day ASC, id ASC`,
    [q, category, maxPrice]
  );

  res.json({ cars: rows });
}