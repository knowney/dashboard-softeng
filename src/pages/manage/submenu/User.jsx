import React, { useEffect, useState } from "react";
import { message, Modal, Form, Input, Select, Button } from "antd";
import {
  UserAddOutlined,
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import UserTable from "../../../components/CustomTable";
import {
  fetchUsers,
  deleteUser,
  updateUser,
  toggleUserStatus,
} from "../../../service/UserFunc";
import { userColumns } from "../table/UserTable";
import { Timestamp, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; // ✅ ใช้ Firebase Auth ถ้าต้องการเก็บรหัสผ่าน
import { db, auth } from "../../../service/firebaseDb"; // ✅ ตรวจสอบว่า import db และ auth ถูกต้อง

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
    let isMounted = true; // ตรวจสอบว่า component ยังอยู่

    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        if (isMounted) {
          message.error("โหลดข้อมูลผู้ใช้ล้มเหลว!");
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    loadUsers();

    return () => {
      isMounted = false; // Cleanup function ป้องกัน state update หลัง component unmount
    };
  }, []);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsAddModalVisible(false);
    form.resetFields();
    addForm.resetFields();
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

  const handleToggleStatus = async (uid, currentStatus) => {
    try {
      console.log(
        `🔄 กำลังเปลี่ยนสถานะของ UID: ${uid}, สถานะเดิม: ${currentStatus}`
      );

      // ✅ เรียกใช้ toggleUserStatus จาก UserFunc.js
      const newStatus = await toggleUserStatus(uid, currentStatus);

      if (newStatus) {
        // ✅ อัปเดต UI ทันที โดยใช้ setUsers()
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uid === uid ? { ...user, status: newStatus } : user
          )
        );

        message.success(`เปลี่ยนสถานะเป็น ${newStatus} สำเร็จ!`);
        console.log(`✅ เปลี่ยนสถานะของผู้ใช้ ${uid} เป็น: ${newStatus}`);
      } else {
        throw new Error("เกิดข้อผิดพลาดในการอัปเดต Firestore");
      }
    } catch (error) {
      console.error("❌ เปลี่ยนสถานะล้มเหลว:", error);
      message.error("ไม่สามารถเปลี่ยนสถานะได้!");
    }
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
        handleModalClose();
      }
    } catch (error) {
      message.error("กรุณากรอกข้อมูลให้ถูกต้อง!");
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    try {
      const values = await addForm.validateFields();
      setLoading(true); // เปิด loading ก่อนทำงานสำคัญ

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const newUserId = userCredential.user.uid;

      const newUser = {
        uid: newUserId,
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        status: "active",
        createdAt: Timestamp.fromDate(new Date()),
      };

      await setDoc(doc(db, "users", newUserId), newUser);

      message.success("เพิ่มผู้ใช้สำเร็จ!");
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:", error);
      message.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ กรุณาลองอีกครั้ง!");
    } finally {
      setLoading(false); // ปิด loading หลังจากทุกอย่างเสร็จ
    }
  };

  const roles = [
    { value: "user", label: "👤 ผู้ใช้" },
    { value: "admin", label: "🔧 แอดมิน" },
  ];
  const handleDeleteUser = async (uid) => {
    setLoading(true);
    try {
      const success = await deleteUser(uid);
      if (success) {
        message.success("ลบผู้ใช้สำเร็จ!");

        // ✅ อัปเดต state users โดยลบ user ที่ถูกลบออก
        setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
      } else {
        message.error("ไม่สามารถลบผู้ใช้ได้!");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบผู้ใช้!");
    }
    setLoading(false);
  };

  return (
    <>
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
        onCancel={handleModalClose}
        onOk={handleSaveUser}
        okText="บันทึก"
        cancelText="ยกเลิก"
        confirmLoading={loading}
        centered
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item label="ชื่อ - นามสกุล">
            <Input.Group compact>
              <Form.Item
                name="name"
                noStyle
                rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
              >
                <Input
                  placeholder="ชื่อ"
                  style={{ width: "50%" }}
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item
                name="lastName"
                noStyle
                rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
              >
                <Input placeholder="นามสกุล" style={{ width: "50%" }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="บทบาท"
            name="role"
            rules={[{ required: true, message: "กรุณาเลือกบทบาท" }]}
          >
            <Select placeholder="เลือกบทบาท" suffixIcon={<SettingOutlined />}>
              {roles.map((role) => (
                <Select.Option key={role.value} value={role.value}>
                  {role.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* ✅ Modal เพิ่มผู้ใช้ */}
      <Modal
        title="เพิ่มผู้ใช้"
        open={isAddModalVisible}
        onCancel={handleModalClose}
        onOk={handleAddUser}
        okText="เพิ่ม"
        cancelText="ยกเลิก"
        centered
      >
        <Form
          form={addForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          {/* ✅ ชื่อ - นามสกุล (รวมเป็นบรรทัดเดียว) */}
          <Form.Item label="ชื่อ - นามสกุล">
            <Input.Group compact>
              <Form.Item
                name="name"
                noStyle
                rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
              >
                <Input
                  placeholder="ชื่อ"
                  style={{ width: "50%" }}
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item
                name="lastName"
                noStyle
                rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
              >
                <Input placeholder="นามสกุล" style={{ width: "50%" }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          {/* ✅ อีเมล */}
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

          {/* ✅ รหัสผ่าน */}
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

          {/* ✅ ยืนยันรหัสผ่าน */}
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

          {/* ✅ เลือกบทบาท */}
          <Form.Item
            label="บทบาท"
            name="role"
            rules={[{ required: true, message: "กรุณาเลือกบทบาท" }]}
          >
            <Select placeholder="เลือกบทบาท" suffixIcon={<SettingOutlined />}>
              <Select.Option value="user">👤 ผู้ใช้</Select.Option>
              <Select.Option value="admin">🔧 แอดมิน</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default User;
