import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";

const EditUserModal = ({ visible, onCancel, onOk, form, loading }) => {
  return (
    <Modal
      title="แก้ไขข้อมูลผู้ใช้"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="บันทึก"
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

export default EditUserModal;
