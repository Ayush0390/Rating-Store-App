import express from "express";
import { Rating, Store, User } from "../models/index.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// User add/update rating
router.post("/", authMiddleware("user"), async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;
    if (!storeId || !rating) return res.status(400).json({ message: "storeId and rating required" });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    const existing = await Rating.findOne({ where: { StoreId: storeId, UserId: req.user.id } });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment || existing.comment;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }

    const created = await Rating.create({ rating, comment, StoreId: storeId, UserId: req.user.id });
    res.status(201).json({ message: "Rating added", rating: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin get all ratings
router.get("/", authMiddleware("admin"), async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      include: [
        { model: User, as: "User" },
        { model: Store, as: "Store" }
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
