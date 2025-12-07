import express from "express";
import db from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", verifyToken, (req, res) => {
  const ownerId = req.user.id;

  db.query(
    `SELECT u.name, r.rating 
     FROM ratings r 
     JOIN users u ON r.user_id=u.id
     JOIN stores s ON s.id=r.store_id
     WHERE s.owner_id=?`,
    [ownerId],
    (err, result) => res.json(result)
  );
});

export default router;
