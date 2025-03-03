import React, { useEffect, useState } from "react";
import { message, Modal, Form, Input, Select, Button, Card } from "antd";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import UserTable from "../../../components/CustomTable";
import {
  fetchUsers,
  deleteUser,
  updateUser,
  toggleUserStatus,
  addUser,
} from "../../../service/UserFunc";
import { userColumns } from "../table/UserTable";

const { Option } = Select;

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        message.error("โหลดข้อมูลผู้ใช้ล้มเหลว!");
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  const handleToggleStatus = async (uid, currentStatus) => {
    setLoading(true);
    const newStatus = await toggleUserStatus(uid, currentStatus);
    if (newStatus) {
      message.success(`เปลี่ยนสถานะเป็น ${newStatus} แล้ว`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === uid ? { ...user, status: newStatus } : user
        )
      );
    } else {
      message.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ!");
    }
    setLoading(false);
  };

  const handleDeleteUser = async (uid) => {
    setLoading(true);
    const success = await deleteUser(uid);
    if (success) {
      message.success("ลบผู้ใช้เรียบร้อย!");
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
    } else {
      message.error("เกิดข้อผิดพลาดในการลบผู้ใช้!");
    }
    setLoading(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    });
    setIsModalVisible(true);
  };

  const handleSaveUser = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const success = await updateUser(selectedUser.uid, values);
      if (success) {
        message.success("อัปเดตข้อมูลสำเร็จ!");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uid === selectedUser.uid ? { ...user, ...values } : user
          )
        );
        setIsModalVisible(false);
      }
    } catch (error) {
      message.error("กรุณากรอกข้อมูลให้ถูกต้อง!");
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const values = await addForm.validateFields();
      const newUser = await addUser({ ...values, status: "active" });
      if (newUser) {
        message.success("เพิ่มผู้ใช้สำเร็จ!");
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setIsAddModalVisible(false);
        addForm.resetFields();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้!");
    }
    setLoading(false);
  };

  return (
    <>
      {/* ✅ ตารางแสดงผู้ใช้ */}
      <UserTable
        columns={userColumns(
          handleEditUser,
          handleDeleteUser,
          handleToggleStatus,
          pagination
        )}
        data={users}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        extraContent={
          // ✅ ปุ่มอยู่ขวาสุดจริงๆ
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsAddModalVisible(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            เพิ่มผู้ใช้งาน
          </Button>
        }
      />

      {/* ✅ Modal แก้ไขข้อมูลผู้ใช้ */}
      <Modal
        title="แก้ไขข้อมูลผู้ใช้"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveUser}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ชื่อ" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="นามสกุล"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="บทบาท" name="role" rules={[{ required: true }]}>
            <Select>
              <Option value="user">ผู้ใช้</Option>
              <Option value="admin">แอดมิน</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* ✅ Modal เพิ่มผู้ใช้ */}
      <Modal
        title="เพิ่มผู้ใช้"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddUser}
        okText="เพิ่ม"
        cancelText="ยกเลิก"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item label="ชื่อ" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="นามสกุล"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="อีเมล"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default User;
