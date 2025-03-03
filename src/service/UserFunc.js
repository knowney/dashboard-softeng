import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../src/service/firebaseDb"; // ✅ นำเข้า Firestore instance

// ✅ ฟังก์ชันดึงข้อมูล Users ทั้งหมด
export const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersList = querySnapshot.docs.map((doc) => ({
      key: doc.id,
      uid: doc.id,
      ...doc.data(),
    }));
    return usersList;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// ✅ ฟังก์ชันลบผู้ใช้
export const deleteUser = async (uid) => {
  try {
    await deleteDoc(doc(db, "users", uid));
    console.log("Deleted user:", uid);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

// ✅ ฟังก์ชันอัปเดตข้อมูลผู้ใช้
export const updateUser = async (uid, updatedData) => {
  try {
    await updateDoc(doc(db, "users", uid), updatedData);
    console.log("Updated user:", uid);
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

export const toggleUserStatus = async (uid, currentStatus) => {
  try {
    const newStatus = currentStatus === "active" ? "disable" : "active"; // ✅ สลับค่า
    await updateDoc(doc(db, "users", uid), { status: newStatus });
    console.log(`User ${uid} status updated to: ${newStatus}`);
    return newStatus; // ✅ ส่งค่าใหม่กลับไป
  } catch (error) {
    console.error("Error updating user status:", error);
    return null;
  }
};

// ✅ ฟังก์ชันเพิ่มผู้ใช้ใหม่
export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("Added user with ID:", docRef.id);
    return { uid: docRef.id, ...userData };
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};
