import React, { useState } from "react";
import axios from "axios";


const DietaryFilter = ({ setFilteredRecipes }) => {
  const [selectedTag, setSelectedTag] = useState("");

  const handleFilterChange = async (e) => {
    setSelectedTag(e.target.value);

    try {
      const response = await axios.get(
        `http://localhost:5001/api/recipes/filter?tag=${e.target.value}` // Updated the URL to the correct port
      );
      setFilteredRecipes(response.data); // Update the filtered recipes state
    } catch (error) {
      console.error("Error fetching filtered recipes:", error);
    }
  };

  return (
    <div className="dietary-filter">
      <label htmlFor="dietary-tags">Filter by Dietary Tags: </label>
      <select
        id="dietary-tags"
        value={selectedTag}
        onChange={handleFilterChange}
      >
        <option value="">Select Tag</option>
        <option value="Vegan">Vegan</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Gluten-Free">Gluten-Free</option>
        <option value="Keto">Keto</option>
        <option value="Paleo">Paleo</option>
        {/* Add more dietary tags here */}
      </select>
    </div>
  );
};

export default DietaryFilter;

