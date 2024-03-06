import styles from "./styles.module.css";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { useRef } from "react";
const SurveyEmp = ({ modalCloseHandler }) => {
   const containerRef = useRef(null);
   useOutsideClick(containerRef, () => {
     modalCloseHandler();
   });
  return (
    <div className={styles.container}>
       <div ref={containerRef} className={styles.form}>
      <h1>Survey Form</h1>
    </div>
    </div>
  );
};
export default SurveyEmp;