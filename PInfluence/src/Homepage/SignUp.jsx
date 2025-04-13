// src/components/SignUpForm.jsx
import React, { useState, forwardRef } from "react";
import { auth, googleProvider } from "../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Box, Button, TextField, Typography } from "@mui/material";

const SignUpForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({ email: "", password: "", birthdate: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEmailSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Sign-up successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed up with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box
      ref={ref} // 👈 Add the ref to the top-level Box so scrollIntoView works
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        mt: 4,
      }}
    >
      {/* Left Side - Image Grid and CTA */}
      <Box sx={{ flex: 1, minWidth: "300px", maxWidth: "500px", textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" mb={2} color="black">
          Sign up to get your ideas
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            mt: 2,
          }}
        >
          {[
            "https://i.pinimg.com/474x/b4/ab/dc/b4abdc213dcb3dd6fc08264934fcd2e0.jpg",
            "https://i.pinimg.com/736x/a1/ab/76/a1ab761a7c5e24ccae23f5367327b4fa.jpg",
            "https://i.pinimg.com/474x/0d/7c/4b/0d7c4b72788d4dd6b9fc6a9d43fdf6bf.jpg",
            "https://i.pinimg.com/736x/4c/37/a4/4c37a452d8738da7a1fcbf6f08df6d5b.jpg",
          ].map((src, idx) => (
            <Box
              key={idx}
              component="img"
              src={src}
              alt="grid"
              sx={{ width: "100%", height: "120px", borderRadius: 2, objectFit: "cover" }}
            />
          ))}
        </Box>
      </Box>

      {/* Right Side - Form */}
      <Box sx={{ flex: 1, minWidth: "300px", maxWidth: "400px" }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Create Account</Typography>
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" />
        <TextField fullWidth type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
        <Button fullWidth variant="contained" onClick={handleEmailSignUp} sx={{ mt: 2, backgroundColor: "#f44336", borderRadius: "25px", padding: "12px", fontSize: "16px" }}>
          Continue
        </Button>
        <Button fullWidth variant="outlined" onClick={handleGoogleSignUp} sx={{ mt: 2, borderRadius: "25px", padding: "12px", fontSize: "16px" }}>
          Sign Up with Google
        </Button>
      </Box>
    </Box>
  );
});

export default SignUpForm;
