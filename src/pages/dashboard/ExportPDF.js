import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { sarabunNormal, sarabunBold } from "./SarabunBase64";

const exportPDF = async (processData) => {
  const doc = new jsPDF();

  try {
    // ✅ ตรวจสอบว่าฟอนต์ถูกต้อง
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
    doc.text("รายงานข้อมูลการกำจัดขยะล่าสุด", 105, 20, { align: "center" });

    // ✅ ฟังก์ชันแปลงวันที่เป็นรูปแบบ DD/MM/YYYY
    const formatDate = (workDate) => {
      if (!workDate) return "ไม่ระบุ";

      let date;

      if (workDate.toDate) {
        date = workDate.toDate(); // ✅ ถ้าเป็น Firestore Timestamp, แปลงเป็น Date
      } else {
        date = new Date(workDate); // ✅ ถ้าเป็น string หรือ date อยู่แล้ว
      }

      if (isNaN(date.getTime())) return "ไม่ถูกต้อง"; // ✅ ตรวจสอบความถูกต้องของวันที่

      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    // ✅ สร้างตารางข้อมูล
    const data = processData.map((item) => [
      item.workBy || "ไม่ระบุ",
      item.workFrom || "ไม่ระบุ",
      formatDate(item.workDate),
      item.solidWaste ? `${item.solidWaste} ตัน` : "0",
      item.medicalWaste ? `${item.medicalWaste} ตัน` : "0",
    ]);

    autoTable(doc, {
      startY: 40,
      head: [
        [
          "พนักงาน",
          "หน่วยงาน",
          "วันที่ทำงาน",
          "จำนวนขยะมูลฝอย",
          "จำนวนขยะมูลฝอย",
        ],
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
      didDrawPage: function (data) {
        let pageSize = doc.internal.pageSize;
        let pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        doc.setFontSize(10);
        doc.text(
          `หน้าที่ ${doc.internal.getNumberOfPages()}`,
          pageSize.width - 30,
          pageHeight - 10
        );
      },
    });

    // ✅ ดาวน์โหลด PDF
    doc.save("work_report.pdf");
  } catch (error) {
    console.error("❌ Export PDF Error:", error);
  }
};

export default exportPDF;
