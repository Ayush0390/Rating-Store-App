import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Store extends Model {}

  Store.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      address: { type: DataTypes.STRING(400), allowNull: true },
      ownerId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Store",
    }
  );

  return Store;
};
