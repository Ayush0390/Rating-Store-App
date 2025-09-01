// backend/routes/storeRoutes.js
import express from "express";
import { Store, Rating, User } from "../models/index.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { Sequelize } from "sequelize";

const router = express.Router();

/**
 * ✅ Create a store (Admin or Owner)
 * - Admin: must pass ownerId
 * - Owner: store is auto-assigned to logged-in owner
 */
router.post("/", authMiddleware(["admin", "owner"]), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    let finalOwnerId;

    if (req.user.role === "admin") {
      if (!ownerId) {
        return res.status(400).json({ message: "ownerId required for admin" });
      }
      finalOwnerId = ownerId;
    } else if (req.user.role === "owner") {
      finalOwnerId = req.user.id; // auto-assign
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: finalOwnerId,
    });

    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Public: get all stores with avg rating + ratings + reviewer info
 */
router.get("/", async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("Ratings.rating")), "averageRating"],
        ],
      },
      include: [
        {
          model: Rating,
          as: "Ratings",
          include: [{ model: User, as: "User", attributes: ["id", "name", "email"] }],
        },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
      group: ["Store.id", "owner.id", "Ratings.id", "Ratings->User.id"],
      order: [[{ model: Rating, as: "Ratings" }, "createdAt", "DESC"]],
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Owner: get their own stores + ratings + users
 */
router.get("/owner/mystores", authMiddleware("owner"), async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          as: "Ratings",
          include: [{ model: User, as: "User", attributes: ["id", "name", "email"] }],
        },
      ],
      order: [[{ model: Rating, as: "Ratings" }, "createdAt", "DESC"]],
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ User/Owner: rate a store (add or update)
 */
router.post("/:id/rate", authMiddleware(["user", "owner"]), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const storeId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    let existing = await Rating.findOne({
      where: { StoreId: storeId, UserId: req.user.id },
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment || existing.comment;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }

    const created = await Rating.create({
      rating,
      comment,
      StoreId: storeId,
      UserId: req.user.id,
    });

    res.status(201).json({ message: "Rating added", rating: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ Admin: list all stores with ratings + owner info
 */
router.get("/admin/list", authMiddleware("admin"), async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: Rating,
          as: "Ratings",
          include: [{ model: User, as: "User", attributes: ["id", "name"] }],
        },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
