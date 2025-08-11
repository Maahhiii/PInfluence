import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      alert("Login successful!");
      navigate("/grid"); 
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "91vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#E6E6FA",
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: 5,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/PInfluence-logo.png"
          alt="Logo"
          style={{ height: 80, marginBottom: 5 }}
        />
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            mb: 2,
            color: "text.secondary",
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "center", maxWidth: 300 }}
        >
          Log In to explore your aesthetic world on PInfluence.
        </Typography>

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={loginData.password}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleEmailLogin}
          sx={{
            mt: 2,
            backgroundColor: "#e60023",
            color: "#fff",
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#cc001f",
            },
          }}
        >
          Log In
        </Button>

        <Box
          sx={{
            mt: 2,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <MuiLink
            component={Link}
            to="/signup"
            underline="hover"
            color="primary"
            sx={{ fontSize: 14 }}
          >
            Not a user? Sign up instead
          </MuiLink>

          <MuiLink
            component={Link}
            to="#"
            underline="hover"
            color="primary"
            sx={{ fontSize: 14 }}
          >
            Forgot password?
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
