import Rating from "../models/Rating.js";
import Store from "../models/Store.js";
import User from "../models/User.js";

// Add rating
export const addRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const newRating = await Rating.create({
      rating,
      UserId: userId,
      StoreId: storeId,
    });

    res.json(newRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all ratings (admin/owner)
export const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      include: [User, Store],
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
