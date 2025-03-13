import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const backgroundImage = "/image3.jpg"; // Ensure the path is correct

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        data
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h2>Sign Up</h2>
          {error && <Error>{error}</Error>}
          <input
            {...register("username")}
            type="text"
            placeholder="Full Name"
            required
          />
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            required
          />
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Form>
      </Container>
    </>
  );
};

export default Signup;

// Global styles to remove unwanted padding/margins
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden; /* Prevents unwanted scrolling */
  }
`;

// Main Container (No extra spacing around it)
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Fills the entire viewport */
  width: 100vw;
  background: url(${backgroundImage}) no-repeat center center/cover;
`;

// Signup Form
const Form = styled.form`
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 10px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  h2 {
    margin-bottom: 1rem;
  }

  input {
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
    transition: 0.3s;

    &:hover {
      background: #e68900;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

const Error = styled.p`
  color: red;
  font-size: 0.9rem;
`;
