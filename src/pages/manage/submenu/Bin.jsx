import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import CustomTable from "../../../components/CustomTable";
import { columns } from "../table/BinTable";
import { fetchWorkDayData, deleteAllWorkDayData } from "../../../service/Bin"; // ✅ Import ฟังก์ชันลบ
import "../table/Bin.css"; // ✅ Import ไฟล์ CSS ที่ปรับปรุง

const Bin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  // ✅ โหลดข้อมูล
  const loadData = async () => {
    setLoading(true);
    const fetchedData = await fetchWorkDayData();
    setData(fetchedData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ แสดง Modal ให้กรอกรหัสผ่านก่อนลบ
  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  // ✅ ซ่อน Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setPassword("");
  };

  // ✅ ตรวจสอบรหัสผ่านและลบข้อมูล
  const handleDelete = async () => {
    const correctPassword = "00000"; // ✅ รหัสผ่านที่กำหนด
    if (password === correctPassword) {
      setLoading(true);
      const isDeleted = await deleteAllWorkDayData();
      if (isDeleted) {
        message.success("ล้างข้อมูลสำเร็จ");
        loadData(); // โหลดข้อมูลใหม่
      } else {
        message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
      setIsModalVisible(false);
      setPassword("");
    } else {
      message.error("รหัสผ่านไม่ถูกต้อง!");
    }
  };

  return (
    <div className="bin-container">
      {/* ✅ ปรับปุ่มให้อยู่ในแถวเดียวกัน และรองรับ Responsive */}
      <div className="bin-buttons">
        <Button type="primary" icon={<ReloadOutlined />} onClick={loadData}>
          รีเฟรช
        </Button>
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          className="delete-button"
          onClick={showDeleteModal}
        >
          ล้างข้อมูลทั้งหมด
        </Button>
      </div>

      <CustomTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
      />

      {/* ✅ Modal ยืนยันรหัสผ่านก่อนลบข้อมูล */}
      <Modal
        title="ยืนยันการล้างข้อมูล"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>กรุณากรอกรหัสผ่านเพื่อยืนยันการลบข้อมูลทั้งหมด:</p>
        <Input.Password
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Bin;
