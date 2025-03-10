import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Card,
  message,
  Modal,
  Result,
} from "antd";
import { addWorkData } from "./WorkFunc";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { auth, db } from "../../service/firebaseDb";
import { doc, getDoc } from "firebase/firestore";
import "./WorkDay.css";

const WorkDay = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const getMe = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
          setUserRole(userDoc.data().role);
          form.setFieldsValue({ workBy: userDoc.data().name });
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    getMe();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const workData = {
        workDate: values.workDate.toDate(),
        workTime: values.workTime.format("HH:mm"),
        workBy: userName,
        workFrom: values.workFrom,
        solidWaste: parseFloat(values.solidWaste),
        medicalWaste: parseFloat(values.medicalWaste),
        note: values.note || "",
      };

      const response = await addWorkData(workData);
      if (response.success) {
        message.success("เพิ่มข้อมูลสำเร็จ!");
        form.resetFields();
        form.setFieldsValue({
          workDate: dayjs(),
          workTime: dayjs(),
          workBy: userName,
        });

        setIsModalVisible(true); // ✅ เปิด Modal แสดงผลลัพธ์

        // ✅ ปิด Modal อัตโนมัติหลัง 3.5 วินาที
        setTimeout(() => {
          setIsModalVisible(false);
        }, 3500);
      } else {
        message.error("เกิดข้อผิดพลาด: " + response.error);
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center mt-6">
      <Card title="บันทึกข้อมูลขยะ" className="w-full max-w-md shadow-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="small"
          initialValues={{
            workDate: dayjs(),
            workTime: dayjs(),
          }}
        >
          {/* ✅ ปรับ วันที่ และ เวลาให้อยู่ในแถวเดียวกัน */}
          <Form.Item label="วันที่ และ เวลา" className="date-time-container">
            <div className="date-time">
              <Form.Item name="workDate" noStyle>
                <DatePicker
                  className="w-1/2"
                  format="DD MMM YYYY"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
              <Form.Item name="workTime" noStyle>
                <TimePicker
                  className="w-1/2"
                  format="HH:mm"
                  suffixIcon={<ClockCircleOutlined />}
                />
              </Form.Item>
            </div>
          </Form.Item>

          {/* พนักงาน และ หน่วยงาน */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="พนักงาน" name="workBy">
              <Input value={userName} readOnly prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              label="หน่วยงาน"
              name="workFrom"
              rules={[{ required: true, message: "กรุณากรอกหน่วยงาน" }]}
            >
              <Input placeholder="หน่วยงาน" prefix={<HomeOutlined />} />
            </Form.Item>
          </div>

          {/* ปริมาณขยะ */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="ขยะมูลฝอย (ตัน)"
              name="solidWaste"
              rules={[{ required: true, message: "กรุณากรอกปริมาณขยะมูลฝอย" }]}
            >
              <Input
                type="number"
                placeholder="0.0"
                min="0"
                step="0.1"
                prefix={<DeleteOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="ขยะติดเชื้อ (ตัน.)"
              name="medicalWaste"
              rules={[
                { required: true, message: "กรุณากรอกปริมาณขยะติดเชื้อ" },
              ]}
            >
              <Input
                type="number"
                placeholder="0.0"
                min="0"
                step="0.1"
                prefix={<ExclamationCircleOutlined />}
              />
            </Form.Item>
          </div>

          {/* หมายเหตุ */}
          <Form.Item label="หมายเหตุ" name="note">
            <Input.TextArea placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            บันทึกผลการกำจัดขยะ
          </Button>
        </Form>
      </Card>

      {/* ✅ Modal แสดงผลลัพธ์สำเร็จ */}
      <Modal
        title="บันทึกข้อมูลสำเร็จ"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <div key="footer" style={{ textAlign: "center", width: "100%" }}>
            <Button type="primary" onClick={() => setIsModalVisible(false)}>
              ตกลง
            </Button>
          </div>,
        ]}
      >
        <Result
          status="success"
          title="บันทึกผลการกำจัดขยะสำเร็จ!"
          subTitle="ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว."
        />
      </Modal>
    </div>
  );
};

export default WorkDay;
