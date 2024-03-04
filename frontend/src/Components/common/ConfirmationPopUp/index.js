import CustomButton from "../CustomButton";
import { useState } from "react";
import styles from "./styles.module.css";
import { useRef } from "react";
import useOutsideClick from "../../../hooks/useOutsideClick";

const ConfirmationPopUp = ({
  title,
  subTitle,
  onConfirm,
  onCancel,
  modalCloseHandler,
}) => {
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });
  const buttonProps1 = {
    type: "button",
    onClick: (e) => {
      e.stopPropagation();
      onCancel();
    },
    style: { width: "100%", backgroundColor: "red" },
  };
  const buttonProps2 = {
    type: "button",
    onClick: (e) => {
      e.stopPropagation();
      onConfirm();
    },
    style: { width: "100%"},
  };


  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.popup}>
        <h2>{title}</h2>
        <p>{subTitle}</p>
        <div className={styles.buttons}>
          <CustomButton text="Cancel" buttonProps={buttonProps1} />
          <CustomButton text="Confirm" buttonProps={buttonProps2} />
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPopUp;
