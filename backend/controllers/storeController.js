// backend/controllers/storeController.js
import Store from "../models/Store.js";

export const createStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const store = await Store.create({ name, email, address });
    res.json(store);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
