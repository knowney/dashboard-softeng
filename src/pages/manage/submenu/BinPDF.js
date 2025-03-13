import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { sarabunNormal, sarabunBold } from "../../dashboard/SarabunBase64";

const BinPDF = async (workData) => {
  const doc = new jsPDF("p", "mm", "a4");

  try {
    // ✅ ตรวจสอบฟอนต์
    if (!sarabunNormal || !sarabunBold) {
      throw new Error("❌ ฟอนต์ Base64 ไม่ถูกต้อง");
    }

    // ✅ ฝังฟอนต์ภาษาไทย
    doc.addFileToVFS("Sarabun-Regular.ttf", sarabunNormal);
    doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
    doc.addFileToVFS("Sarabun-Bold.ttf", sarabunBold);
    doc.addFont("Sarabun-Bold.ttf", "Sarabun", "bold");
    doc.setFont("Sarabun");

    // ✅ หัวข้อเอกสาร
    doc.setFontSize(18);
    doc.text("รายงานข้อมูลการกำจัดขยะทั้งหมด", 105, 20, { align: "center" });

    // ✅ ฟังก์ชันแปลงวันที่ (รองรับ Firestore Timestamp)
    const formatDate = (workDate) => {
      if (!workDate) return "ไม่ระบุ";
      let date;
      if (workDate.toDate) {
        date = workDate.toDate(); // ✅ Firestore Timestamp
      } else {
        date = new Date(workDate); // ✅ กรณีเป็น string หรือ Date
      }
      if (isNaN(date.getTime())) return "ไม่ถูกต้อง";
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    // ✅ เรียงข้อมูลตามวันที่เก่าสุด -> ล่าสุด
    const sortedData = workData.sort((a, b) => {
      const dateA = a.workDate?.toDate
        ? a.workDate.toDate()
        : new Date(a.workDate);
      const dateB = b.workDate?.toDate
        ? b.workDate.toDate()
        : new Date(b.workDate);
      return dateA - dateB; // ✅ เรียงจากเก่าสุด -> ล่าสุด
    });

    // ✅ แปลงข้อมูลให้อยู่ในรูปแบบตาราง
    const data = sortedData.map((item) => [
      item.workBy || "ไม่ระบุ",
      item.workFrom || "ไม่ระบุ",
      formatDate(item.workDate),
      item.solidWaste ? `${item.solidWaste} ตัน` : "0",
      item.medicalWaste ? `${item.medicalWaste} ตัน` : "0",
    ]);

    // ✅ เพิ่มตารางข้อมูล
    autoTable(doc, {
      startY: 30,
      head: [
        ["พนักงาน", "หน่วยงาน", "วันที่ทำงาน", "ขยะมูลฝอย", "ขยะติดเชื้อ"],
      ],
      body: data,
      theme: "striped",
      styles: { font: "Sarabun", fontSize: 12 },
      headStyles: {
        fillColor: [0, 128, 255],
        textColor: [255, 255, 255],
        fontSize: 14,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawPage: function () {
        let pageSize = doc.internal.pageSize;
        let pageHeight = pageSize.height;
        doc.setFontSize(10);
        doc.text(
          `หน้าที่ ${doc.internal.getNumberOfPages()}`,
          pageSize.width - 30,
          pageHeight - 10
        );
      },
    });

    // ✅ ดาวน์โหลด PDF
    doc.save("workday_report.pdf");
  } catch (error) {
    console.error("❌ Export PDF Error:", error);
  }
};

export default BinPDF;
