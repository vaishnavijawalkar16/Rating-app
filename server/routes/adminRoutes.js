import express from "express";
import pool from "../db.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { nameSchema, emailSchema, addressSchema, passwordSchema } from "../middleware/validators.js";
import bcrypt from "bcryptjs";
import Joi from "joi";

const router = express.Router();

// protected Admin Roles
router.use(verifyToken, requireRole(["ADMIN"]));

// Admin Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [[counts]] = await conn.query(
      `SELECT 
         (SELECT COUNT(*) FROM users) AS total_users,
         (SELECT COUNT(*) FROM stores) AS total_stores,
         (SELECT COUNT(*) FROM ratings) AS total_ratings`
    );
    conn.release();
    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// create user for admin
router.post("/add-user", async (req, res) => {
  const schema = Joi.object({
    name: nameSchema,
    email: emailSchema,
    address: addressSchema,
    password: passwordSchema,
    role: Joi.string().valid("ADMIN", "USER", "OWNER").required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { name, email, address, password, role } = value;
    const conn = await pool.getConnection();
    const [exists] = await conn.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) { conn.release(); return res.status(400).json({ error: "Email already exists" }); }
    const hashed = await bcrypt.hash(password, 10);
    await conn.query("INSERT INTO users (name,email,address,password,role) VALUES (?,?,?,?,?)", [name, email, address, hashed, role]);
    conn.release();
    res.json({ message: "User added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// add stores
router.post("/add-store", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required(),
    owner_id: Joi.number().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const conn = await pool.getConnection();
    await conn.query("INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)", [value.name, value.email, value.address, value.owner_id]);
    conn.release();
    res.json({ message: "Store added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// searchable list of users
router.get("/users", async (req, res) => {
  try {
    const q = req.query.q || ""; 
    const sort = req.query.sort || "name";
    const order = req.query.order === "desc" ? "DESC" : "ASC";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT id, name, email, address, role FROM users
       WHERE name LIKE ? OR email LIKE ? OR address LIKE ?
       ORDER BY ${conn.escapeId(sort)} ${order}
       LIMIT ? OFFSET ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`, limit, offset]
    );
    conn.release();
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// searchable list of stores
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
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, COALESCE(AVG(r.rating),0) as avg_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.name LIKE ? OR s.address LIKE ? OR s.email LIKE ?
       GROUP BY s.id
       ORDER BY ${conn.escapeId(sort)} ${order}
       LIMIT ? OFFSET ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`, limit, offset]
    );
    conn.release();
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
