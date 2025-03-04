import { db } from "../../service/firebaseDb";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import dayjs from "dayjs";

// ✅ ฟังก์ชันดึงข้อมูลช่วงเวลา (วัน, สัปดาห์, เดือน, ปี)
export const fetchWorkDataByPeriod = async (period) => {
  try {
    let startDate;
    const now = dayjs();

    // ✅ กำหนดช่วงเวลา
    switch (period) {
      case "day":
        startDate = now.startOf("day").toDate();
        break;
      case "week":
        startDate = now.startOf("week").toDate();
        break;
      case "month":
        startDate = now.startOf("month").toDate();
        break;
      case "year":
        startDate = now.startOf("year").toDate();
        break;
      default:
        throw new Error("Invalid period");
    }

    // ✅ Query ข้อมูลจาก Firestore
    const q = query(
      collection(db, "WorkDay"),
      where("workDate", ">=", Timestamp.fromDate(startDate))
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("⚠️ ไม่มีข้อมูลในช่วงเวลา:", period);
      return { labels: [], datasets: [] }; // ✅ ป้องกัน error
    }

    const workData = [];
    querySnapshot.forEach((doc) => {
      workData.push(doc.data());
    });

    console.log("🔥 ข้อมูลที่ดึงมา:", workData);

    // ✅ จัดรูปแบบข้อมูลสำหรับ ChartJS
    const groupedData = workData.reduce((acc, entry) => {
      const dateLabel = dayjs(entry.workDate.toDate()).format("DD MMM"); // กำหนดรูปแบบวันที่
      if (!acc[dateLabel]) {
        acc[dateLabel] = { solidWaste: 0, medicalWaste: 0 };
      }
      acc[dateLabel].solidWaste += entry.solidWaste;
      acc[dateLabel].medicalWaste += entry.medicalWaste;
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const solidWasteData = labels.map((date) => groupedData[date].solidWaste);
    const medicalWasteData = labels.map(
      (date) => groupedData[date].medicalWaste
    );

    return {
      labels,
      datasets: [
        {
          label: "ขยะมูลฝอย (กก.)",
          data: solidWasteData,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "ขยะติดเชื้อ (กก.)",
          data: medicalWasteData,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  } catch (error) {
    console.error("❌ Error fetching work data:", error);
    return { labels: [], datasets: [] };
  }
};

// ✅ ฟังก์ชันเพิ่มข้อมูล WorkDay ลง Firestore
export const addWorkData = async (workData) => {
  // <---- ต้องมี `export`
  try {
    const docRef = await addDoc(collection(db, "WorkDay"), {
      ...workData,
      workDate: Timestamp.fromDate(new Date(workData.workDate)), // ✅ แปลงเป็น Timestamp
      createdAt: Timestamp.now(), // ✅ เวลาที่เพิ่มข้อมูล
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error);
    return { success: false, error: error.message };
  }
};
