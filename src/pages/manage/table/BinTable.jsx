import React from "react";
import { Tag, Dropdown, Modal, message } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";

import { deleteBin } from "../../../service/Bin";

const formatDate = (timestamp) => {
  if (!timestamp) return "ไม่ระบุวันที่";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const columns = (loadData) => [
  {
    title: (
      <>
        <CalendarOutlined /> วันที่เก็บข้อมูล
      </>
    ),
    dataIndex: "workDate",
    key: "workDate",
    sorter: (a, b) =>
      new Date(a.workDate).getTime() - new Date(b.workDate).getTime(),
    render: (workDate) => <Tag color="blue">{formatDate(workDate)}</Tag>,
  },
  {
    title: (
      <>
        <UserOutlined /> กำจัดขยะโดย
      </>
    ),
    dataIndex: "workBy",
    key: "workBy",
  },
  {
    title: (
      <>
        <HomeOutlined /> หน่วยงาน
      </>
    ),
    dataIndex: "workFrom",
    key: "workFrom",
  },
  {
    title: (
      <>
        <ClockCircleOutlined /> เวลากำจัด
      </>
    ),
    dataIndex: "workTime",
    key: "workTime",
    align: "center",
  },
  {
    title: (
      <>
        <DeleteOutlined /> จำนวนขยะมูลฝอย (ตัน)
      </>
    ),
    dataIndex: "solidWaste",
    key: "solidWaste",
    align: "center",
  },
  {
    title: (
      <>
        <MedicineBoxOutlined /> จำนวนขยะติดเชื้อ (ตัน)
      </>
    ),
    dataIndex: "medicalWaste",
    key: "medicalWaste",
    align: "center",
  },
  {
    title: (
      <>
        <FileTextOutlined /> หมายเหตุ
      </>
    ),
    dataIndex: "note",
    key: "note",
    ellipsis: true,
    render: (note) => <Tag color="green">{note || "ไม่มีหมายเหตุ"}</Tag>,
  },
  {
    key: "action",
    fixed: "right",
    width: 80,
    align: "center",
    render: (_, record) => {
      const confirmDelete = () => {
        Modal.confirm({
          title: "ยืนยันการลบ",
          icon: <ExclamationCircleOutlined />,
          content: `คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?`,
          okText: "ลบ",
          okType: "danger",
          cancelText: "ยกเลิก",
          onOk: async () => {
            try {
              const success = await deleteBin(record.id);
              if (success) {
                message.success("ลบข้อมูลขยะสำเร็จ!");
                loadData();
              } else {
                message.error("เกิดข้อผิดพลาดในการลบข้อมูล!");
              }
            } catch (error) {
              message.error("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์!");
            }
          },
        });
      };

      return (
        <Dropdown
          menu={{
            items: [
              {
                key: "delete",
                icon: <DeleteOutlined style={{ color: "red" }} />,
                label: <span style={{ color: "red" }}>ลบ</span>,
                onClick: confirmDelete,
              },
            ],
          }}
          trigger={["click"]}
        >
          <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
        </Dropdown>
      );
    },
  },
];
