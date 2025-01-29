// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ9mWtns_lXdsyscITqLyJAZEREsYpCAk",
  authDomain: "software-eng-88cea.firebaseapp.com",
  projectId: "software-eng-88cea",
  storageBucket: "software-eng-88cea.firebasestorage.app",
  messagingSenderId: "817152074183",
  appId: "1:817152074183:web:4996814ee6f7e8f0c8b9e2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default { db };
