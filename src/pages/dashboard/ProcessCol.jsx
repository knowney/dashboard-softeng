// src/components/ProcessCol.jsx
import React from "react";
import { Avatar } from "antd";

const ProcessCol = () => {
  return [
    {
      title: "พนักงาน",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Avatar src={avatar} size={40} />,
    },
    {
      title: "ชื่อพนักงาน (UID)",
      dataIndex: "workBy",
      key: "workBy",
    },
    {
      title: "สถานที่ทำงาน",
      dataIndex: "workFrom",
      key: "workFrom",
    },
    {
      title: "ขยะมูลฝอย (ตัน)",
      dataIndex: "solidWaste",
      key: "solidWaste",
      render: (solidWaste) => (
        <span className="waste-number">{solidWaste}</span>
      ),
    },
    {
      title: "ขยะติดเชื้อ (ตัน)",
      dataIndex: "medicalWaste",
      key: "medicalWaste",
      render: (medicalWaste) => (
        <span className="waste-number">{medicalWaste}</span>
      ),
    },
  ];
};

export default ProcessCol;
