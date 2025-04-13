import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./FirebaseConfig";
import { Box, Button, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      alert("Login successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#E6E6FA",
        padding: 0,
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
          src="/PInfluence LOGO.png"
          alt="Logo"
          style={{ height: 80, marginBottom: 5 }}
        />
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ fontFamily: "'Poppins', sans-serif", mb: 2, color: "text.secondary" }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0, textAlign: "center", maxWidth: 300 }}
        >
          Sign in to explore your aesthetic world on PInfluence.
        </Typography>

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          margin="normal"
          sx={{ borderRadius: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={loginData.password}
          onChange={handleChange}
          margin="normal"
          sx={{ borderRadius: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleEmailLogin}
          sx={{
            mt: 1,
            backgroundColor: "#e60023",
            color: "#fff",
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            '&:hover': {
              backgroundColor: "#cc001f",
            },
          }}
        >
          Log In
        </Button>
        <Typography sx={{ my: 1, color: "#999" }}>or</Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            borderColor: "#ddd",
            color: "#555",
            '&:hover': {
              backgroundColor: "#f2f2f2",
            },
          }}
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
