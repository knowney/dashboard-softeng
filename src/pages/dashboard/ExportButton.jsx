import React from "react";
import { Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

const ExportButton = ({ exportPDF, exporting }) => {
  return (
    <Button
      type="primary"
      icon={<FilePdfOutlined />}
      className="export-button"
      onClick={exportPDF}
      loading={exporting}
    >
      Export PDF
    </Button>
  );
};

export default ExportButton;
