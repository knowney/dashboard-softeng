import React from "react";
import { Card, Col, Row, Spin, Table } from "antd";
import ProcessCol from "./ProcessCol";

const LatestRecordsTable = ({ loading, processData }) => {
  console.log("📌 Table Data:", processData); // ✅ Debug ดูข้อมูลที่เข้ามา

  return (
    <Row>
      <Col xs={24}>
        <Card
          title="📋 รายการขยะที่กำจัดล่าสุด"
          className="dashboard-card responsive-card"
        >
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
          ) : processData.length > 0 ? (
            <div className="table-responsive">
              <Table
                columns={ProcessCol()}
                dataSource={processData}
                pagination={{ pageSize: 5 }}
                bordered
                scroll={{ x: "max-content" }} // ✅ ทำให้ Table เลื่อนซ้าย-ขวาได้
              />
            </div>
          ) : (
            <p className="text-center text-red-500">❌ ไม่มีข้อมูล</p>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default LatestRecordsTable;
