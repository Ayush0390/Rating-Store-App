module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Stores", "ownerId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Stores", "ownerId");
  },
};
