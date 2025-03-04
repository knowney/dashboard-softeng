import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "antd";
import { fetchWorkDataByPeriod } from "../../pages/working/WorkFunc"; // ดึงข้อมูลจาก Firestore

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
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  }); // ✅ กำหนดค่าเริ่มต้นที่มีโครงสร้างถูกต้อง
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkDataByPeriod("month"); // ดึงข้อมูลของเดือนนี้
        console.log("🔥 Data fetched:", data); // ✅ Debugging: เช็คโครงสร้างข้อมูล
        if (data && data.labels && data.datasets) {
          setChartData(data);
        } else {
          console.error("🚨 Data format invalid:", data);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
      setLoading(false);
    };
    loadChartData();
  }, []);

  return (
    <div className="flex justify-center mt-6">
      <Card title="📊 สถิติขยะรายเดือน" className="w-full max-w-lg shadow-lg">
        {loading ? (
          <p className="text-center">กำลังโหลดข้อมูล...</p>
        ) : chartData.datasets.length > 0 ? ( // ✅ เช็คว่ามีข้อมูลก่อนแสดง Bar Chart
          <Bar data={chartData} options={{ responsive: true }} />
        ) : (
          <p className="text-center text-red-500">ไม่มีข้อมูลที่จะแสดง</p> // แสดงข้อความเมื่อไม่มีข้อมูล
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
