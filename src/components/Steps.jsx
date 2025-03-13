import React from "react";
import { Card, Row, Col, Button } from "antd";
import { Recycle, Gift, Package } from "lucide-react"; // ใช้ lucide-react สำหรับไอคอน

const steps = [
  {
    icon: <Recycle size={48} color="#2E7D32" />, // ไอคอนขยะรีไซเคิล
    title: "1. แยก",
    description: "คัดแยกขยะรีไซเคิลของคุณตามประเภท",
    buttonText: "ประเภทขยะรีไซเคิล",
  },
  {
    icon: <Package size={48} color="#2E7D32" />, // ไอคอนกล่อง
    title: "2. แลก",
    description: "บริจาคขยะรีไซเคิลของคุณผ่านบริการอัพไซเคิล",
    buttonText: "ดูวิธีการส่ง",
  },
  {
    icon: <Gift size={48} color="#2E7D32" />, // ไอคอนของรางวัล
    title: "3. ลด",
    description: "ลดปริมาณขยะ ทำให้สังคมน่าอยู่มากยิ่งขึ้น",
    buttonText: "ดูรายละเอียด",
  },
];

const StepsSection = () => (
  <div style={{ textAlign: "center", padding: "40px 20px" }}>
    <h2 style={{ color: "#2E7D32", fontSize: "32px", fontWeight: "bold" }}>
      ขั้นตอน
    </h2>
    <div
      style={{
        width: "50px",
        height: "3px",
        background: "#FFEB3B",
        margin: "10px auto",
      }}
    ></div>

    <Row gutter={[16, 16]} justify="center">
      {steps.map((step, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{
              width: "100%",
              textAlign: "center",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              border: "none", // ลบเส้นขอบออกให้ดูสะอาดตา
            }}
          >
            <div>{step.icon}</div> {/* ไอคอนด้านบน */}
            <h3 style={{ color: "#2E7D32", marginTop: "16px" }}>
              {step.title}
            </h3>
            <p style={{ color: "#333", fontSize: "14px", minHeight: "60px" }}>
              {step.description}
            </p>
            {/* <Button
              type="primary"
              size="large"
              style={{
                background: "#FFEB3B",
                color: "#000",
                border: "none",
                fontWeight: "bold",
              }}
            >
              {step.buttonText}
            </Button> */}
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default StepsSection;
