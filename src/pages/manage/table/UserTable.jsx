import { Switch, Dropdown, Menu } from "antd";
import {
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  NumberOutlined,
  RetweetOutlined,
} from "@ant-design/icons";

export const userColumns = (
  handleEditUser,
  handleDeleteUser,
  handleToggleStatus,
  pagination
) => [
  {
    title: (
      <>
        <NumberOutlined /> ลำดับ
      </>
    ),
    key: "index",
    render: (_, __, index) =>
      ((pagination?.current || 1) - 1) * (pagination?.pageSize || 5) +
      index +
      1,
  },
  {
    title: (
      <>
        <UserOutlined /> ชื่อ
      </>
    ),
    dataIndex: "name",
    key: "name",
    sorter: (a, b) =>
      (a.name?.toString() || "").localeCompare(b.name?.toString() || ""),
    defaultSortOrder: "ascend", // ✅ เรียงจาก A → Z เป็นค่าเริ่มต้น
  },
  {
    title: (
      <>
        <UserOutlined /> นามสกุล
      </>
    ),
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) =>
      (a.lastName?.toString() || "").localeCompare(
        b.lastName?.toString() || ""
      ),
  },
  {
    title: (
      <>
        <MailOutlined /> อีเมล
      </>
    ),
    dataIndex: "email",
    key: "email",
    sorter: (a, b) =>
      (a.email?.toString() || "").localeCompare(b.email?.toString() || ""),
  },
  {
    title: (
      <>
        <TeamOutlined /> บทบาท
      </>
    ),
    dataIndex: "role",
    key: "role",
    filters: [
      { text: "ผู้ใช้", value: "user" },
      { text: "แอดมิน", value: "admin" },
    ],
    onFilter: (value, record) => record.role === value,
    sorter: (a, b) =>
      (a.role?.toString() || "").localeCompare(b.role?.toString() || ""),
  },
  {
    title: (
      <>
        <CalendarOutlined /> วันที่สร้าง
      </>
    ),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (timestamp) =>
      timestamp ? new Date(timestamp.toDate()).toLocaleString() : "-",
    sorter: (a, b) =>
      (a.createdAt?.toDate() || 0) - (b.createdAt?.toDate() || 0),
    defaultSortOrder: "ascend", // ✅ เรียงจากเก่าสุด → ใหม่สุด เป็นค่าเริ่มต้น
  },
  {
    title: (
      <>
        <RetweetOutlined /> สถานะ
      </>
    ),
    dataIndex: "status",
    key: "status",
    sorter: (a, b) =>
      (a.status?.toString() || "").localeCompare(b.status?.toString() || ""),
    render: (status, record) => (
      <Switch
        checked={status === "active"}
        onChange={() => handleToggleStatus(record.uid, status)}
        checkedChildren="Active"
        unCheckedChildren="Disable"
      />
    ),
  },
  {
    key: "action",
    render: (_, record) => {
      const menu = (
        <Menu>
          <Menu.Item
            key="edit"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            แก้ไข
          </Menu.Item>
          <Menu.Item
            key="delete"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteUser(record.uid)}
          >
            ลบ
          </Menu.Item>
        </Menu>
      );

      return (
        <Dropdown overlay={menu} trigger={["click"]}>
          <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
        </Dropdown>
      );
    },
  },
];
