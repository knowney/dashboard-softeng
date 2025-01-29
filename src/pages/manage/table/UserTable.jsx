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
import { Modal } from "antd";

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
    defaultSortOrder: "ascend",
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
    defaultSortOrder: "ascend",
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
      // ✅ ฟังก์ชันยืนยันการลบ
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

      // ✅ เพิ่มตัวเลือก "ลบ" ลงใน dropdown
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
          onClick: confirmDelete, // ✅ เรียก Modal ยืนยันก่อนลบ
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
