import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../src/service/firebaseDb"; // ✅ นำเข้า Firestore instance
import { deleteUser as deleteAuthUser, getAuth } from "firebase/auth";
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
    console.log("🗑 กำลังลบผู้ใช้:", uid);

    // ✅ ลบจาก Firestore
    await deleteDoc(doc(db, "users", uid));
    console.log("✅ ลบจาก Firestore สำเร็จ!");

    // ✅ ลบจาก Firebase Authentication (ต้องเป็นแอดมิน)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await deleteAuthUser(user);
      console.log("✅ ลบจาก Firebase Authentication สำเร็จ!");
    }

    return true;
  } catch (error) {
    console.error("❌ Error deleting user:", error);
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
    if (!userData.uid) {
      throw new Error("UID ไม่ถูกต้อง!"); // ✅ ป้องกันการเพิ่มผู้ใช้โดยไม่มี UID
    }

    await setDoc(doc(db, "users", userData.uid), userData);
    console.log("✅ เพิ่มผู้ใช้ลง Firestore สำเร็จ:", userData.uid);

    return { uid: userData.uid, ...userData };
  } catch (error) {
    console.error("❌ Error adding user:", error);
    return null;
  }
};
