import React, { useEffect, useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Modal,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // ✅ ไอคอนที่เหมาะสม
import { auth, db } from "../../service/firebaseDb";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./loginstyle.css"; // ✅ ใช้ CSS ใหม่

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [activeTab, setActiveTab] = useState("login"); // ✅ ควบคุม Tab ปัจจุบัน
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/index", { replace: true });
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleAuthAction = async (values, isRegister = false) => {
    setLoading(true);
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        await setDoc(doc(collection(db, "users"), userCredential.user.uid), {
          name: values.name,
          lastName: values.lastName, // ✅ บันทึกนามสกุล
          email: values.email,
          uid: userCredential.user.uid,
          role: "user",
          status: "active", // ✅ เพิ่มค่าเริ่มต้นเป็น active
          createdAt: new Date(),
        });
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      }
      message.success(
        `${isRegister ? "สมัครเข้าใช้งานเรียบร้อย" : "ยินดีต้อนรับ"} !`
      );
      navigate("/");
    } catch (error) {
      message.error(
        error.message || "มีข้อผิดพลาดเกิดขึ้น โปรดลองใหม่อีกครั้ง!"
      );
    }
    setLoading(false);
  };

  // ✅ ฟังก์ชัน Forgot Password
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      message.warning("กรุณากรอกอีเมลของคุณ");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      message.success(
        "ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ! โปรดตรวจสอบกล่องจดหมายของคุณ"
      );
      setIsModalVisible(false); // ✅ ปิด Modal หลังส่งอีเมลสำเร็จ
      setResetEmail(""); // ✅ เคลียร์ค่าอีเมลใน Input
    } catch (error) {
      message.error("เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} style={{ textAlign: "center" }}>
          ยินดีต้อนรับ
        </Title>
        <Tabs defaultActiveKey="login" centered onChange={setActiveTab}>
          <Tabs.TabPane tab="ลงชื่อเข้าใช้" key="login">
            <Form
              layout="vertical"
              onFinish={(values) => handleAuthAction(values, false)}
              className={`auth-form ${activeTab === "login" ? "scaleIn" : ""}`} // ✅ ใช้ animation scaleIn
            >
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[{ required: true, message: "กรุณากรอกอีเมล !" }]}
              >
                <Input placeholder="กรุณากรอกอีเมล" prefix={<UserOutlined />} />
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
              <Form.Item style={{ textAlign: "center" }}>
                <a
                  onClick={() => setIsModalVisible(true)}
                  style={{ color: "#249b4f", cursor: "pointer" }}
                >
                  ลืมรหัสผ่าน?
                </a>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="สมัครเข้าใช้งาน" key="register">
            <Form
              layout="vertical"
              onFinish={(values) => handleAuthAction(values, true)}
              className={`auth-form ${
                activeTab === "register" ? "scaleIn" : ""
              }`} // ✅ ใช้ animation scaleIn
            >
              <Form.Item
                label="ชื่อ"
                name="name"
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input placeholder="กรุณากรอกชื่อ" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                label="นามสกุล"
                name="lastName"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
              >
                <Input
                  placeholder="กรุณากรอกนามสกุล"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[{ required: true, message: "กรุณากรอกอีเมล !" }]}
              >
                <Input placeholder="กรุณากรอกอีเมล" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[
                  { required: true, message: "กรุณากรอกรหัสผ่าน !", min: 6 },
                ]}
              >
                <Input.Password
                  placeholder="กรุณากรอกรหัสผ่าน"
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
                  placeholder="กรุณากรอกยืนยันรหัสผ่าน"
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
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
