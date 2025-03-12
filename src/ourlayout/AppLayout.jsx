import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../service/firebaseDb";
import { doc, getDoc } from "firebase/firestore";
import { message, Button, Modal, Dropdown, Avatar, Breadcrumb } from "antd";
import logo from "../images/logotop.png";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import "./AppLayout.css";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return navigate("/login");

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && isMounted) {
          setUserRole(userDoc.data().role);
          setUserAvatar(
            userDoc.data().avatar ||
              "https://api.dicebear.com/7.x/open-peeps/svg?seed=default"
          );
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
    { key: "/dashboard", label: "ภาพรวมการทำงาน", path: "/dashboard" },
    ...(userRole === "พนักงาน"
      ? [
          {
            key: "/work-day",
            label: "ส่งข้อมูลการกำจัดขยะ",
            path: "/work-day",
          },
        ]
      : []),
    ...(userRole === "แอดมิน"
      ? [
          { key: "/manage/user", label: "ผู้ใช้งาน", path: "/manage/user" },
          {
            key: "/work-day",
            label: "ส่งข้อมูลการกำจัดขยะ",
            path: "/work-day",
          },
          { key: "/manage/bin", label: "การกำจัดขยะ", path: "/manage/bin" },
        ]
      : []),
  ];

  const dropdownMenu = {
    items: [
      {
        key: "setting",
        label: <Link to="/setting">ตั้งค่าโปรไฟล์</Link>,
        icon: <SettingOutlined />,
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        label: "ลงชื่อออก",
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  // ✅ แปลง URL เป็น Breadcrumb
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = [
    { key: "home", title: <Link to="/">🏠 หน้าแรก</Link> },
    ...pathSnippets.map((value, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        key: url,
        title: <Link to={url}>{decodeURIComponent(value)}</Link>,
      };
    }),
  ];

  return (
    <div className="app-container">
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>

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

          {!isMobile && (
            <Dropdown menu={dropdownMenu} trigger={["click"]}>
              <Avatar
                src={userAvatar}
                size={50}
                className="cursor-pointer dropdown-trigger"
                style={{ border: "1px solid #0b8d2a" }}
              />
            </Dropdown>
          )}
        </div>

        {isMobile && (
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        )}

        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          <div className="mobile-avatar-container">
            <Avatar src={userAvatar} size={80} className="cursor-pointer" />
          </div>

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

      {/* ✅ Breadcrumb ใต้ Navbar */}
      <div className="breadcrumb-container">
        <Breadcrumb separator=">" items={breadcrumbItems} />
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
