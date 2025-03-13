import React from "react";
import styled from "styled-components";

const RecipeCard = ({ recipe }) => {
  return (
    <Card>
      <Image
        src={`http://localhost:5001/uploads/${recipe.image}`}
        alt={recipe.title}
      />
      <Content>
        <h3>{recipe.title}</h3>
        <p>{recipe.dietaryTags}</p>
      </Content>
    </Card>
  );
};

export default RecipeCard;

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.03);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 15px;
  h3 {
    margin: 0;
  }
  p {
    font-size: 0.9rem;
    color: #777;
  }
`;
