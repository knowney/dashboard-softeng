import React, { useEffect, useState } from "react";
import { Table, Card, Input, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Table.css";

const { Search } = Input;

const CustomTable = ({
  columns,
  data,
  loading,
  pagination,
  setPagination,
  extraContent,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchText, setSearchText] = useState("");

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
      <div>
        {/* ✅ ส่วนหัวของ Card */}
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-700 flex items-center">
            <UserOutlined className="text-4xl leading-none text-gray-700" />{" "}
            <span>การบริหารและการจัดการ</span>
          </h1>
        </div>

        {/* ✅ ค้นหาอยู่ซ้าย + ปุ่มอยู่ขวา (อยู่บรรทัดเดียวกัน) */}
        <div className="custom-table-header">
          <Search
            className="custom-table-search"
            placeholder="ค้นหา..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="extra-content">{extraContent}</div>
        </div>
      </div>

      {/* ✅ เว้นระยะห่างระหว่างแถบค้นหากับตาราง */}
      <div className="mt-4 table-wrapper">
        <Spin
          spinning={loading}
          tip="กำลังโหลดข้อมูล..."
          wrapperClassName="spin-container"
        >
          <Table
            columns={columns}
            dataSource={filteredData.map((item) => ({
              ...item,
              key: item.uid || item.id,
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
            scroll={false} // ✅ ปิดการเลื่อนแนวนอน
            rowClassName={(_, index) =>
              index % 2 === 0 ? "table-row-even" : "table-row-odd"
            } // ✅ สลับสีแถว
          />
        </Spin>
      </div>
    </Card>
  );
};

export default CustomTable;
