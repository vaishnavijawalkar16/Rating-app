import express from "express";
import pool from "../db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
const router = express.Router();

// role
router.use(verifyToken, requireRole(["USER","ADMIN","OWNER"]));

//searchable stores
router.get("/stores", async (req, res) => {
  try {
    const q = req.query.q || "";
    const sort = req.query.sort || "name";
    const order = req.query.order === "desc" ? "DESC" : "ASC";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT s.id, s.name, s.email, s.address, COALESCE(AVG(r.rating),0) as avg_rating,
              (SELECT rating FROM ratings rr WHERE rr.user_id = ? AND rr.store_id = s.id LIMIT 1) as my_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.name LIKE ? OR s.address LIKE ?
       GROUP BY s.id
       ORDER BY ${conn.escapeId(sort)} ${order}
       LIMIT ? OFFSET ?`,
      [req.user.id, `%${q}%`, `%${q}%`, limit, offset]
    );
    conn.release();
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// submit or update rating
router.post("/rate", async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const r = parseInt(rating);
    if (!store_id || ![1,2,3,4,5].includes(r)) return res.status(400).json({ error: "Invalid rating or store_id" });

    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [req.user.id, store_id, r]
    );
    conn.release();
    res.json({ message: "Rating saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// users submitted ratings
router.get("/my-ratings", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT r.id, r.rating, r.store_id, s.name as store_name, s.address
       FROM ratings r
       JOIN stores s ON s.id = r.store_id
       WHERE r.user_id = ?`,
      [req.user.id]
    );
    conn.release();
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
