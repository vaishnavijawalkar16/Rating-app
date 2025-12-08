import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import dotenv from "dotenv";
import { validateRegistration, passwordSchema } from "../middleware/validators.js";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// Register new user
router.post("/register", validateRegistration, async (req, res) => {
  const { name, email, address, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length) {
      conn.release();
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await conn.query(
      "INSERT INTO users (name,email,address,password,role) VALUES (?,?,?,?,?)",
      [name, email, address, hashed, "USER"]
    );

    conn.release();
    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) { 
      conn.release(); 
      return res.status(400).json({ error: "User not found" }); 
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { 
      conn.release(); 
      return res.status(400).json({ error: "Invalid credentials" }); 
    }

    // Check if user owns any stores
    const [ownedStores] = await conn.query("SELECT id FROM stores WHERE owner_id = ?", [user.id]);
    conn.release();

    // Assign role dynamically
    const role = ownedStores.length > 0 ? "OWNER" : user.role;

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.json({
      token,
      role,
      name: user.name,
      userId: user.id,
      ownedStoreIds: ownedStores.map(s => s.id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update password
router.post("/update-password", verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const { error } = passwordSchema.validate(newPassword);
  if (error) return res.status(400).json({ error: "New password validation failed" });

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) { conn.release(); return res.status(404).json({ error: "User missing" }); }

    const valid = await bcrypt.compare(oldPassword, rows[0].password);
    if (!valid) { conn.release(); return res.status(400).json({ error: "Old password incorrect" }); }

    const hashed = await bcrypt.hash(newPassword, 10);
    await conn.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id]);
    conn.release();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
