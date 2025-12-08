import express from "express";
import pool from "../db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
const router = express.Router();

router.use(verifyToken, requireRole(["OWNER","ADMIN"]));

// get owners stores list
router.get("/stores", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT s.id, s.name, COALESCE(AVG(r.rating),0) as avg_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [req.user.id]
    );
    conn.release();
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// list of users who rated
router.get("/store/:id/raters", async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    const conn = await pool.getConnection();
    // verify ownership
    const [store] = await conn.query("SELECT owner_id FROM stores WHERE id = ?", [storeId]);
    if (!store.length) { conn.release(); return res.status(404).json({ error: "Store not found" }); }
    if (store[0].owner_id !== req.user.id && req.user.role !== "ADMIN") { conn.release(); return res.status(403).json({ error: "Not owner" }); }

    const [rows] = await conn.query(
      `SELECT u.id, u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    conn.release();
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
