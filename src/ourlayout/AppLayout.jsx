import React, { useState, useEffect } from "react";
import {
  Layout,
  Dropdown,
  Avatar,
  Typography,
  Space,
  Modal,
  message,
  Menu,
} from "antd";
import {
  HomeOutlined,
  LineChartOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  LogoutOutlined,
  PlusSquareOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../service/firebaseDb";
import { doc, getDoc } from "firebase/firestore";
import "./AppLayout.css";
import profileImage from "../images/2003.png";

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState(""); // ✅ เก็บ role ของผู้ใช้

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ✅ ดึง Role ของผู้ใช้จาก Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return navigate("/login"); // ถ้าไม่ได้ล็อกอิน ให้ไปหน้า Login

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // ✅ ตั้งค่า Role ของผู้ใช้
        } else {
          console.warn("⚠️ ไม่พบข้อมูลผู้ใช้ใน Firestore");
        }
      } catch (error) {
        console.error("❌ Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [navigate]);

  // ✅ ฟังก์ชัน Logout พร้อม Confirm Modal
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

  // ✅ เมนูหลัก (กำหนดสิทธิ์ให้ `admin` เท่านั้นที่เห็นเมนูจัดการ)
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">หน้าแรก</Link>,
    },
    {
      key: "/dashboard",
      icon: <LineChartOutlined />,
      label: <Link to="/dashboard">ผลสรุป</Link>,
    },
    {
      key: "/work-day",
      icon: <PlusSquareOutlined />,
      label: <Link to="/work-day">ทำงาน</Link>,
    },
    // ✅ เพิ่มเมนู "จัดการ" เฉพาะแอดมิน โดยไม่มี children
    ...(userRole === "แอดมิน"
      ? [
          {
            key: "/manage/user",
            icon: <UserOutlined />,
            label: <Link to="/manage/user">จัดการผู้ใช้</Link>,
          },
          {
            key: "/manage/bin",
            icon: <DeleteOutlined />,
            label: <Link to="/manage/bin">จัดการขยะ</Link>,
          },
          {
            key: "/manage/category",
            icon: <AppstoreOutlined />,
            label: <Link to="/manage/category">จัดการหมวดหมู่</Link>,
          },
        ]
      : []),
    {
      key: "/setting",
      icon: <SettingOutlined />,
      label: <Link to="/setting">ตั้งค่า</Link>,
    },
  ];

  // ✅ เมนู Dropdown สำหรับผู้ใช้
  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/setting">ตั้งค่า</Link>,
    },
    { key: "help", icon: <AppstoreAddOutlined />, label: "Help Center" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="app-layout">
      {/* 🔹 Header Navbar */}
      <Header className={`app-layout-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="logo">
          <Title level={3} className="app-layout-title"></Title>
        </div>

        {/* 🔹 เมนูหลัก */}
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="app-menu"
          items={menuItems} // ✅ ใช้ `items` แทน `Menu.Item`
          overflowedIndicator={false} // ✅ ปิดเมนู Dropdown อัตโนมัติ
        />

        {/* 🔹 Dropdown Profile */}
        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <Space className="profile-section">
            <Avatar
              src={profileImage}
              icon={<UserOutlined />}
              className="profile-avatar"
            />
          </Space>
        </Dropdown>
      </Header>

      {/* 🔹 Content Layout */}
      <Content className="app-layout-content" key={location.pathname}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
