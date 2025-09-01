import sequelize from "../config/db.js";
import UserModel from "./User.js";
import StoreModel from "./Store.js";
import RatingModel from "./Rating.js";

const User = UserModel(sequelize);
const Store = StoreModel(sequelize);
const Rating = RatingModel(sequelize);

// Associations
User.hasMany(Store, { foreignKey: "ownerId", as: "Stores" });
Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

Store.hasMany(Rating, { foreignKey: "StoreId", as: "Ratings", onDelete: "CASCADE" });
Rating.belongsTo(Store, { foreignKey: "StoreId", as: "Store" });

User.hasMany(Rating, { foreignKey: "UserId", as: "Ratings" });
Rating.belongsTo(User, { foreignKey: "UserId", as: "User" });

export { sequelize, User, Store, Rating };
