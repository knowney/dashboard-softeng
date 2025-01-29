import React from "react";
import { Form, Input, Switch, Button, Card, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const Setting = () => {
  const onFinish = (values) => {
    console.log("Settings saved:", values);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Settings" bordered={false}>
        <Form
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
        >
          {/* Change Username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          {/* Change Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          {/* Dark Mode Switch */}
          <Form.Item label="Dark Mode" name="darkMode" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          {/* Email Notifications */}
          <Form.Item
            label="Email Notifications"
            name="notifications"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>

          {/* Save Button */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Setting;
