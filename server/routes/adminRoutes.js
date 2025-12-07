import express from "express";
import db from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* DASHBOARD */
router.get("/dashboard", verifyToken, (req, res) => {
  db.query(
    `
    SELECT 
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM stores) AS stores,
    (SELECT COUNT(*) FROM ratings) AS ratings`,
    (err, result) => res.json(result[0])
  );
});

/* ADD STORE */
router.post("/add-store", verifyToken, (req, res) => {
  const { name, email, address, owner_id } = req.body;
  db.query(
    "INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)",
    [name, email, address, owner_id],
    () => res.send("Store Added")
  );
});

/* GET USERS */
router.get("/users", verifyToken, (req, res) => {
  db.query("SELECT id,name,email,address,role FROM users", (err, result) =>
    res.json(result)
  );
});

/* GET STORES */
router.get("/stores", verifyToken, (req, res) => {
  db.query(
    `SELECT s.*, AVG(r.rating) AS rating
     FROM stores s
     LEFT JOIN ratings r ON s.id=r.store_id
     GROUP BY s.id`,
    (err, result) => res.json(result)
  );
});

export default router;
