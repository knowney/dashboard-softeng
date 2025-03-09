import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../service/firebaseDb";
import { doc, getDoc } from "firebase/firestore";
import { message, Modal } from "antd";
import logo from "../images/logotop.png"; // ✅ นำโลโก้มาใช้
import "./AppLayout.css";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
          // { key: "/manage/bin", label: "จัดการขยะ", path: "/manage/bin" },
          // {
          //   key: "/manage/category",
          //   label: "จัดการหมวดหมู่",
          //   path: "/manage/category",
          // },
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
              <button onClick={handleLogout}>ลงชื่อออก</button>
            </div>
          </div>
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
