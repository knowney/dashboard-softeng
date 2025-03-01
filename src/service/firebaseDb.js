// Import Firebase SDK ที่จำเป็น
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firestore Database

// Firebase Configuration (ข้อมูลโปรเจ็กต์ของคุณ)
const firebaseConfig = {
  apiKey: "AIzaSyDJ9mWtns_lXdsyscITqLyJAZEREsYpCAk",
  authDomain: "software-eng-88cea.firebaseapp.com",
  projectId: "software-eng-88cea",
  storageBucket: "software-eng-88cea.appspot.com", // 🔹 **แก้ไข `storageBucket` ให้ถูกต้อง**
  messagingSenderId: "817152074183",
  appId: "1:817152074183:web:4996814ee6f7e8f0c8b9e2",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Services
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore Database

// ✅ Export เป็น Named Export
export { auth, db };
