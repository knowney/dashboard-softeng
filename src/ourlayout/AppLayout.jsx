import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../service/firebaseDb";
import { doc, getDoc } from "firebase/firestore";
import { message, Button, Modal } from "antd";
import logo from "../images/logotop.png"; // ✅ นำโลโก้มาใช้
import "./AppLayout.css";
import { LogoutOutlined } from "@ant-design/icons"; // ✅ นำเข้าไอคอน Logout

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // ✅ ใช้สำหรับ Mobile Menu

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return navigate("/login");

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && isMounted) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error("❌ Error fetching user role:", error);
      }
    };

    fetchUserRole();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    Modal.confirm({
      title: "ยืนยันการออกจากระบบ",
      content: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      okText: "ออกจากระบบ",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await signOut(auth);
          message.success("ออกจากระบบสำเร็จ!");
          navigate("/login");
        } catch (error) {
          console.error("Logout failed:", error);
          message.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        }
      },
    });
  };

  const menuItems = [
    { key: "/", label: "หน้าแรก", path: "/" },
    { key: "/dashboard", label: "ผลสรุป", path: "/dashboard" },
    { key: "/work-day", label: "ส่งข้อมูลการกำจัดขยะ", path: "/work-day" },
    ...(userRole === "แอดมิน"
      ? [
          { key: "/manage/user", label: "จัดการผู้ใช้", path: "/manage/user" },
          { key: "/manage/bin", label: "จัดการขยะ", path: "/manage/bin" },
        ]
      : []),
  ];

  return (
    <div className="app-container">
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        {/* ✅ แสดงโลโก้แทนข้อความ MyApp */}
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>

        {/* เมนูหลัก (Desktop) */}
        <div className="menu">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}

          {/* Dropdown "เพิ่มเติม" */}
          <div className="dropdown">
            <button className="dropdown-toggle">เพิ่มเติม</button>
            <div className="dropdown-menu">
              <Link
                to="/setting"
                className={location.pathname === "/setting" ? "active" : ""}
              >
                ตั้งค่า
              </Link>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />} // ✅ เพิ่มไอคอน Logout
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",

                  borderRadius: "8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px", // ✅ เพิ่มระยะห่างระหว่างไอคอนและข้อความ
                }}
                onClick={handleLogout}
              >
                ลงชื่อออก
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ ปุ่มเปิด/ปิดเมนูมือถือ (ใช้ :) */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* ✅ Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/setting" onClick={() => setMenuOpen(false)}>
            ตั้งค่า
          </Link>

          <Button
            type="primary"
            danger
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              textAlign: "center",
            }}
            onClick={handleLogout}
          >
            ลงชื่อออก
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
