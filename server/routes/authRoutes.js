import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

/* REGISTER USER */
router.post("/register", async (req, res) => {
  const { name, email, password, address } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)",
    [name, email, hash, address, "USER"],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("User Registered");
    }
  );
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (result.length === 0) return res.send("User not found");

    const valid = await bcrypt.compare(password, result[0].password);
    if (!valid) return res.send("Invalid password");

    const token = jwt.sign(
      { id: result[0].id, role: result[0].role },
      "secret123"
    );

    res.json({ token, role: result[0].role });
  });
});

export default router;
