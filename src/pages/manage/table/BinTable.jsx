import { Tag } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const formatDate = (timestamp) => {
  if (!timestamp) return "ไม่ระบุวันที่";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const columns = [
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
    sorter: (a, b) => a.workBy.localeCompare(b.workBy),
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
    sorter: (a, b) => a.solidWaste - b.solidWaste,
  },
  {
    title: (
      <>
        <MedicineBoxOutlined /> จำนวนขยะติดเชื้อ (ตัน)
      </>
    ),
    dataIndex: "medicalWaste",
    key: "medicalWaste",
    sorter: (a, b) => a.medicalWaste - b.medicalWaste,
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
];
