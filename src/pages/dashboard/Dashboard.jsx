import React, { useEffect, useState, useRef } from "react";
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
import { Card, Col, Row, Spin, Select, Button } from "antd";
import {
  fetchWorkDataByPeriod,
  fetchTotalWasteData,
} from "../../pages/working/WorkFunc";
import "./Dashboard.css";
import {
  DeleteOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [exporting, setExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const dashboardRef = useRef(null);

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

  const renderChart = () => {
    if (selectedPeriod === "week" || selectedPeriod === "year") {
      return <Line data={chartData} options={{ responsive: true }} />;
    }
    return <Bar data={chartData} options={{ responsive: true }} />;
  };

  const exportPDF = async () => {
    setExporting(true);
    const input = dashboardRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard_report.pdf");
      setExporting(false);
    });
  };

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      {/* ✅ ปุ่ม Export PDF */}
      <Button
        type="primary"
        icon={<FilePdfOutlined />}
        className="export-button"
        onClick={exportPDF}
        loading={exporting} // ✅ เพิ่ม Loading
      >
        Export PDF
      </Button>

      {/* 📌 รายงานภาพรวม (3 Cards) */}
      <Row gutter={[16, 16]} className="summary-row">
        <Col xs={24} sm={8}>
          <Card
            title={
              <div className="summary-title">
                <DeleteOutlined /> ขยะมูลฝอยทั้งหมด
              </div>
            }
            className="dashboard-card summary-card"
          >
            {loading ? (
              <Spin fullscreen tip="กำลังโหลดข้อมูล..." /> // ✅ ใช้ fullscreen
            ) : (
              <p className="summary-number">
                <strong>{totalWasteData?.solidWaste || 0} (ตัน)</strong>
              </p>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            title={
              <div className="summary-title">
                <MedicineBoxOutlined /> ขยะติดเชื้อทั้งหมด
              </div>
            }
            className="dashboard-card summary-card"
          >
            {loading ? (
              <Spin
                wrapperClassName="spin-container"
                tip="กำลังโหลดข้อมูล..."
              />
            ) : (
              <p className="summary-number">
                <strong>{totalWasteData?.medicalWaste || 0} (ตัน)</strong>
              </p>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            title={
              <div className="summary-title">
                <AppstoreOutlined /> รวมขยะทั้งหมด
              </div>
            }
            className="dashboard-card summary-card"
          >
            {loading ? (
              <Spin tip="กำลังโหลดข้อมูล..." />
            ) : (
              <p className="summary-number">
                <strong>
                  {(totalWasteData?.solidWaste || 0) +
                    (totalWasteData?.medicalWaste || 0)}{" "}
                  (ตัน)
                </strong>
              </p>
            )}
          </Card>
        </Col>
      </Row>

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
              <Spin tip="กำลังโหลดข้อมูล..." className="loading-spinner" />
            ) : chartData.datasets.length > 0 ? (
              <div className="chart-container">{renderChart()}</div>
            ) : (
              <p className="text-center text-red-500">ไม่มีข้อมูลที่จะแสดง</p>
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
                          "rgb(224, 56, 123)",
                          "rgb(27, 170, 160)",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    animation: { duration: 1000, easing: "easeInOutQuart" },
                  }}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
