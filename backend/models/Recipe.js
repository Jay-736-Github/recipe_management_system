const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Recipe = sequelize.define(
  "Recipe",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    instructions: { type: DataTypes.TEXT, allowNull: false },
    dietaryTags: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key for User
  },
  {
    tableName: "recipes",
    timestamps: true,
  }
);

module.exports = Recipe;








