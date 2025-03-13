require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./models");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const substitutionRoutes = require("./routes/substitution");
const ingredientRoutes = require("./routes/ingredients");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/substitutions", substitutionRoutes);
app.use("/api/ingredients", ingredientRoutes);

const PORT = process.env.PORT || 5001;

// Initialize DB and start the server only if DB connection is successful
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
