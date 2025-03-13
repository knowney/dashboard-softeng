import React, { useState, useEffect, useRef } from "react";
import {
  fetchWorkDataByPeriod,
  fetchTotalWasteData,
} from "../../pages/working/WorkFunc";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../service/firebaseDb";
import ExportButton from "./ExportButton";
import SummaryCards from "./SummaryCards";
import ChartSection from "./ChartSection";
import LatestRecordsTable from "./LatestRecordsTable";
import exportPDF from "./exportPDF"; // ✅ เพิ่มฟังก์ชัน Export PDF
import "./Dashboard.css";
const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [totalWasteData, setTotalWasteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const dashboardRef = useRef(null);
  const [processData, setProcessData] = useState([]);

  useEffect(() => {
    const loadChartData = async () => {
      const [data, wasteData] = await Promise.all([
        fetchWorkDataByPeriod(selectedPeriod),
        fetchTotalWasteData(),
      ]);
      setChartData(data);
      setTotalWasteData(wasteData); // ✅ กำหนดค่าข้อมูลขยะทั้งหมด
      setLoading(false);
    };
    loadChartData();
  }, [selectedPeriod]);

  useEffect(() => {
    const fetchProcessData = async () => {
      setLoading(true);
      try {
        // 🔥 ดึงข้อมูล WorkDay ล่าสุด (6 รายการ)
        const workDayRef = collection(db, "WorkDay");
        const workDayQuery = query(
          workDayRef,
          orderBy("workDate", "desc"),
          orderBy("workTime", "desc"),
          limit(6)
        );
        const workDaySnapshot = await getDocs(workDayQuery);

        let workDayData = [];
        workDaySnapshot.forEach((doc) => {
          workDayData.push({ id: doc.id, ...doc.data() });
        });

        console.log("🔥 WorkDay Data:", workDayData);

        // 🔥 ดึงข้อมูล Users
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        let userData = {};
        usersSnapshot.forEach((doc) => {
          userData[doc.id] = doc.data().avatar; // ✅ Map `uid` -> `avatar`
        });

        console.log("🔥 Users Data:", userData);

        // 🔥 รวมข้อมูล WorkDay + Users
        const finalData = workDayData.map((item) => ({
          ...item,
          key: item.id,
          avatar:
            userData[item.workBy] ||
            "https://api.dicebear.com/7.x/open-peeps/svg?seed=default",
        }));

        console.log("🔥 Final Process Data:", finalData);
        setProcessData(finalData);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
      setLoading(false);
    };

    fetchProcessData();
  }, []);

  // ✅ ฟังก์ชันกด Export PDF
  const handleExport = async () => {
    if (!processData || processData.length === 0) {
      alert("⚠ ไม่มีข้อมูลให้ Export!");
      return;
    }

    setExporting(true);
    await exportPDF(processData, totalWasteData); // ✅ ส่ง totalWasteData ไปด้วย
    setExporting(false);
  };

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      <ExportButton exporting={exporting} onExport={handleExport} />
      <SummaryCards totalWasteData={totalWasteData} loading={loading} />
      <ChartSection
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        chartData={chartData}
        totalWasteData={totalWasteData}
        loading={loading}
      />
      <LatestRecordsTable loading={loading} processData={processData} />
    </div>
  );
};

export default Dashboard;
