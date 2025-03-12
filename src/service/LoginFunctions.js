import { auth, db } from "./firebaseDb";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDoc, setDoc, doc, collection } from "firebase/firestore";
import { message } from "antd";
import { signOut } from "firebase/auth";

export const handleAuthAction = async (
  values,
  isRegister,
  navigate,
  setLoading
) => {
  setLoading(true);
  try {
    let userCredential;
    if (isRegister) {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await setDoc(doc(collection(db, "users"), userCredential.user.uid), {
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        uid: userCredential.user.uid,
        role: "ผู้ใช้งาน",
        status: "active",
        createdAt: new Date(),
      });
    } else {
      userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // 🔍 ตรวจสอบ status ของผู้ใช้
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().status === "disable") {
        message.error("บัญชีนี้ถูกปิดใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ !");

        // 🚀 ทำการล็อกเอาท์ก่อน Redirect
        await signOut(auth);

        setLoading(false);
        setTimeout(() => {
          navigate("/login");
          window.location.reload(); // 🔄 รีโหลดหน้าเพื่ออัปเดต Auth State
        }, 1500);
        return;
      }
    }
    message.success(
      `${isRegister ? "สมัครเข้าใช้งานเรียบร้อย" : "ยินดีต้อนรับ"} !`
    );
    navigate("/");
  } catch (error) {
    message.error(error.message || "มีข้อผิดพลาดเกิดขึ้น โปรดลองใหม่อีกครั้ง!");
  }
  setLoading(false);
};

export const handleForgotPassword = async (
  resetEmail,
  setIsModalVisible,
  setResetEmail
) => {
  if (!resetEmail) {
    message.warning("กรุณากรอกอีเมลของคุณ");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, resetEmail);
    message.success(
      "ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ! โปรดตรวจสอบกล่องจดหมายของคุณ"
    );
    setIsModalVisible(false);
    setResetEmail("");
  } catch (error) {
    message.error("เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง");
  }
};
