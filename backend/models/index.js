const sequelize = require("../config/database");

const User = require("./User");
const Recipe = require("./Recipe");
const Ingredient = require("./Ingredient");
const Substitution = require("./Substitution");

// Define Associations (Fixed alias duplication)
Recipe.hasMany(Ingredient, { foreignKey: "recipeId", as: "recipeIngredients" });
Ingredient.belongsTo(Recipe, {
  foreignKey: "recipeId",
  as: "ingredientRecipe",
});

Recipe.hasMany(Substitution, {
  foreignKey: "recipeId",
  as: "recipeSubstitutions",
});
Substitution.belongsTo(Recipe, {
  foreignKey: "recipeId",
  as: "substitutionRecipe",
});

User.hasMany(Recipe, { foreignKey: "userId", as: "userRecipes" });
Recipe.belongsTo(User, { foreignKey: "userId", as: "recipeUser" });

// Function to initialize and sync the database
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected...");

    await sequelize.sync({ alter: true }); // Safe schema updates
    console.log("✅ Database synced...");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, User, Recipe, Ingredient, Substitution, initDB };
