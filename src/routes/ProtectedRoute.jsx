import { Navigate } from "react-router-dom";
import { auth } from "../service/firebaseDb";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Spin } from "antd"; // ✅ Import Spin
import "./protectedRoute.css"; // ✅ Import ไฟล์ CSS เพิ่มเติม

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ ใช้ Ant Design Spin แสดง Loading
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
