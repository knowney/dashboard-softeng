import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Typography,
  Space,
  Modal,
  message,
} from "antd";
import {
  DashboardOutlined,
  ToolOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../service/firebaseDb";
import "./AppLayout.css"; // ✅ ใช้ CSS ใหม่
import profileImage from "../images/2003.png";

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // ✅ เมนูหลัก (แก้ไขใหม่ ใช้ `items` แทน `Menu.Item`)
  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">ผลสรุป</Link>,
    },
    {
      key: "manage",
      icon: <ToolOutlined />,
      label: "Manage",
      children: [
        { key: "/manage/user", label: <Link to="/manage/user">User</Link> },
        { key: "/manage/bin", label: <Link to="/manage/bin">Bin</Link> },
        {
          key: "/manage/category",
          label: <Link to="/manage/category">Category</Link>,
        },
      ],
    },
    {
      key: "/setting",
      icon: <SettingOutlined />,
      label: <Link to="/setting">Setting</Link>,
    },
  ];

  // ✅ เมนู Dropdown สำหรับผู้ใช้ (แก้ไขใหม่ ใช้ `items` แทน `Menu.Item`)
  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
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
          className="app-layout-menu"
          items={menuItems} // ✅ ใช้ `items` แทน `Menu.Item`
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
      <Content className="app-layout-content">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
