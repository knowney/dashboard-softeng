import React from "react";
import { Card, Col, Row, Spin, Table } from "antd";
import ProcessCol from "./ProcessCol";

const LatestRecordsTable = ({ loading, processData }) => {
  return (
    <Row>
      <Col xs={24}>
        <Card title="📋 รายการล่าสุด" className="dashboard-card">
          {loading ? (
            <Spin tip="กำลังโหลดข้อมูล..." />
          ) : (
            <Table
              columns={ProcessCol()}
              dataSource={processData}
              pagination={{ pageSize: 5 }}
              bordered
            />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default LatestRecordsTable;
