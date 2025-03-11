import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, Modal, Row, Col, Card, Result } from "antd";
import {
  UserOutlined,
  MailOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  FontColorsOutlined,
} from "@ant-design/icons";
import "./Setting.css"; // ✅ Import CSS
import {
  fetchUserData,
  updateUserProfile,
  handleInputChange,
  handleSelectAvatar,
  avatarOptions,
} from "./SettingFunctions"; // ✅ Import ฟังก์ชันที่แยกออกมา

const Setting = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    avatar: avatarOptions[0], // ✅ ค่าเริ่มต้นเป็น Open Peeps
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // ✅ Modal สำหรับแสดงผลหลังจากบันทึกข้อมูล

  useEffect(() => {
    // ✅ ปิด Scroll เมื่อลงหน้า Setting
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const unsubscribe = fetchUserData(setUser, setFormData);
    return () => unsubscribe();
  }, []);

  return (
    <div className="setting-container">
      <Card className="setting-card">
        {/* ✅ Avatar Profile (Center) */}
        <div className="avatar-container">
          <Avatar
            size={120}
            src={formData.avatar}
            onClick={() => setIsModalOpen(true)}
          />
          <p className="change-avatar" onClick={() => setIsModalOpen(true)}>
            เปลี่ยน Avatar
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          ตั้งค่าโปรไฟล์
        </h2>

        {/* ✅ ชื่อ-นามสกุล (Row เดียวกัน) */}
        <Row gutter={16}>
          <Col span={12}>
            <label className="label">ชื่อ</label>
            <Input
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
              placeholder="ชื่อ"
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={12}>
            <label className="label">นามสกุล</label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
              placeholder="นามสกุล"
              prefix={<FontColorsOutlined />}
            />
          </Col>
        </Row>

        {/* ✅ อีเมล */}
        <div className="mt-4">
          <label className="label">อีเมล</label>
          <Input
            name="email"
            value={formData.email}
            disabled
            prefix={<MailOutlined />}
          />
        </div>

        {/* ✅ ปุ่มบันทึก */}
        <Button
          type="primary"
          onClick={() =>
            updateUserProfile(user, formData, setIsSuccessModalOpen)
          }
          className="save-btn"
          icon={<SaveOutlined />}
        >
          บันทึกการเปลี่ยนแปลง
        </Button>
      </Card>

      {/* ✅ Modal สำหรับเลือก Avatar */}
      <Modal
        title="เลือก Avatar"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="grid grid-cols-3 gap-4 p-4">
          {avatarOptions.map((avatar, index) => (
            <Avatar
              key={index}
              size={80}
              src={avatar}
              className={`cursor-pointer border-2 transition-all ${
                formData.avatar === avatar
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() =>
                handleSelectAvatar(
                  avatar,
                  formData,
                  setFormData,
                  setIsModalOpen
                )
              }
            />
          ))}
        </div>
      </Modal>

      {/* ✅ Result Modal แจ้งเตือนหลังจากบันทึกข้อมูล */}
      <Modal open={isSuccessModalOpen} footer={null} closable={false} centered>
        <Result
          status="success"
          title="บันทึกการเปลี่ยนแปลงของคุณแล้ว"
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        />
      </Modal>
    </div>
  );
};

export default Setting;
