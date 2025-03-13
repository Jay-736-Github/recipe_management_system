const express = require("express");
const { Substitution } = require("../models");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Create a substitution (Protected)
router.post("/", authenticate, async (req, res) => {
  try {
    const { ingredientId, dietType, substitute } = req.body;
    if (!ingredientId || !dietType || !substitute) {
      return res
        .status(400)
        .json({
          message: "ingredientId, dietType, and substitute are required",
        });
    }
    const newSubstitution = await Substitution.create({
      ingredientId,
      dietType,
      substitute,
    });
    res
      .status(201)
      .json({
        message: "Substitution created successfully",
        substitution: newSubstitution,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update a substitution (Protected)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { dietType, substitute } = req.body;
    const substitution = await Substitution.findByPk(req.params.id);
    if (!substitution)
      return res.status(404).json({ message: "Substitution not found" });
    await substitution.update({ dietType, substitute });
    res.json({ message: "Substitution updated successfully", substitution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a substitution (Protected)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const substitution = await Substitution.findByPk(req.params.id);
    if (!substitution)
      return res.status(404).json({ message: "Substitution not found" });
    await substitution.destroy();
    res.json({ message: "Substitution deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all substitutions for a given ingredient
router.get("/:ingredientId", async (req, res) => {
  try {
    const substitutions = await Substitution.findAll({
      where: { ingredientId: req.params.ingredientId },
    });
    res.json(substitutions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
