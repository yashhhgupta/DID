import styles from "./styles.module.css";
import classNames from "classnames";
import { DateCalendar } from "../../../SurveyAdmin/components/UI/SurveyDate";
import { CustomButton } from "../../../../Components/common";
import { Modal } from "../../../../Components/common";
import SurveyEmp from "../SurveyEmp";
import { useState } from "react";

const SurveyCardEmp = ({ survey }) => {
  const { title, description, deadline, createdOn, questions,score } =
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
  if (score) {
    status = "COMPLETED";
  }
  else if (today > deadlineDate) {
    status = "MISSED";
  } else {
    status = "ACTIVE";
  }
  const createdOnDate = createdDate.getDate();
  const deadlineDateDate = deadlineDate.getDate();
  const deadlineDateMonth = getMonthInWords(deadlineDate);
  const createdOnDateMonth = getMonthInWords(createdDate);
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
        <SurveyEmp modalCloseHandler={modalCloseHandler} survey={survey} />
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
            <DateCalendar
              date={deadlineDateDate}
              month={deadlineDateMonth}
              size={50}
            />
          </div>
          {status === "COMPLETED" && (
            <div className={styles.score}>
              <h4>Score</h4>
              <div>{score}</div>
            </div>
          )}
          <CustomButton text={"START"} buttonProps={buttonProps} />
        </div>
      </div>
    </>
  );
};
function getMonthInWords(jsDate) {
  if (!(jsDate instanceof Date) || isNaN(jsDate)) {
    throw new Error("Invalid Date object");
  }

  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = jsDate.getMonth();

  return monthNames[monthIndex];
}
export default SurveyCardEmp;
