import styles from "./styles.module.css";
import classNames from "classnames";
import { Scoremeter } from "../UI";
import { DateCalendar } from "../UI/SurveyDate";
import { GrFormView, GrEdit } from "react-icons/gr";
import { useState } from "react";
import { Modal } from "../../../../Components/common";
import { SurveyEmp } from "../../../SurveyEmployee/components";
import SurveyForm from "../SurveyForm";
const SurveyCard = ({ survey, totalUsers }) => {
  let {
    title,
    description,
    countOfUsersFilled = 0,
    deadline,
    createdOn,
    inclusionScore,
    questions,
  } = survey;
  const [showModal, setShowModal] = useState(null);
  let participation = (countOfUsersFilled / totalUsers) * 100;
  let status;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const createdDate = new Date(createdOn);
  if (today > deadlineDate) {
    status = "ENDED";
  } else {
    status = "ACTIVE";
  }
  inclusionScore = inclusionScore.toFixed(2);
  const createdOnDate = createdDate.getDate();
  const deadlineDateDate = deadlineDate.getDate();
  const deadlineDateMonth = getMonthInWords(deadlineDate);
  const createdOnDateMonth = getMonthInWords(createdDate);
  if (participation === Infinity || isNaN(participation)) {
    participation = 0;
  } else {
    participation = participation.toFixed(2);
  }
  const modalCloseHandler = () => {
    setShowModal(null);
  }
  return (
    <>
      <Modal isOpen={showModal}>
        {showModal === "View" && (
          <SurveyEmp
            survey={survey}
            modalCloseHandler={modalCloseHandler}
            allowSubmit={false}
          />
        )}
        {showModal === "Edit" && (
          <SurveyForm survey={survey} modalCloseHandler={modalCloseHandler} />
        )}
      </Modal>
      <div className={styles.surveyCard}>
        <div className={styles.surveyHeader}>
          <div>
            {title}
            <div className={styles.questions}>
              No. of Questions - {questions.length}
            </div>
          </div>
          <div className={styles.icons}>
            {status !==
              "ENDED"&&(
                <GrEdit
                  className={styles.icon}
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal("Edit");
                  }}
                />
              )}
            <GrFormView
              className={styles.icon}
              size={28}
              onClick={(e) => {
                e.stopPropagation();
                setShowModal("View");
              }}
            />
            <div
              className={classNames(styles.status, {
                [styles.open]: status === "ACTIVE",
                [styles.closed]: status === "ENDED",
              })}
            >
              {status}
            </div>
          </div>
        </div>
        <div className={styles.surveyBody}>
          <div className={styles.description}>{description}</div>
          <div className={styles.prog}>
            <Scoremeter score={inclusionScore} size={150} />
            <div>Inclusion Score </div>
          </div>
        </div>
        <div className={styles.dateeee}>
          <div className={styles.dateContainer}>
            <h4>Creation Date </h4>
            <DateCalendar
              date={createdOnDate}
              month={createdOnDateMonth}
              size={50}
            />
          </div>
          <div className={styles.dateContainer}>
            <h4>Valid Till </h4>

            <DateCalendar
              date={deadlineDateDate}
              month={deadlineDateMonth}
              size={50}
            />
          </div>
        </div>
        <div
          className={styles.participation}
          style={{ width: `${participation}%` }}
        >
          <span>Participation: {participation}%</span>
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
export default SurveyCard;
