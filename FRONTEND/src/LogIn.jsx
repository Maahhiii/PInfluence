import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ setUser }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleEmailLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      // ✅ Match backend route
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData,
        { withCredentials: true }
      );

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      console.log("✅ User set:", data.user);

      setTimeout(() => {
        navigate("/grid", { replace: true });
      }, 300);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
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
          background: "#fff",
          borderRadius: 4,
          p: 4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src="/PInfluence-logo.png"
          alt="Logo"
          style={{
            height: 70,
            marginBottom: 10,
            display: "block",
            margin: "0 auto",
          }}
        />

        <Typography
          variant="h5"
          fontWeight="600"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Welcome Back!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={loginData.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={loginData.password}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 3,
            background: "#e60023",
            "&:hover": { background: "#cc001f" },
          }}
          onClick={handleEmailLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Log In"}
        </Button>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <MuiLink
            component={Link}
            to="/signup"
            underline="hover"
            color="primary"
            sx={{ fontSize: 14 }}
          >
            Not a user? Sign up
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
