import express from "express";
import { User, Store, Rating } from "../models/index.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { Op } from "sequelize";

const router = express.Router();

// Admin list users
router.get("/", authMiddleware("admin"), async (req, res) => {
  try {
    const { name, email, role, sortBy = "name", order = "ASC" } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (role) where.role = role;

    const users = await User.findAll({ where, order: [[sortBy, order]] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin get user details
router.get("/:id", authMiddleware("admin"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Rating, as: "Ratings", include: [{ model: Store, as: "Store" }] },
        { model: Store, as: "Stores" },
      ],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User update password
router.put("/me/password", authMiddleware(["user", "admin", "owner"]), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bcrypt = await import("bcrypt");
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Old password incorrect" });

    const valid = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(newPassword);
    if (!valid) return res.status(400).json({ message: "New password must be 8-16 chars, include 1 uppercase and 1 special char" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
