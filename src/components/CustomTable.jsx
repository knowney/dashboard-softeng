import React, { useEffect, useState } from "react";
import { Table, Card, Input, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons"; // ✅ เพิ่มไอคอน
import "./Table.css";

const { Search } = Input;

const CustomTable = ({
  columns,
  data,
  loading,
  pagination,
  setPagination,
  extraContent, // ✅ รับปุ่ม "เพิ่มผู้ใช้งาน"
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchText, setSearchText] = useState("");

  // ✅ อัปเดต filteredData เมื่อ data หรือ searchText เปลี่ยน
  useEffect(() => {
    if (!searchText) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  return (
    <Card className="custom-table-container">
      {/* ✅ ส่วนหัวของ Card */}
      <div>
        {/* ✅ หัวข้อ "การจัดการผู้ใช้งาน" (ใช้ h1 + ไอคอนขนาดเหมาะสม) */}
        <div className="flex items-center gap-3 mb-4">
          {/* ✅ ปรับขนาดไอคอน */}
          <h1 className="text-3xl font-bold text-gray-700">
            <UserOutlined className="text-4xl leading-none text-gray-700" />{" "}
            การจัดการผู้ใช้งาน
          </h1>
        </div>

        {/* ✅ ค้นหาอยู่ซ้าย + ปุ่มอยู่ขวา (ไม่ให้ปุ่มเลื่อนลงมา) */}
        <div className="custom-table-header">
          {/* ✅ ช่องค้นหา */}
          <Search
            className="custom-table-search"
            placeholder="ค้นหา..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* ✅ ปุ่มอยู่ขวาสุด */}
          <div className="extra-content">{extraContent}</div>
        </div>
      </div>

      {/* ✅ เว้นระยะห่างระหว่างแถบค้นหากับตาราง */}
      <div className="mt-4">
        {loading ? (
          <Spin tip="กำลังโหลดข้อมูล..." size="large" fullscreen />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData.map((item) => ({
              ...item,
              key: item.uid || item.id, // ✅ กำหนด key ให้ Table
            }))}
            bordered
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize }),
            }}
            className="custom-table"
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
    </Card>
  );
};

export default CustomTable;
