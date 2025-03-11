import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"; // ✅ เพิ่ม Storage

const firebaseConfig = {
  apiKey: "AIzaSyDJ9mWtns_lXdsyscITqLyJAZEREsYpCAk",
  authDomain: "software-eng-88cea.firebaseapp.com",
  projectId: "software-eng-88cea",
  storageBucket: "software-eng-88cea.appspot.com",
  messagingSenderId: "817152074183",
  appId: "1:817152074183:web:4996814ee6f7e8f0c8b9e2",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ เพิ่ม Storage

// ✅ ฟังก์ชันอัปโหลดรูปโปรไฟล์
const uploadProfileImage = async (file, userId) => {
  if (!file) return null;

  const storageRef = ref(storage, `profilePictures/${userId}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

export {
  auth,
  db,
  doc,
  getDoc,
  updateDoc,
  onAuthStateChanged,
  uploadProfileImage,
};
