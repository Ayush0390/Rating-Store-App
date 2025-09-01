import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Rating extends Model {}

  Rating.init(
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: { type: DataTypes.TEXT, allowNull: true },
      StoreId: { type: DataTypes.INTEGER, allowNull: false },
      UserId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );

  return Rating;
};
