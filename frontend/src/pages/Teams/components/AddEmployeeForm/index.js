import styles from "./styles.module.css";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { useEffect, useRef } from "react";
import CsvUpload from "./CsvUpload";
import Form from "./Form";
import { useState } from "react";

const AddEmployeForm = ({ modalCloseHandler }) => {
  const [formType, setFormType] = useState(true);
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });

  return (
    <>
      <div className={styles.container}>
        <div ref={containerRef} className={styles.form}>
          {formType ? <Form /> : <CsvUpload closeModal={modalCloseHandler} />}
          <div
            className={styles.multiEmp}
            onClick={() => {
              setFormType(!formType);
            }}
          >
            Add {formType ? "Multiple" : "an"} Employee
          </div>
        </div>
      </div>
    </>
  );
};
export default AddEmployeForm;
