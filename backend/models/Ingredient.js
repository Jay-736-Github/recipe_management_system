const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Recipe = require("./Recipe");

const Ingredient = sequelize.define(
  "Ingredient",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    recipeId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key for Recipe
  },
  {
    tableName: "ingredients",
    timestamps: true,
  }
);

// Define associations after both models are defined
Ingredient.belongsTo(Recipe, { foreignKey: "recipeId", as: "recipe" });
Recipe.hasMany(Ingredient, { foreignKey: "recipeId", as: "ingredients" });

module.exports = Ingredient;
