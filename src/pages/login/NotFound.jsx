import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - ไม่พบหน้าที่คุณต้องการ</h1>
      <p>ขออภัย หน้าที่คุณพยายามเข้าถึงไม่มีอยู่</p>
      <Link to="/" className="go-home">
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
};

// ✅ แค่ export default เท่านั้น ไม่ต้องมี createRoot
export default NotFound;
