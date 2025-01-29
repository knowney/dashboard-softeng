import React from "react";
import { Row, Col, Card, Statistic, Divider } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Bar } from "react-chartjs-2"; // สำหรับการแสดงกราฟ
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

const Dashboard = () => {
  // ข้อมูลตัวอย่างที่ใช้
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "In Transit",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        data: [500000, 400000, 450000, 600000, 550000, 500000],
      },
      {
        label: "Delivered",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        data: [200000, 250000, 300000, 350000, 400000, 450000],
      },
      {
        label: "Delayed",
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        data: [100000, 150000, 100000, 130000, 120000, 110000],
      },
    ],
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {" "}
        {/* เพิ่มระยะห่างระหว่าง Card */}
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            title="ขยะที่ถูกกำจัดสัปดาห์นี้"
            bordered={false}
            extra={<ArrowUpOutlined />}
          >
            <Statistic
              title="Total"
              value={1245}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            title="ขยะที่ถูกกำจัดเดือนนี้"
            bordered={false}
            extra={<TruckOutlined />}
          >
            <Statistic
              title="Total"
              value={8482}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            title="ขยะที่ยังไม่กำจัด"
            bordered={false}
            extra={<ArrowDownOutlined />}
          >
            <Statistic
              title="Total"
              value={747}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        {" "}
        {/* เพิ่มระยะห่างระหว่าง Card */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Analytics" bordered={false}>
            <Bar data={data} options={{ responsive: true }} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Daily Activities" bordered={false}>
            <Bar data={data} options={{ responsive: true }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
