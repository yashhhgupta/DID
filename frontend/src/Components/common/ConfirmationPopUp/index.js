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
  const cancelProps = {
    type: "button",
    onClick: (e) => {
      e.stopPropagation();
      onCancel();
    },
    style: {
      backgroundColor: "transparent",
      color: "black",
    },
  };
  const confirmProps = {
    type: "button",
    style: {
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      color: "blue",
      borderRadius: "5px",
    },
    onClick: (e) => {
      e.stopPropagation();
      onConfirm();
    },
  };


  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.popup}>
        <h2>{title}</h2>
        <p>{subTitle}</p>
        <div className={styles.buttons}>
          <CustomButton text="Cancel" buttonProps={cancelProps} />
          <CustomButton text="Confirm" buttonProps={confirmProps} />
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPopUp;
