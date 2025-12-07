import express from "express";
import db from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET STORES */
router.get("/stores", verifyToken, (req, res) => {
  db.query(
    `SELECT s.*,AVG(r.rating) AS rating FROM stores s
     LEFT JOIN ratings r ON s.id=r.store_id GROUP BY s.id`,
    (err, result) => res.json(result)
  );
});

/* SUBMIT RATING */
router.post("/rate", verifyToken, (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  db.query(
    "REPLACE INTO ratings (user_id,store_id,rating) VALUES (?,?,?)",
    [user_id, store_id, rating],
    () => res.send("Rating Saved")
  );
});

export default router;
