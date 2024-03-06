import styles from "./styles.module.css";
import classNames from "classnames";
import { DateCalendar } from "../../../SurveyAdmin/components/UI/SurveyDate";
import { CustomButton } from "../../../../Components/common";
import { Modal } from "../../../../Components/common";
import SurveyEmp from "../SurveyEmp";
import { useState } from "react";

const SurveyCardEmp = ({ survey }) => {
  const { title, description, deadline, createdOn, questions } =
    survey;
  const [modal, setModal] = useState(false);
  const SurveyHandler = (e) => {
    e.stopPropagation();
    setModal(true);
  };
  const modalCloseHandler = () => {
    setModal(false);
  };
  let status;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const createdDate = new Date(createdOn);
  if (today > deadlineDate) {
    status = "ENDED";
  } else {
    status = "ACTIVE";
  }
  const buttonProps = {
    type:"button",
    onClick: (event) => { 
      SurveyHandler(event);
    },
    disabled: status === "MISSED" || status === "COMPLETED",
    style:{
      padding: "0.5rem 1rem",
      borderRadius: "5px",
    }
  }
  return (
    <>
      <Modal isOpen={modal}>
        <SurveyEmp modalCloseHandler={modalCloseHandler} />
      </Modal>
      <div className={styles.surveyCard}>
        <div className={styles.surveyHeader}>
          <div>
            {title}
            <div className={styles.questions}>
              No. of Questions - {questions.length}
            </div>
          </div>
          <div
            className={classNames(styles.status, {
              [styles.open]: status === "ACTIVE",
              [styles.closed]: status === "MISSED",
              [styles.completed]: status === "COMPLETED",
            })}
          >
            {status}
          </div>
        </div>
        <div className={styles.surveyBody}>
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.footer}>
          <div className={styles.dateContainer}>
            <h4>Valid Till </h4>
            <DateCalendar date={12} month={"Dec"} size={50} />
          </div>
          <CustomButton text={"START"} buttonProps={buttonProps} />
        </div>
      </div>
    </>
  );
};
export default SurveyCardEmp;
