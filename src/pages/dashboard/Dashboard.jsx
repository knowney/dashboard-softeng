import React, { useEffect, useState } from "react";
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
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Card, Col, Row, Spin, Select } from "antd";
import {
  fetchWorkDataByPeriod,
  fetchTotalWasteData,
} from "../../pages/working/WorkFunc";
import "./Dashboard.css";

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

const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [totalWasteData, setTotalWasteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      try {
        const [data, wasteData] = await Promise.all([
          fetchWorkDataByPeriod(selectedPeriod),
          fetchTotalWasteData(),
        ]);
        setChartData(data);
        setTotalWasteData(wasteData);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
      setLoading(false);
    };
    loadChartData();
  }, [selectedPeriod]);

  // ✅ เลือก Chart ตามช่วงเวลา
  const renderChart = () => {
    if (selectedPeriod === "week" || selectedPeriod === "year") {
      return <Line data={chartData} options={{ responsive: true }} />;
    }
    return <Bar data={chartData} options={{ responsive: true }} />;
  };

  return (
    <div className="dashboard-container">
      <Row gutter={[16, 16]}>
        {/* 📌 ส่วนที่ 1: Bar/Line Chart */}
        <Col xs={24} lg={12}>
          <Card title="📊 สถิติขยะ" className="dashboard-card chart-card">
            <Select
              defaultValue="month"
              style={{ width: 200, marginBottom: 16 }}
              onChange={(value) => setSelectedPeriod(value)}
              options={[
                { value: "day", label: "📅 รายวัน" },
                { value: "week", label: "📆 รายสัปดาห์" },
                { value: "month", label: "🗓 รายเดือน" },
                { value: "year", label: "📊 รายปี" },
              ]}
            />
            {loading ? (
              <Spin tip="กำลังโหลดข้อมูล..." className="loading-spinner" />
            ) : chartData.datasets.length > 0 ? (
              <div className="chart-container">{renderChart()}</div>
            ) : (
              <p className="text-center text-red-500">ไม่มีข้อมูลที่จะแสดง</p>
            )}
          </Card>
        </Col>

        {/* 📌 ส่วนที่ 2: Doughnut Chart */}
        <Col xs={24} lg={12}>
          <Card
            title="📊 เปรียบเทียบสัดส่วนขยะ"
            className="medical-waste-card .ant-card-head"
          >
            {loading ? (
              <Spin tip="กำลังโหลดข้อมูล..." />
            ) : (
              <div className="doughnut-container">
                <Doughnut
                  className="doughnut-chart"
                  data={{
                    labels: ["ขยะมูลฝอย", "ขยะติดเชื้อ"],
                    datasets: [
                      {
                        data: [
                          totalWasteData?.solidWaste,
                          totalWasteData?.medicalWaste,
                        ],
                        backgroundColor: [
                          "rgba(52, 189, 61, 0.6)",
                          "rgba(255, 99, 132, 0.6)",
                        ],
                        borderColor: [
                          "rgb(101, 221, 32)",
                          "rgba(255, 99, 132, 1)",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 📌 ส่วนที่ 3: รายงานภาพรวม */}
      <Col xs={24}>
        <Card title="📋 รายงานภาพรวม" className="dashboard-card summary-card">
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
          ) : (
            <p>
              รายงานประจำเดือน: มีการเก็บขยะมูลฝอย{" "}
              <strong>{totalWasteData?.solidWaste} กก.</strong>
              และขยะติดเชื้อ <strong>{totalWasteData?.medicalWaste} กก.</strong>
            </p>
          )}
        </Card>
      </Col>
    </div>
  );
};

export default Dashboard;
