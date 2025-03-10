import { Switch, Dropdown } from "antd";
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
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Modal, Tag } from "antd";
import "./UserTable.css";
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
    width: 80, // ✅ ปรับขนาดคอลัมน์
    fixed: "left", // ✅ ทำให้ลำดับอยู่ซ้ายเสมอ
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
    defaultSortOrder: "ascend",
    ellipsis: true, // ✅ ทำให้ข้อความไม่ยาวเกินไป
    responsive: ["sm"], // ✅ ซ่อนบนจอเล็ก
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
    ellipsis: true,
    responsive: ["md"], // ✅ ซ่อนบนจอเล็กมาก
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
    ellipsis: true,
    responsive: ["lg"], // ✅ ซ่อนบนจอขนาดกลาง
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
      { text: "พนักงาน", value: "employee" },
      { text: "แอดมิน", value: "admin" },
    ],
    onFilter: (value, record) => record.role === value,
    sorter: (a, b) =>
      (a.role?.toString() || "").localeCompare(b.role?.toString() || ""),
    responsive: ["sm"],

    // ✅ ใช้ `Tag` เพื่อให้ข้อความบทบาท (role) ดูโดดเด่น
    render: (role) => {
      const roleMapping = {
        ผู้ใช้งาน: { label: "ผู้ใช้งาน", color: "green" },
        พนักงาน: { label: "พนักงาน", color: "blue" },
        แอดมิน: { label: "แอดมิน", color: "purple" },
      };

      return (
        <Tag
          color={roleMapping[role]?.color || "default"}
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            padding: "5px 12px",
            borderRadius: "20px",
            textTransform: "uppercase",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)", // ✅ เพิ่มเงาให้ดูเด่นขึ้น
          }}
        >
          {roleMapping[role]?.label || "พนักงาน"}
        </Tag>
      );
    },
  },
  {
    title: (
      <>
        <CalendarOutlined /> วันที่สร้าง
      </>
    ),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (timestamp) => {
      if (!timestamp) return "-";
      const date = timestamp.toDate();
      return date.toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
    sorter: (a, b) =>
      (a.createdAt?.toDate() || 0) - (b.createdAt?.toDate() || 0),
    defaultSortOrder: "ascend",
    responsive: ["md"], // ✅ ซ่อนบนจอเล็กมาก
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
    fixed: "right", // ✅ ให้สถานะอยู่ขวาสุดเสมอ
  },
  {
    key: "action",
    fixed: "right",
    width: 80, // ✅ กำหนดขนาดให้พอดี
    render: (_, record) => {
      const confirmDelete = () => {
        Modal.confirm({
          title: "ยืนยันการลบ",
          icon: <ExclamationCircleOutlined />,
          content: `คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ ${record.name} ${record.lastName} ?`,
          okText: "ลบ",
          okType: "danger",
          cancelText: "ยกเลิก",
          onOk: () => handleDeleteUser(record.uid),
        });
      };

      const menuItems = [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "แก้ไข",
          onClick: () => handleEditUser(record),
        },
        {
          key: "delete",
          icon: <DeleteOutlined style={{ color: "red" }} />,
          label: <span style={{ color: "red" }}>ลบ</span>,
          onClick: confirmDelete,
        },
      ];

      return (
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
        </Dropdown>
      );
    },
  },
];
