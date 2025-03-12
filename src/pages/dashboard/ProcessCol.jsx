import React from "react";
import { Avatar } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const ProcessCol = () => {
  return [
    {
      title: "พนักงาน",
      dataIndex: "avatar",
      key: "avatar",
      width: 80, // ✅ กำหนดความกว้างของคอลัมน์
      align: "center",
      render: (avatar) => (
        <Avatar
          src={
            avatar || "https://api.dicebear.com/7.x/open-peeps/svg?seed=default"
          }
          size={40}
          icon={<UserOutlined />}
        />
      ),
    },
    {
      title: "ชื่อพนักงาน",
      dataIndex: "workBy",
      key: "workBy",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "#595959" }}>
          <UserOutlined style={{ marginRight: 5 }} />
          {text}
        </span>
      ),
    },
    {
      title: "จาก",
      dataIndex: "workFrom",
      key: "workFrom",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "#1E90FF" }}>
          <EnvironmentOutlined style={{ marginRight: 5 }} />
          {text}
        </span>
      ),
    },
    {
      title: (
        <>
          <DeleteOutlined style={{ color: "#52c41a" }} /> ขยะมูลฝอย (ตัน)
        </>
      ),
      dataIndex: "solidWaste",
      key: "solidWaste",
      render: (solidWaste) => (
        <span
          style={{
            backgroundColor: "#e6f7e6",
            color: "#52c41a",
            fontWeight: "bold",
            padding: "5px 10px",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          {solidWaste}
        </span>
      ),
    },
    {
      title: (
        <>
          <MedicineBoxOutlined style={{ color: "#1890ff" }} /> ขยะติดเชื้อ (ตัน)
        </>
      ),
      dataIndex: "medicalWaste",
      key: "medicalWaste",
      render: (medicalWaste) => (
        <span
          style={{
            backgroundColor: "#e6f7ff",
            color: "#1890ff",
            fontWeight: "bold",
            padding: "5px 10px",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          {medicalWaste}
        </span>
      ),
    },
  ];
};

export default ProcessCol;
