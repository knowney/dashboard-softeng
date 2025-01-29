import React, { useState } from "react";
import { Layout, Menu, Typography, Dropdown, Avatar, Space } from "antd";
import {
  DashboardOutlined,
  ToolOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ContainerOutlined,
  AppstoreAddOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet } from "react-router-dom";
import "./AppLayout.css"; // เรียกใช้ไฟล์ CSS
import binLogo from "../images/binLogo.svg";
import profileImage from "../images/2003.png"; // รูปโปรไฟล์

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "2",
    icon: <ToolOutlined />,
    label: "Manage",
    path: "/manage",
    children: [
      {
        key: "2-1",
        label: "User",
        icon: <UserOutlined />,
        path: "/manage/user",
      },
      {
        key: "2-2",
        label: "Bin",
        icon: <ContainerOutlined />,
        path: "/manage/bin",
      },
      {
        key: "2-3",
        label: "Category",
        icon: <AppstoreAddOutlined />,
        path: "/manage/category",
      },
    ],
  },
  {
    key: "3",
    icon: <SettingOutlined />,
    label: "Setting",
    path: "/setting",
  },
];

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
    <Menu.Item key="logout" icon={<DownOutlined />} style={{ color: "red" }}>
      Logout
    </Menu.Item>
  </Menu>
);

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // ใช้เพื่อดึงข้อมูลเส้นทาง

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="app-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        className="app-layout-sider"
      >
        <div className="logo">
          <img src={binLogo} alt="Logo" className="logo-image" />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="app-layout-menu"
        >
          {menuItems.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((subItem) => (
                  <Menu.Item key={subItem.path}>
                    <Link to={subItem.path}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.path} icon={item.icon}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="app-layout-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="trigger" onClick={toggleCollapse}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger-icon",
              }
            )}
          </div>
          <Title level={3} className="app-layout-title" style={{ margin: 0 }}>
            Bin Dashboard
          </Title>
          {/* เพิ่ม Dropdown สำหรับเมนู Profile, Settings, Help Center, Logout */}
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Space>
              <Avatar
                src={profileImage}
                icon={<UserOutlined />}
                className="profile-avatar"
              />
            </Space>
          </Dropdown>
        </Header>
        <Content className="app-layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
