import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "./ButtonCustom.css"; // ✅ Import CSS

// ✅ ใช้ Default Parameters แทน `defaultProps`
const ButtonCustom = ({
  text,
  onClick = () => {},
  icon = <DeleteOutlined />,
  disabled = false,
  className = "",
}) => {
  return (
    <Button
      className={`custom-button ${className}`}
      onClick={onClick}
      icon={icon}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

// ✅ กำหนด propTypes (ยังใช้ได้ตามปกติ)
ButtonCustom.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ButtonCustom;
