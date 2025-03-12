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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
      setTotalWasteData(wasteData);
      setLoading(false);
    };
    loadChartData();
  }, [selectedPeriod]);

  useEffect(() => {
    const fetchProcessData = async () => {
      setLoading(true);
      try {
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

        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        let userData = {};
        usersSnapshot.forEach((doc) => {
          userData[doc.id] = doc.data().avatar;
        });

        console.log("🔥 Users Data:", userData);

        const finalData = workDayData.map((item) => ({
          ...item,
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

  const exportPDF = async () => {
    setExporting(true);
    html2canvas(dashboardRef.current, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
      pdf.save("dashboard_report.pdf");
      setExporting(false);
    });
  };

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      <ExportButton exportPDF={exportPDF} exporting={exporting} />
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
