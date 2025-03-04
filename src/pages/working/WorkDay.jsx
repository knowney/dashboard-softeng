import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Card,
  message,
} from "antd";
import { addWorkData } from "./WorkFunc";
import {
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { auth, db } from "../../service/firebaseDb"; // Firebase
import { doc, getDoc } from "firebase/firestore"; // ✅ ควรมีแค่ doc และ getDoc

const WorkDay = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // ✅ เก็บ role ของผู้ใช้

  useEffect(() => {
    const getMe = async () => {
      try {
        const user = auth.currentUser;
        console.log("🔥 Current User:", user); // ✅ Debug User Data

        if (!user) {
          console.warn("⚠️ No authenticated user found!");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          console.log("📄 Fetched User Document:", userDoc.data()); // ✅ Debug User Firestore Data
          setUserName(userDoc.data().name);
          setUserRole(userDoc.data().role);
          form.setFieldsValue({ workBy: userDoc.data().name }); // ✅ อัปเดตค่าลงฟอร์ม
        } else {
          console.error("❌ User document not found in Firestore!");
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    getMe();
  }, [form]);

  // ✅ Debug ค่าของ UserName และ Role
  useEffect(() => {
    console.log("✅ UserName:", userName);
    console.log("✅ UserRole:", userRole);
  }, [userName, userRole]);

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

      console.log("📝 Work Data before saving:", workData); // ✅ Debug ข้อมูลที่กำลังจะบันทึก

      const response = await addWorkData(workData);
      if (response.success) {
        message.success("เพิ่มข้อมูลสำเร็จ!");
        form.resetFields();
        form.setFieldsValue({
          workDate: dayjs(),
          workTime: dayjs(),
          workBy: userName, // ✅ รีเซ็ตค่าเริ่มต้นหลังจากเพิ่มข้อมูล
        });
      } else {
        message.error("เกิดข้อผิดพลาด: " + response.error);
      }
    } catch (error) {
      console.error("❌ Error adding work data:", error); // ✅ Debug Error ที่เกิดขึ้น
      message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center mt-6">
      <Card title="📋 บันทึกข้อมูลขยะ" className="w-full max-w-md shadow-lg">
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
          {/* วันที่และเวลา */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="📅 วันที่" name="workDate">
              <DatePicker
                className="w-full"
                format="DD MMM YYYY"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>

            <Form.Item label="⏰ เวลา" name="workTime">
              <TimePicker
                className="w-full"
                format="HH:mm"
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
          </div>

          {/* พนักงาน และ หน่วยงาน */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="👷‍♂️ เก็บโดย" name="workBy">
              <Input value={userName} readOnly prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              label="🏢 หน่วยงาน"
              name="workFrom"
              rules={[{ required: true, message: "กรุณากรอกหน่วยงาน" }]}
            >
              <Input placeholder="หน่วยงาน" prefix={<EnvironmentOutlined />} />
            </Form.Item>
          </div>

          {/* ปริมาณขยะ */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="🗑 ขยะมูลฝอย (กก.)"
              name="solidWaste"
              rules={[{ required: true, message: "กรุณากรอกปริมาณขยะมูลฝอย" }]}
            >
              <Input type="number" placeholder="0.0" min="0" step="0.1" />
            </Form.Item>

            <Form.Item
              label="⚠️ ขยะติดเชื้อ (กก.)"
              name="medicalWaste"
              rules={[
                { required: true, message: "กรุณากรอกปริมาณขยะติดเชื้อ" },
              ]}
            >
              <Input type="number" placeholder="0.0" min="0" step="0.1" />
            </Form.Item>
          </div>

          {/* หมายเหตุ */}
          <Form.Item label="📝 หมายเหตุ" name="note">
            <Input.TextArea placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            ✅ เพิ่มข้อมูล
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default WorkDay;
