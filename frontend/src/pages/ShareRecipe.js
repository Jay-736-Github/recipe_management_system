import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const dietaryOptions = ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo"];

const ShareRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: "",
    instructions: "",
    dietaryTags: "",
    image: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setRecipeData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setRecipeData((prev) => ({
        ...prev,
        [name]: value.replace(/\r\n|\r/g, "\n"), // Normalize newlines
      }));
    }
  };

  const handleDietaryChange = (e) => {
    setRecipeData((prev) => ({ ...prev, dietaryTags: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      setError("You must be logged in to share a recipe.");
      return;
    }

    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("instructions", recipeData.instructions);
    formData.append("dietaryTags", recipeData.dietaryTags);
    if (recipeData.image) {
      formData.append("image", recipeData.image);
    }

    try {
      await axios.post("http://localhost:5001/api/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/recipes");
    } catch (err) {
      console.error("Error uploading recipe:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Failed to upload recipe. Please try again."
      );
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Share Your Recipe</h2>
        {error && <Error>{error}</Error>}

        <input
          type="text"
          name="title"
          placeholder="Recipe Title"
          value={recipeData.title}
          onChange={handleChange}
          required
        />

        <Textarea
          name="instructions"
          placeholder="Step 1: Add ingredients...\nStep 2: Mix well...\nStep 3: Bake for 20 min..."
          value={recipeData.instructions}
          onChange={handleChange}
          required
        />

        <select
          name="dietaryTags"
          value={recipeData.dietaryTags}
          onChange={handleDietaryChange}
        >
          <option value="">Select Dietary Tag</option>
          {dietaryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input type="file" name="image" onChange={handleChange} />

        <button type="submit">Submit Recipe</button>
      </Form>
    </Container>
  );
};

export default ShareRecipe;

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fff3e0;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1rem;
    color: #ff9800;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }
  }
`;

const Textarea = styled.textarea`
  height: 120px;
  resize: vertical;
  white-space: pre-wrap;
`;

const Error = styled.p`
  color: red;
  font-size: 0.9rem;
`;
