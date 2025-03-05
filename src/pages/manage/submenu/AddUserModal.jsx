import React from "react";
import { Modal, Form, Input, Select } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";

const AddUserModal = ({ visible, onCancel, onOk, form, loading }) => {
  return (
    <Modal
      title="เพิ่มผู้ใช้"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="เพิ่ม"
      cancelText="ยกเลิก"
      confirmLoading={loading}
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item label="ชื่อ" name="name" rules={[{ required: true }]}>
          <Input placeholder="ชื่อ" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item label="นามสกุล" name="lastName" rules={[{ required: true }]}>
          <Input placeholder="นามสกุล" />
        </Form.Item>
        <Form.Item
          label="อีเมล"
          name="email"
          rules={[
            { required: true, message: "กรุณากรอกอีเมล" },
            { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
          ]}
        >
          <Input placeholder="กรอกอีเมล" prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item
          label="รหัสผ่าน"
          name="password"
          rules={[
            { required: true, message: "กรุณากรอกรหัสผ่าน !" },
            { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
          ]}
        >
          <Input.Password
            placeholder="กรอกรหัสผ่าน"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          label="ยืนยันรหัสผ่าน"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "กรุณากรอกยืนยันรหัสผ่าน !" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน!"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="กรอกยืนยันรหัสผ่าน"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item label="บทบาท" name="role" rules={[{ required: true }]}>
          <Select placeholder="เลือกบทบาท" suffixIcon={<SettingOutlined />}>
            <Select.Option value="ผู้ใช้งาน">👤 ผู้ใช้งาน</Select.Option>
            <Select.Option value="พนักงาน">👤 พนักงาน</Select.Option>
            <Select.Option value="admin">🔧 แอดมิน</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
