import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./styles.module.css";

const CustomInput = ({ label, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.input_wrapper}>
      {label && <label className={styles.input_label}>{label}</label>}
      <div className={styles.input_wrapp}>
        <div className={styles.input_container}>
          {props.icon && <div className={styles.input_icon}>{props.icon}</div>}
          <input
            type={showPassword ? "text" : props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            name={props.name}
            readOnly={props.readOnly}
          />
          {props.type === "password" && (
            <div className={styles.input_icon} onClick={handleTogglePassword}>
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </div>
          )}
          {props.endIcon && (
            <div className={styles.input_icon} onClick={props.onEndIconClick}>
              {props.endIcon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomInput;
