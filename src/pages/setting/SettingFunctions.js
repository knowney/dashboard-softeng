import {
  auth,
  db,
  doc,
  getDoc,
  updateDoc,
  onAuthStateChanged,
} from "../../service/firebaseDb";
import { message } from "antd";

// ✅ ดึงข้อมูลผู้ใช้จาก Firestore
export const fetchUserData = (setUser, setFormData) => {
  return onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setFormData(userDoc.data());
      }
    }
  });
};

// ✅ อัปเดตข้อมูลผู้ใช้ใน Firestore
export const updateUserProfile = async (
  user,
  formData,
  setIsSuccessModalOpen
) => {
  if (!user) return;
  try {
    await updateDoc(doc(db, "users", user.uid), formData);
    message.success("อัปเดตข้อมูลสำเร็จ!");

    // ✅ แสดง Modal ว่าบันทึกสำเร็จ
    setIsSuccessModalOpen(true);

    // ✅ ตั้งเวลาให้ Modal ปิดเองภายใน 1.2 วินาที และรีเฟรชหน้า
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      window.location.reload(); // ✅ รีเฟรชหน้าเว็บอัตโนมัติ
    }, 1200);
  } catch (error) {
    console.error("Error updating profile:", error);
    message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
  }
};

// ✅ จัดการการเปลี่ยนแปลงค่าในฟอร์ม
export const handleInputChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// ✅ จัดการการเปลี่ยน Avatar
export const handleSelectAvatar = (
  avatar,
  formData,
  setFormData,
  setIsModalOpen
) => {
  setFormData({ ...formData, avatar });
  setIsModalOpen(false);
};

// ✅ รายการ Avatar ให้เลือก
export const avatarOptions = [
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=alpha",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=beta",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=gamma",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=delta",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=epsilon",
  "https://api.dicebear.com/7.x/notionists/svg?seed=zeta",
  "https://api.dicebear.com/7.x/notionists/svg?seed=eta",
  "https://api.dicebear.com/7.x/notionists/svg?seed=theta",
  "https://api.dicebear.com/7.x/notionists/svg?seed=iota",
  "https://api.dicebear.com/7.x/notionists/svg?seed=kappa",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=lambda",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=mu",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nu",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=xi",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=omicron",
];
