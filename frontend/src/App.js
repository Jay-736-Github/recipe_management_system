import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecipeDetail from "./pages/RecipeDetail";
import ShareRecipe from "./pages/ShareRecipe";
import MyRecipes from "./pages/MyRecipes";
import DietaryFilter from "./components/DietaryFilter";

const App = () => {
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/recipes"
          element={<Recipes filteredRecipes={filteredRecipes} />}
        />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/share-recipe" element={<ShareRecipe />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
      </Routes>
      {/* <DietaryFilter setFilteredRecipes={setFilteredRecipes} /> */}
    </>
  );
};

export default App;
