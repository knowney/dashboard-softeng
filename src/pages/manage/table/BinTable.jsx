import React from "react";
import { Tag, DatePicker, Dropdown, Modal, message } from "antd";
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
import dayjs from "dayjs";
import { deleteBin } from "../../../service/Bin"; // ✅ Import ฟังก์ชันลบเฉพาะรายการ

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
    sorter: (a, b) => {
      const dateA = a.workDate?.toDate
        ? a.workDate.toDate().getTime()
        : new Date(a.workDate).getTime();
      const dateB = b.workDate?.toDate
        ? b.workDate.toDate().getTime()
        : new Date(b.workDate).getTime();
      return dateA - dateB;
    },
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
  },
  {
    title: (
      <>
        <DeleteOutlined /> จำนวนขยะมูลฝอย (ตัน)
      </>
    ),
    dataIndex: "solidWaste",
    key: "solidWaste",
  },
  {
    title: (
      <>
        <MedicineBoxOutlined /> จำนวนขยะติดเชื้อ (ตัน)
      </>
    ),
    dataIndex: "medicalWaste",
    key: "medicalWaste",
  },
  {
    title: (
      <>
        <FileTextOutlined /> หมายเหตุ
      </>
    ),
    dataIndex: "note",
    key: "note",
    render: (note) => <Tag color="green">{note || "ไม่มีหมายเหตุ"}</Tag>,
  },
  {
    key: "action",
    fixed: "right",
    width: 80,
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
            const success = await deleteBin(record.id);
            if (success) {
              message.success("ลบข้อมูลขยะสำเร็จ!");
              loadData(); // ✅ โหลดข้อมูลใหม่
            } else {
              message.error("เกิดข้อผิดพลาดในการลบข้อมูล!");
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
