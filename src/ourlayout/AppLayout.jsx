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
// import binLogo from "../images/binLogo.svg";
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

  // ✅ เมนู Dropdown สำหรับผู้ใช้ (Profile + Logout)
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="help" icon={<AppstoreAddOutlined />}>
        Help Center
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        style={{ color: "red" }}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="app-layout">
      {/* 🔹 Header Navbar */}
      <Header className={`app-layout-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="logo">
          {/* <img src={binLogo} alt="Logo" className="logo-image" /> */}
          <Title level={3} className="app-layout-title"></Title>
        </div>
        {/* 🔹 เมนูหลัก */}
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="app-layout-menu"
        >
          <Menu.Item key="/index">
            <Link to="/index"></Link>
          </Menu.Item>
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">ผลสรุป</Link>
          </Menu.Item>
          <Menu.SubMenu key="manage" icon={<ToolOutlined />} title="Manage">
            <Menu.Item key="/manage/user">
              <Link to="/manage/user">User</Link>
            </Menu.Item>
            <Menu.Item key="/manage/bin">
              <Link to="/manage/bin">Bin</Link>
            </Menu.Item>
            <Menu.Item key="/manage/category">
              <Link to="/manage/category">Category</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="/setting" icon={<SettingOutlined />}>
            <Link to="/setting">Setting</Link>
          </Menu.Item>
        </Menu>
        {/* 🔹 Dropdown Profile */}
        <Dropdown overlay={userMenu} trigger={["click"]}>
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
