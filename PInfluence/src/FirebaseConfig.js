// src/FirebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBN-qdwgE6cVbv46gNj_trAlWcOmJ1w4dY",
  authDomain: "pinfluence-f7ed1.firebaseapp.com",
  projectId: "pinfluence-f7ed1",
  storageBucket: "pinfluence-f7ed1.firebasestorage.app",
  messagingSenderId: "1079964332527",
  appId: "1:1079964332527:web:f7ca4f5dcb7e40e3e4c61a",
  measurementId: "G-NTEMBRDCBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();