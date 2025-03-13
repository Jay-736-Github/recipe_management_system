import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";



const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);
  const navigate = useNavigate();

  const fetchMyRecipes = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.get("http://localhost:5001/api/recipes/my", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setRecipes(
        data.map((recipe) => ({
          ...recipe,
          imageUrl: recipe.image
            ? `http://localhost:5001/uploads/${recipe.image}`
            : "/placeholder.jpg",
        }))
      );
    } catch (err) {
      setError("Failed to fetch your recipes");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.delete(`http://localhost:5001/api/recipes/${deleteId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setRecipes((prev) => prev.filter((recipe) => recipe.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError("Failed to delete recipe");
    }
  };

  const handleEdit = async () => {
    if (!editRecipe || !editRecipe.id) {
      setError("Invalid recipe data.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();

      formData.append("title", editRecipe.title);
      formData.append("instructions", editRecipe.instructions);
      formData.append(
        "dietaryTags",
        JSON.stringify(editRecipe.dietaryTags || "")
      );

      if (editRecipe.newImage) {
        formData.append("image", editRecipe.newImage);
      }

      const { data } = await axios.put(
        `http://localhost:5001/api/recipes/${editRecipe.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === editRecipe.id
            ? {
                ...recipe,
                ...data,
                imageUrl: data.image
                  ? `http://localhost:5001/uploads/${data.image}`
                  : recipe.imageUrl,
              }
            : recipe
        )
      );
      setEditRecipe(null);
    } catch (err) {
      console.error("Edit Error:", err);
      setError("Failed to update recipe");
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  return (
    <Container>
      <Header>
        <h2>My Recipes</h2>
        <ShareRecipeButton onClick={() => navigate("/share-recipe")}>
          Let's Share a Recipe!
        </ShareRecipeButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {recipes.length > 0 ? (
        <RecipeList>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id}>
              <RecipeImage src={recipe.imageUrl} alt={recipe.title} />
              <RecipeInfo>
                <h3>{recipe.title}</h3>
                <p>Dietary: {recipe.dietaryTags || "Not specified"}</p>
                <ButtonGroup>
                  <Button onClick={() => setEditRecipe(recipe)}>Edit</Button>
                  <DeleteButton onClick={() => setDeleteId(recipe.id)}>
                    Delete
                  </DeleteButton>
                </ButtonGroup>
              </RecipeInfo>
            </RecipeCard>
          ))}
        </RecipeList>
      ) : (
        <Message>No recipes found.</Message>
      )}

      {deleteId && (
        <Modal>
          <ModalContent>
            <p>Are you sure you want to delete this recipe?</p>
            <ModalButtonGroup>
              <DeleteButton onClick={handleDelete}>Yes</DeleteButton>
              <CancelButton onClick={() => setDeleteId(null)}>No</CancelButton>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {editRecipe && (
        <Modal>
          <ModalContent>
            <h3>Edit Recipe</h3>
            <ModalInput
              type="text"
              value={editRecipe.title}
              onChange={(e) =>
                setEditRecipe({ ...editRecipe, title: e.target.value })
              }
              placeholder="Recipe Title"
            />
            <ModalTextarea
              value={editRecipe.instructions}
              onChange={(e) =>
                setEditRecipe({ ...editRecipe, instructions: e.target.value })
              }
              placeholder="Preparation Steps"
            />
            <ModalSelect
              value={editRecipe.dietaryTags || ""}
              onChange={(e) =>
                setEditRecipe({ ...editRecipe, dietaryTags: e.target.value })
              }
            >
              <option value="">Select Dietary Tag</option>
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Gluten-free">Gluten-free</option>
              <option value="Paleo">Paleo</option>
              <option value="Keto">Keto</option>
            </ModalSelect>
            <ModalFileInput
              type="file"
              onChange={(e) =>
                setEditRecipe({ ...editRecipe, newImage: e.target.files[0] })
              }
            />
            <ModalButtonGroup>
              <SaveButton onClick={handleEdit}>Save</SaveButton>
              <CancelButton onClick={() => setEditRecipe(null)}>
                Cancel
              </CancelButton>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default MyRecipes;


const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: #f9f9f9;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const ShareRecipeButton = styled.button`
  padding: 10px 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: #d9534f;
  background: #f2dede;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const RecipeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const RecipeCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RecipeInfo = styled.div`
  padding: 15px;

  h3 {
    margin: 0 0 10px;
    font-size: 1.2rem;
  }

  p {
    margin: 0 0 15px;
    color: #555;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #218838;
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 10px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #c82333;
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-top: 40px;
  color: #777;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  width: 90%;
  max-width: 550px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  min-height: 120px; /* More spacious */
`;

const ModalSelect = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
`;

const ModalFileInput = styled.input`
  margin-bottom: 15px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SaveButton = styled.button`
  padding: 12px 18px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled.button`
  padding: 12px 18px;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: #5a6268;
  }
`;

/* Styled Delete Confirmation Box */
const DeleteConfirmationBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const DeleteQuestion = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
`;

const ConfirmationButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ConfirmButton = styled.button`
  padding: 14px 22px; /* Increased padding */
  font-size: 1.1rem; /* Slightly bigger text */
  font-weight: bold;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */

  &:hover {
    background: #218838;
    transform: scale(1.05); /* Slightly larger on hover */
  }

  &:active {
    background: #1e7e34;
    transform: scale(0.98);
  }
`;

const DeclineButton = styled.button`
  padding: 14px 22px;
  font-size: 1.1rem;
  font-weight: bold;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #c82333;
    transform: scale(1.05);
  }

  &:active {
    background: #b21f2d;
    transform: scale(0.98);
  }
`;

export {
  Container,
  Header,
  ShareRecipeButton,
  ErrorMessage,
  RecipeList,
  RecipeCard,
  RecipeImage,
  RecipeInfo,
  ButtonGroup,
  Button,
  DeleteButton,
  Message,
  Modal,
  ModalContent,
  ModalInput,
  ModalTextarea,
  ModalSelect,
  ModalFileInput,
  ModalButtonGroup,
  SaveButton,
  CancelButton,
  DeleteConfirmationBox,
  DeleteQuestion,
  ConfirmationButtonGroup,
  ConfirmButton,
  DeclineButton,
};