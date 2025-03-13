import React from "react";
import { Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

const ExportButton = ({ exporting, onExport }) => {
  return (
    <Button
      type="primary"
      icon={<FilePdfOutlined />}
      className="export-button"
      onClick={onExport} // ✅ ใช้ฟังก์ชัน export ที่รับมา
      loading={exporting}
    >
      ส่งออกข้อมูลผลสรุป
    </Button>
  );
};

export default ExportButton;
