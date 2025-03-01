import React, { useState } from "react";
import { Row, Col, Card, Statistic, Divider, Select } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Bar } from "react-chartjs-2"; // สำหรับแสดงกราฟ
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ลงทะเบียนโมดูลที่จำเป็น
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState("month"); // ค่าเริ่มต้นเป็นเดือน
  const [data, setData] = useState({
    labels: [
      "ขยะพลาสติก",
      "ขยะมูลฝอย",
      "ขยะมูลฝอยติดเชื้อ",
      "ขยะอาหาร",
      "ขยะผลิตภัณฑ์เครื่องใช้ไฟฟ้า",
    ],
    datasets: [
      {
        label: "ขยะที่ถูกกำจัด",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        data: [500, 400, 300, 200, 100], // จำนวนขยะที่ถูกกำจัด (หน่วยเป็นตัน)
      },
      {
        label: "ขยะที่ยังไม่ถูกกำจัด",
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        data: [100, 200, 150, 50, 30], // จำนวนขยะที่ยังไม่ได้ถูกกำจัด (หน่วยเป็นตัน)
      },
    ],
  });

  // ฟังก์ชันเพื่อจัดการการเปลี่ยนแปลงช่วงเวลา
  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);

    // ตัวอย่างการเปลี่ยนแปลงข้อมูลกราฟตามช่วงเวลาที่เลือก
    if (value === "day") {
      setData({
        labels: [
          "ขยะพลาสติก",
          "ขยะมูลฝอย",
          "ขยะมูลฝอยติดเชื้อ",
          "ขยะอาหาร",
          "ขยะผลิตภัณฑ์เครื่องใช้ไฟฟ้า",
        ],
        datasets: [
          {
            label: "ขยะที่ถูกกำจัด",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            data: [20, 30, 40, 10, 5], // ตัวเลขเปลี่ยนตามข้อมูลจริง
          },
          {
            label: "ขยะที่ยังไม่ถูกกำจัด",
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            data: [10, 15, 20, 5, 2],
          },
        ],
      });
    } else if (value === "week") {
      setData({
        labels: [
          "ขยะพลาสติก",
          "ขยะมูลฝอย",
          "ขยะมูลฝอยติดเชื้อ",
          "ขยะอาหาร",
          "ขยะผลิตภัณฑ์เครื่องใช้ไฟฟ้า",
        ],
        datasets: [
          {
            label: "ขยะที่ถูกกำจัด",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            data: [100, 150, 200, 60, 30],
          },
          {
            label: "ขยะที่ยังไม่ถูกกำจัด",
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            data: [50, 60, 70, 20, 15],
          },
        ],
      });
    } else if (value === "month") {
      setData({
        labels: [
          "ขยะพลาสติก",
          "ขยะมูลฝอย",
          "ขยะมูลฝอยติดเชื้อ",
          "ขยะอาหาร",
          "ขยะผลิตภัณฑ์เครื่องใช้ไฟฟ้า",
        ],
        datasets: [
          {
            label: "ขยะที่ถูกกำจัด",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            data: [500, 400, 300, 200, 100],
          },
          {
            label: "ขยะที่ยังไม่ถูกกำจัด",
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            data: [100, 200, 150, 50, 30],
          },
        ],
      });
    } else if (value === "year") {
      setData({
        labels: [
          "ขยะพลาสติก",
          "ขยะมูลฝอย",
          "ขยะมูลฝอยติดเชื้อ",
          "ขยะอาหาร",
          "ขยะผลิตภัณฑ์เครื่องใช้ไฟฟ้า",
        ],
        datasets: [
          {
            label: "ขยะที่ถูกกำจัด",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            data: [6000, 5000, 4000, 3000, 2000],
          },
          {
            label: "ขยะที่ยังไม่ถูกกำจัด",
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            data: [2000, 2500, 1800, 1000, 800],
          },
        ],
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            title="ขยะที่ถูกกำจัดในสัปดาห์นี้"
            bordered={false}
            extra={<ArrowUpOutlined />}
          >
            <Statistic
              title="รวม"
              value={1245}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            title="ขยะที่ถูกกำจัดในเดือนนี้"
            bordered={false}
            extra={<TruckOutlined />}
          >
            <Statistic
              title="รวม"
              value={8482}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            title="ขยะที่ยังไม่ถูกกำจัด"
            bordered={false}
            extra={<ArrowDownOutlined />}
          >
            <Statistic
              title="รวม"
              value={747}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="การวิเคราะห์ขยะ (กราฟแท่ง)" bordered={false}>
            <Select
              defaultValue="month"
              style={{ width: 120 }}
              onChange={handleTimePeriodChange}
            >
              <Option value="day">วัน</Option>
              <Option value="week">สัปดาห์</Option>
              <Option value="month">เดือน</Option>
              <Option value="year">ปี</Option>
            </Select>
            <Bar data={data} options={{ responsive: true }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
