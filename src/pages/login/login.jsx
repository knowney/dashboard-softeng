import React, { useEffect, useState } from "react";
import { Tabs, Form, Input, Button, Card, Typography, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  handleAuthAction,
  handleForgotPassword,
} from "../../service/LoginFunctions";
import { auth } from "../../service/firebaseDb";
import "./loginstyle.css";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/", { replace: true });
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} style={{ textAlign: "center" }}>
          ยินดีต้อนรับ
        </Title>
        <Tabs
          defaultActiveKey="login"
          centered
          onChange={setActiveTab}
          items={[
            {
              key: "login",
              label: "ลงชื่อเข้าใช้",
              children: (
                <Form
                  layout="vertical"
                  onFinish={(values) =>
                    handleAuthAction(values, false, navigate, setLoading)
                  }
                >
                  <Form.Item
                    label="อีเมล"
                    name="email"
                    rules={[{ required: true, message: "กรุณากรอกอีเมล !" }]}
                  >
                    <Input
                      placeholder="กรุณากรอกอีเมล"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                  <Form.Item
                    label="รหัสผ่าน"
                    name="password"
                    rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}
                  >
                    <Input.Password
                      placeholder="กรุณากรอกรหัสผ่าน"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                    >
                      ลงชื่อเข้าใช้
                    </Button>
                  </Form.Item>
                  {/* ✅ เพิ่มปุ่มลืมรหัสผ่าน */}
                  <Form.Item style={{ textAlign: "center" }}>
                    <a
                      onClick={() => setIsModalVisible(true)}
                      style={{
                        color: "#249b4f",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      ลืมรหัสผ่าน?
                    </a>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "register",
              label: "สมัครเข้าใช้งาน",
              children: (
                <Form
                  layout="vertical"
                  onFinish={(values) =>
                    handleAuthAction(values, true, navigate, setLoading)
                  }
                >
                  <Form.Item
                    label="ชื่อ"
                    name="name"
                    rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
                  >
                    <Input
                      placeholder="กรุณากรอกชื่อ"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                  <Form.Item
                    label="อีเมล"
                    name="email"
                    rules={[{ required: true, message: "กรุณากรอกอีเมล !" }]}
                  >
                    <Input
                      placeholder="กรุณากรอกอีเมล"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                  <Form.Item
                    label="รหัสผ่าน"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสผ่าน !",
                        min: 6,
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="กรุณากรอกรหัสผ่าน"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                    >
                      สมัครเข้าใช้งาน
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
        {/* Modal สำหรับรีเซ็ตรหัสผ่าน */}
        <Modal
          title="ลืมรหัสผ่าน"
          open={isModalVisible} // เปลี่ยนจาก visible เป็น open
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              ยกเลิก
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() =>
                handleForgotPassword(
                  resetEmail,
                  setIsModalVisible,
                  setResetEmail
                )
              }
            >
              รีเซ็ตรหัสผ่าน
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="กรุณากรอกอีเมลของคุณ">
              <Input
                placeholder="your@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>{" "}
        {/* ✅ เพิ่มแท็กปิด Modal ตรงนี้ */}
      </Card>
    </div>
  );
};

export default Login;
