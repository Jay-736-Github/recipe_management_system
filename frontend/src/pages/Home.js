import React from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const backgroundImage = "/image3.jpg";

const Home = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Overlay />
        <Content>
          <h1>Discover Delicious Recipes</h1>
          <p>Find, create, and share your favorite meals with the world.</p>
          <BrowseBox>
            <h2>Browse Your Meal</h2>
            <p>Explore a variety of recipes customized to your taste.</p>
            <Link to="/recipes">
              <button>Start Exploring</button>
            </Link>
          </BrowseBox>
        </Content>
      </Container>
    </>
  );
};

export default Home;

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url(${backgroundImage}) center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
`;

const Content = styled.div`
  text-align: center;
  color: #ffffff;
  z-index: 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;

  h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
`;

const BrowseBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  color: #333;
  margin-top: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: #555;
  }

  button {
    padding: 12px 24px;
    border: none;
    background: linear-gradient(45deg, #ff7e5f, #feb47b);
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.3s ease, transform 0.2s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      background: linear-gradient(45deg, #ff6f50, #fca37a);
      transform: translateY(-3px);
    }
  }
`;
