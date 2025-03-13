// const express = require("express");
// const { Recipe } = require("../models");
// const authenticate = require("../middleware/auth");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // 🔹 Multer Storage for Image Uploads
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // 🔹 Create Recipe (Protected)
// router.post("/", authenticate, upload.single("image"), async (req, res) => {
//   try {
//     const { title, instructions, dietaryTags } = req.body;
//     if (!title || !instructions) {
//       return res
//         .status(400)
//         .json({ message: "Title and instructions are required" });
//     }

//     const recipe = await Recipe.create({
//       title,
//       instructions,
//       dietaryTags,
//       image: req.file ? req.file.filename : null,
//       userId: req.user.userId,
//     });

//     res.status(201).json(recipe);
//   } catch (error) {
//     console.error("Error creating recipe:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // 🔹 Get Recipes of Logged-in User
// router.get("/my", authenticate, async (req, res) => {
//   try {
//     console.log("Fetching recipes for user:", req.user);
//     const myRecipes = await Recipe.findAll({
//       where: { userId: req.user.userId },
//       order: [["createdAt", "DESC"]],
//     });

//     res.json(myRecipes);
//   } catch (error) {
//     console.error("Error fetching my recipes:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // 🔹 Get All Recipes
// router.get("/", async (req, res) => {
//   try {
//     const recipes = await Recipe.findAll({ order: [["createdAt", "DESC"]] });

//     res.json(
//       recipes.map((recipe) => ({
//         ...recipe.toJSON(),
//         imageUrl: recipe.image
//           ? `${req.protocol}://${req.get("host")}/uploads/${recipe.image}`
//           : null,
//       }))
//     );
//   } catch (error) {
//     console.error("Error fetching all recipes:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // 🔹 Get Recipes Filtered by Dietary Tags (New Route)
// router.get("/filter", async (req, res) => {
//   try {
//     const { tag } = req.query; // Get the dietary tag from query parameters

//     if (!tag) {
//       return res
//         .status(400)
//         .json({ message: "Please provide a dietary tag to filter" });
//     }

//     // Query recipes where dietaryTags contains the selected tag
//     const recipes = await Recipe.findAll({
//       where: {
//         dietaryTags: {
//           [Op.like]: `%${tag}%`, // This will search for recipes containing the tag
//         },
//       },
//       order: [["createdAt", "DESC"]],
//     });

//     res.json(
//       recipes.map((recipe) => ({
//         ...recipe.toJSON(),
//         imageUrl: recipe.image
//           ? `${req.protocol}://${req.get("host")}/uploads/${recipe.image}`
//           : null,
//       }))
//     );
//   } catch (error) {
//     console.error("Error filtering recipes:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // 🔹 Get a Single Recipe by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (isNaN(id)) {
//       return res.status(400).json({ message: "Invalid recipe ID" });
//     }

//     console.log(`Fetching recipe with ID: ${id}`);
//     const recipe = await Recipe.findByPk(id);

//     if (!recipe) {
//       console.log(`Recipe with ID ${id} not found`);
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     res.json({
//       ...recipe.toJSON(),
//       imageUrl: recipe.image
//         ? `${req.protocol}://${req.get("host")}/uploads/${recipe.image}`
//         : null,
//     });
//   } catch (error) {
//     console.error("Error fetching recipe:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 🔹 Delete a Recipe (Protected)
// router.delete("/:id", authenticate, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const recipe = await Recipe.findOne({
//       where: { id, userId: req.user.userId },
//     });

//     if (!recipe) {
//       return res
//         .status(404)
//         .json({ message: "Recipe not found or unauthorized" });
//     }

//     await recipe.destroy();
//     res.json({ message: "Recipe deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting recipe:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // 🔹 Update a Recipe (Protected)
// router.put("/:id", authenticate, upload.single("image"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, instructions, dietaryTags } = req.body;

//     const recipe = await Recipe.findOne({
//       where: { id, userId: req.user.userId },
//     });

//     if (!recipe) {
//       return res
//         .status(404)
//         .json({ message: "Recipe not found or unauthorized" });
//     }

//     recipe.title = title || recipe.title;
//     recipe.instructions = instructions || recipe.instructions;
//     recipe.dietaryTags = dietaryTags || recipe.dietaryTags;
//     if (req.file) recipe.image = req.file.filename;

//     await recipe.save();
//     res.json(recipe);
//   } catch (error) {
//     console.error("Error updating recipe:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = router;

const express = require("express");
const { Recipe } = require("../models");
const authenticate = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize"); // Added Op import

const router = express.Router();

// 🔹 Multer Storage for Image Uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🔹 Create Recipe (Protected)
router.post("/", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { title, instructions, dietaryTags } = req.body;
    if (!title || !instructions) {
      return res
        .status(400)
        .json({ message: "Title and instructions are required" });
    }

    const recipe = await Recipe.create({
      title,
      instructions,
      dietaryTags,
      image: req.file ? req.file.filename : null,
      userId: req.user.userId,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Get Recipes of Logged-in User
router.get("/my", authenticate, async (req, res) => {
  try {
    console.log("Fetching recipes for user:", req.user);
    const myRecipes = await Recipe.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(myRecipes);
  } catch (error) {
    console.error("Error fetching my recipes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Get All Recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ order: [["createdAt", "DESC"]] });

    res.json(
      recipes.map((recipe) => ({
        ...recipe.toJSON(),
        imageUrl: recipe.image
          ? `${req.protocol}://${req.get("host")}/uploads/${recipe.image}`
          : null,
      }))
    );
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Get Recipes Filtered by Dietary Tags (Updated Route)
router.get("/filter", async (req, res) => {
  try {
    const { tag } = req.query; // Get the dietary tag from query parameters
    console.log("Received dietary tag:", tag);
    if (!tag) {
      return res
        .status(400)
        .json({ message: "Please provide a dietary tag to filter" });
    }

    // Query recipes where dietaryTags contains the selected tag
    const recipes = await Recipe.findAll({
      where: {
        dietaryTags: {
          [Op.like]: `%${tag}%`, // This will search for recipes containing the tag
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(
      recipes.map((recipe) => ({
        ...recipe.toJSON(),
        imageUrl: recipe.image
          ? `${req.protocol}://${req.get("host")}/uploads/${recipe.image}`
          : null,
      }))
    );
  } catch (error) {
    console.error("Error filtering recipes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Get a Single Recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    console.log(`Fetching recipe with ID: ${id}`);
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      console.log(`Recipe with ID ${id} not found`);
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({
      ...recipe.toJSON(),
      imageUrl: recipe.image
        ? `${req.protocol}://${req.get("host")}/uploads/${recipe.image}`
        : null,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Delete a Recipe (Protected)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOne({
      where: { id, userId: req.user.userId },
    });

    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or unauthorized" });
    }

    await recipe.destroy();
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔹 Update a Recipe (Protected)
router.put("/:id", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, instructions, dietaryTags } = req.body;

    console.log("Received Update Request:", {
      id,
      title,
      instructions,
      dietaryTags,
    });

    // Find the recipe
    const recipe = await Recipe.findOne({
      where: { id, userId: req.user.userId },
    });

    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or unauthorized" });
    }

    console.log("Existing Recipe Found:", recipe);

    // Construct the update object dynamically
    const updateData = {
      title: title || recipe.title,
      instructions: instructions || recipe.instructions,
      dietaryTags: dietaryTags ? JSON.parse(dietaryTags) : recipe.dietaryTags, // Parse if sent as a string
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Update recipe using Sequelize's update()
    const [updatedRows] = await Recipe.update(updateData, {
      where: { id, userId: req.user.userId },
    });

    console.log("Rows Updated:", updatedRows);

    if (updatedRows === 0) {
      return res.status(400).json({ message: "No updates made to the recipe" });
    }

    // Fetch updated recipe
    const updatedRecipe = await Recipe.findOne({ where: { id } });

    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;




