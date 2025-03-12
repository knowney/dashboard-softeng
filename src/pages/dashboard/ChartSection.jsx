import React from "react";
import { Card, Col, Row, Select, Spin } from "antd";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ ลงทะเบียน Chart.js เพียงครั้งเดียว
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartSection = ({
  selectedPeriod,
  setSelectedPeriod,
  chartData,
  totalWasteData,
  loading,
}) => {
  const renderChart = () => {
    if (selectedPeriod === "week" || selectedPeriod === "year") {
      return <Line data={chartData} options={{ responsive: true }} />;
    }
    return <Bar data={chartData} options={{ responsive: true }} />;
  };

  return (
    <Row gutter={[16, 16]}>
      {/* 📌 Bar/Line Chart */}
      <Col xs={24} lg={12}>
        <Card title="📊 สถิติขยะ" className="dashboard-card chart-card">
          <Select
            value={selectedPeriod}
            style={{ width: 200, marginBottom: 16 }}
            onChange={setSelectedPeriod}
            options={[
              { value: "day", label: " รายวัน" },
              { value: "week", label: " รายสัปดาห์" },
              { value: "month", label: " รายเดือน" },
              { value: "year", label: " รายปี" },
            ]}
          />
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
          ) : (
            <div className="chart-container">{renderChart()}</div>
          )}
        </Card>
      </Col>

      {/* 📌 Doughnut Chart */}
      <Col xs={24} lg={12}>
        <Card
          title="📊 เปรียบเทียบสัดส่วนขยะทั้งหมด"
          className="dashboard-card chart-card"
        >
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
          ) : (
            <div className="doughnut-container">
              <Doughnut
                data={{
                  labels: ["ขยะมูลฝอย", "ขยะติดเชื้อ"],
                  datasets: [
                    {
                      data: [
                        totalWasteData?.solidWaste,
                        totalWasteData?.medicalWaste,
                      ],
                      backgroundColor: [
                        "rgb(224, 56, 123)",
                        "rgb(27, 170, 160)",
                      ],
                    },
                  ],
                }}
              />
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ChartSection;
