const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Ingredient = require("./Ingredient");

const Substitution = sequelize.define(
  "Substitution",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dietType: { type: DataTypes.STRING, allowNull: false },
    substitute: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "substitutions",
    timestamps: true,
  }
);

// Define associations: A Substitution is linked to an Ingredient.
Substitution.belongsTo(Ingredient, {
  foreignKey: "ingredientId",
  as: "ingredient",
});
Ingredient.hasMany(Substitution, {
  foreignKey: "ingredientId",
  as: "substitutions",
});

module.exports = Substitution;
