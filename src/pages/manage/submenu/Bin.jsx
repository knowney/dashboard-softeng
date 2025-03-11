import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import CustomTable from "../../../components/CustomTable";
import { columns } from "../table/BinTable";
import { fetchWorkDayData, deleteAllWorkDayData } from "../../../service/Bin";
import "../table/Bin.css";
import ButtonCustom from "../../../components/ButtonCustom";

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

  // ✅ ตรวจสอบรหัสผ่านและลบข้อมูลทั้งหมด
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
        <ButtonCustom
          text="ล้างข้อมูลทั้งหมด"
          type="primary"
          onClick={showDeleteModal}
        />
        <Button type="primary" icon={<ReloadOutlined />} onClick={loadData}>
          รีเฟรช
        </Button>
      </div>

      <CustomTable
        columns={columns(loadData)} // ✅ ส่งฟังก์ชัน `loadData` ไปใช้ใน `BinTable.jsx`
        data={data}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
      />

      {/* ✅ Modal ยืนยันรหัสผ่านก่อนลบข้อมูล */}
      <Modal
        title="ยืนยันการล้างข้อมูล"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>
          <b style={{ color: "red" }}>
            การดำเนินการต่อไปนี้จะล้างข้อมูลทั้งหมด !
          </b>
          กรุณากรอกรหัสผ่านเพื่อยืนยันการล้าง
        </p>
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
