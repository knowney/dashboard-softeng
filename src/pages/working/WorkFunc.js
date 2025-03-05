import { db } from "../../service/firebaseDb";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek); // ใช้เพื่อคำนวณสัปดาห์ ISO

// ✅ ฟังก์ชันดึงข้อมูลช่วงเวลา (วัน, สัปดาห์, เดือน, ปี)
export const fetchWorkDataByPeriod = async (period) => {
  try {
    let startDate;
    let endDate = dayjs().toDate();
    const now = dayjs();

    switch (period) {
      case "day":
        startDate = now.startOf("day").toDate();
        break;
      case "week":
        startDate = now.startOf("week").toDate();
        break;
      case "month":
        startDate = now.subtract(11, "months").startOf("month").toDate(); // ✅ ดึงข้อมูลย้อนหลัง 12 เดือน
        break;
      case "year":
        startDate = now.subtract(4, "years").startOf("year").toDate(); // ✅ ดึงข้อมูลย้อนหลัง 5 ปี
        break;
      default:
        throw new Error("Invalid period");
    }

    const q = query(
      collection(db, "WorkDay"),
      where("workDate", ">=", Timestamp.fromDate(startDate)),
      where("workDate", "<=", Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("⚠️ ไม่มีข้อมูลในช่วงเวลา:", period);
      return { labels: [], datasets: [] };
    }

    const workData = [];
    querySnapshot.forEach((doc) => {
      workData.push(doc.data());
    });

    console.log("🔥 ข้อมูลที่ดึงมา:", workData);

    // ✅ จัดกลุ่มข้อมูลตามช่วงเวลา
    let groupedData = {};
    if (period === "month") {
      groupedData = workData.reduce((acc, entry) => {
        const monthLabel = dayjs(entry.workDate.toDate()).format("MMM YYYY"); // 📅 แสดงชื่อเดือน + ปี
        if (!acc[monthLabel]) {
          acc[monthLabel] = { solidWaste: 0, medicalWaste: 0 };
        }
        acc[monthLabel].solidWaste += entry.solidWaste;
        acc[monthLabel].medicalWaste += entry.medicalWaste;
        return acc;
      }, {});
    } else if (period === "year") {
      groupedData = workData.reduce((acc, entry) => {
        const yearLabel = dayjs(entry.workDate.toDate()).format("YYYY"); // 📅 แสดงเฉพาะปี
        if (!acc[yearLabel]) {
          acc[yearLabel] = { solidWaste: 0, medicalWaste: 0 };
        }
        acc[yearLabel].solidWaste += entry.solidWaste;
        acc[yearLabel].medicalWaste += entry.medicalWaste;
        return acc;
      }, {});
    } else {
      groupedData = workData.reduce((acc, entry) => {
        const dateLabel = dayjs(entry.workDate.toDate()).format("DD MMM"); // 📅 แสดงเป็นวัน
        if (!acc[dateLabel]) {
          acc[dateLabel] = { solidWaste: 0, medicalWaste: 0 };
        }
        acc[dateLabel].solidWaste += entry.solidWaste;
        acc[dateLabel].medicalWaste += entry.medicalWaste;
        return acc;
      }, {});
    }

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
  try {
    // ✅ แปลง workDate เป็น Date (เผื่อว่ามาเป็น Timestamp)
    const workDate =
      workData.workDate instanceof Date
        ? workData.workDate
        : workData.workDate.toDate(); // กรณีที่เป็น Timestamp แล้ว

    // ✅ คำนวณค่าสัปดาห์, เดือน, ปี
    const week = dayjs(workDate).isoWeek(); // ISO Week
    const month = dayjs(workDate).month() + 1; // เดือนเริ่มจาก 0 จึงต้อง +1
    const year = dayjs(workDate).year(); // ปีปัจจุบันจากวันที่เลือก

    // ✅ เพิ่มข้อมูลเข้า Firestore
    const docRef = await addDoc(collection(db, "WorkDay"), {
      ...workData,
      workDate: Timestamp.fromDate(workDate), // ✅ เก็บเป็น Timestamp
      createdAt: Timestamp.now(), // ✅ เวลาเพิ่มข้อมูลอัตโนมัติ
      week, // ✅ เพิ่มเลขสัปดาห์
      month, // ✅ เพิ่มเลขเดือน
      year, // ✅ เพิ่มเลขปี
    });

    console.log("🔥 เพิ่มข้อมูลสำเร็จ ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error);
    return { success: false, error: error.message };
  }
};

//ดึงยอดรวมขยะมูลฝอย & ขยะติดเชื้อ
export const fetchTotalWasteData = async () => {
  try {
    const q = collection(db, "WorkDay"); // ดึงข้อมูลทั้งหมด
    const querySnapshot = await getDocs(q);

    let totalSolidWaste = 0;
    let totalMedicalWaste = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalSolidWaste += data.solidWaste || 0;
      totalMedicalWaste += data.medicalWaste || 0;
    });

    return {
      solidWaste: totalSolidWaste,
      medicalWaste: totalMedicalWaste,
    };
  } catch (error) {
    console.error("❌ Error fetching total waste data:", error);
    return { solidWaste: 0, medicalWaste: 0 };
  }
};
