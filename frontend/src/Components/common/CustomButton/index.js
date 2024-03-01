import React from "react";
import styles from "./styles.module.css"
const CustomButton = (props) => {
  const { buttonProps, text } = props;
  return <button {...buttonProps} className={styles.button}>{text}</button>;
};

export default CustomButton;
