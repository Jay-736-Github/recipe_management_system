import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import DietaryFilter from "../components/DietaryFilter"; // Import the DietaryFilter component

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // For filtered recipes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/recipes");
        setRecipes(res.data.recipes || res.data); // Ensure compatibility with API response
        setFilteredRecipes(res.data.recipes || res.data); // Set both to show all initially
      } catch (err) {
        setError("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Handle filtered recipes based on selected dietary tag
  const handleFilteredRecipes = (filteredData) => {
    setFilteredRecipes(filteredData);
  };

  return (
    <Container>
      <h2>All Recipes</h2>
      <DietaryFilter setFilteredRecipes={handleFilteredRecipes} />{" "}
      {/* Add the filter component */}
      {loading ? (
        <Message>Loading recipes...</Message>
      ) : error ? (
        <Message>{error}</Message>
      ) : filteredRecipes.length > 0 ? (
        <Grid>
          {filteredRecipes.map((recipe) => (
            <RecipeLink to={`/recipes/${recipe.id}`} key={recipe.id}>
              <RecipeCard>
                <img src={recipe.imageUrl} alt={recipe.title} />
                <h3>{recipe.title}</h3>
              </RecipeCard>
            </RecipeLink>
          ))}
        </Grid>
      ) : (
        <Message>No recipes found.</Message>
      )}
    </Container>
  );
};

export default Recipes;

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #ff0000;
  margin-top: 20px;
`;

const RecipeLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const RecipeCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    border-radius: 10px;
    height: 200px;
    object-fit: cover;
  }

  h3 {
    margin-top: 10px;
    font-size: 1.2rem;
    color: #333;
  }
`;
