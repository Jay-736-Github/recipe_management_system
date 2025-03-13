const express = require("express");
const { Ingredient } = require("../models");

const router = express.Router();

// Get all ingredients
router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new ingredient
router.post("/", async (req, res) => {
  try {
    const { name, recipeId } = req.body;
    if (!name)
      return res.status(400).json({ message: "Ingredient name is required" });

    // Ensure a valid recipeId is provided if required
    if (!recipeId)
      return res.status(400).json({ message: "recipeId is required" });

    const ingredient = await Ingredient.create({ name, recipeId });
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
