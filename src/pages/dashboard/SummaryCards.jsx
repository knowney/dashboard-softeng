import React from "react";
import { Card, Col, Row, Spin } from "antd";
import {
  DeleteOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const SummaryCards = ({ totalWasteData, loading }) => {
  return (
    <Row gutter={[16, 16]} className="summary-row">
      <Col xs={24} sm={8}>
        <Card
          title={
            <>
              <DeleteOutlined /> ขยะมูลฝอยทั้งหมด
            </>
          }
          className="dashboard-card summary-card"
        >
          {loading ? (
            <Spin fullscreen tip="กำลังโหลดข้อมูล..." />
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
            <>
              <MedicineBoxOutlined /> ขยะติดเชื้อทั้งหมด
            </>
          }
          className="dashboard-card summary-card"
        >
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
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
            <>
              <AppstoreOutlined /> รวมขยะทั้งหมด
            </>
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
  );
};

export default SummaryCards;
