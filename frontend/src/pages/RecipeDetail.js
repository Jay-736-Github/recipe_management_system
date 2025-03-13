import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { jsPDF } from "jspdf";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const downloadPDF = async () => {
    if (!recipe) return;

    const doc = new jsPDF();
    doc.setFontSize(22).setFont("helvetica", "bold");
    doc.text(recipe.title, 20, 20);

    try {
      let imageUrl = recipe.imageUrl;
      if (!imageUrl.startsWith("http")) {
        imageUrl = `http://localhost:5001/uploads/${recipe.imageUrl}`;
      }

      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const base64Image = arrayBufferToBase64(response.data);
      const imgData = `data:image/jpeg;base64,${base64Image}`;

      doc.addImage(imgData, "JPEG", 20, 30, 150, 100);
    } catch (error) {
      console.error("Error fetching image:", error);
    }

    doc.text(`Dietary Tags: ${recipe.dietaryTags || "None"}`, 20, 140);
    doc.text("Preparation Steps:", 20, 160);
    doc.setFontSize(12);

    let y = 170;
    recipe.instructions.split("\n").forEach((line) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 8;
    });

    doc.save(`${recipe.title}.pdf`);
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  return (
    <Container>
      {loading ? (
        <Message>Loading recipe...</Message>
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <RecipeContent>
          <img
            src={
              recipe.imageUrl.startsWith("http")
                ? recipe.imageUrl
                : `http://localhost:5001/uploads/${recipe.imageUrl}`
            }
            alt={recipe.title}
          />
          <h2>{recipe.title}</h2>
          <p>
            <strong>Dietary Tags:</strong> {recipe.dietaryTags || "None"}
          </p>
          <h3>Preparation Steps</h3>
          <Instructions>
            {recipe.instructions.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </Instructions>
          <DownloadButton onClick={downloadPDF}>Download as PDF</DownloadButton>
        </RecipeContent>
      )}
    </Container>
  );
};

export default RecipeDetail;

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const RecipeContent = styled.div`
  max-width: 600px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    border-radius: 10px;
    height: 300px;
    object-fit: cover;
  }

  h2 {
    color: #ff9800;
  }

  h3 {
    margin-top: 20px;
    color: #555;
  }

  p {
    font-size: 1rem;
    color: #333;
  }
`;

const Instructions = styled.div`
  text-align: left;
  p {
    white-space: pre-line;
    margin: 5px 0;
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #ff0000;
  margin-top: 20px;
`;

const DownloadButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff9800;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e68900;
  }
`;
