import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./styles.module.css";

const CustomInput = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className={styles.input_wrapp}>
        <div className={styles.input_container}>
          {props.icon && <div className={styles.input_icon}>{props.icon}</div>}

          <input
            type={showPassword ? "text" : props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            name={props.name}
          />
          {props.type === "password" && (
            <div className={styles.input_icon} onClick={handleTogglePassword}>
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomInput;
