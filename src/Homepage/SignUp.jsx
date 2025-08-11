// src/Homepage/SignUp.jsx
import React, { useState, forwardRef } from "react";
import { auth, db } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, CalendarToday } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SignUpForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 101 },
    (_, i) => currentYear - i
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(formData.birthMonth, formData.birthYear) },
    (_, i) => i + 1
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your first and last name");
      return false;
    }

    if (!formData.birthMonth || !formData.birthDay || !formData.birthYear) {
      setError("Please select your complete birth date");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(
      formData.birthYear,
      formData.birthMonth - 1,
      formData.birthDay
    );
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    const actualAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (actualAge < 13) {
      setError("You must be at least 13 years old to sign up");
      return false;
    }

    if (birthDate > today) {
      setError("Birth date cannot be in the future");
      return false;
    }

    return true;
  };

  const saveUserToFirestore = async (user) => {
    try {
      const birthDateString = `${formData.birthYear}-${String(
        formData.birthMonth
      ).padStart(2, "0")}-${String(formData.birthDay).padStart(2, "0")}`;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        birthdate: birthDateString,
        createdAt: new Date().toISOString(),
        provider: "email",
      });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);

      if (error.code === "permission-denied") {
        throw new Error(
          "Permission denied. Please check Firestore security rules."
        );
      } else {
        throw new Error("Failed to save user data");
      }
    }
  };

  const handleEmailSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      await saveUserToFirestore(userCredential.user);

      navigate("/grid");
    } catch (error) {
      console.error("Sign-up error:", error);

      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email or try signing in."
        );
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.message === "Failed to save user data") {
        setError(
          "Account created but failed to save profile. Please contact support."
        );
      } else {
        setError(
          error.message || "Failed to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
        mt: 4,
        px: 2,
      }}
    >
      {/* Left Side - Image Grid */}
      <Box
        sx={{
          flex: 1,
          minWidth: "300px",
          maxWidth: "500px",
          textAlign: "center",
          mb: { xs: 4, md: 0 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            mt: 3,
          }}
        >
          {[
            "https://i.pinimg.com/474x/b4/ab/dc/b4abdc213dcb3dd6fc08264934fcd2e0.jpg",
            "https://i.pinimg.com/474x/0d/7c/4b/0d7c4b72788d4dd6b9fc6a9d43fdf6bf.jpg",
            "https://i.pinimg.com/736x/4c/37/a4/4c37a452d8738da7a1fcbf6f08df6d5b.jpg",
            "https://i.pinimg.com/736x/6a/ac/8a/6aac8aabe0d8fee27153660633682f1d.jpg",
            "https://i.pinimg.com/1200x/ac/b5/d2/acb5d2c97cd51c0a13a23b9d126afc14.jpg",
            "https://i.pinimg.com/736x/0d/7c/28/0d7c289b6044abceb6982573d583ef3f.jpg",
          ].map((src, idx) => (
            <Box
              key={idx}
              component="img"
              src={src}
              alt={`Inspiration ${idx + 1}`}
              sx={{
                width: "100%",
                height: "120px",
                borderRadius: 2,
                objectFit: "cover",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          flex: 1,
          minWidth: "300px",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: 3,
          p: { xs: 1.5, sm: 2.5 },
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={2}
          textAlign="center"
          color="text.primary"
          sx={{ fontSize: "1.4rem" }} 
        >
          Create Account
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2, fontSize: "0.85rem" }}
          >
            {error}
          </Alert>
        )}

        {/* Name Fields */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            variant="outlined"
            size="small" 
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            variant="outlined"
            size="small" 
            required
          />
        </Box>

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          size="small" 
          sx={{ mb: 2 }}
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          size="small" 
          sx={{ mb: 2 }}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          variant="outlined"
          size="small" 
          sx={{ mb: 2 }}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "0.85rem",
          }}
        >
          <CalendarToday fontSize="small" />
          Birth Date
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            mb: 3,
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>Month</InputLabel>
            <Select
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleChange}
              label="Month"
            >
              {months.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Day</InputLabel>
            <Select
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              label="Day"
            >
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              label="Year"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleEmailSignUp}
          disabled={loading}
          size="medium"
          sx={{
            mb: 2,
            backgroundColor: "#f44336",
            borderRadius: "25px",
            padding: "10px 0",
            fontSize: "15px", 
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Sign Up"
          )}
        </Button>
      </Box>
    </Box>
  );
});

export default SignUpForm;
