import React from "react";
import styles from "./styles.module.css"
const CustomButton = (props) => {
  const { buttonProps, text,icon } = props;
  return <button {...buttonProps} className={styles.button}>
    {icon &&(
      icon)
    }
    {text}</button>;
};

export default CustomButton;
