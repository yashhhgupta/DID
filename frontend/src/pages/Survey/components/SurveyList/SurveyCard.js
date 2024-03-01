import styles from "./styles.module.css";
import classNames from "classnames";
import {Scoremeter } from "../UI";

import { DateCalendar } from "../UI/SurveyDate";
const SurveyCard = ({ survey }) => {
  const {
    title,
    description,
    participation,
    deadline,
    status,
    created_at,
    inclusionScore,
  } = survey;
  return (
    <div className={styles.surveyCard}>
      <div className={styles.surveyHeader}>
        {title}
        <div
          className={classNames(styles.status, {
            [styles.open]: status === "ACTIVE",
            [styles.closed]: status === "ENDED",
          })}
        >
          {status}
        </div>
      </div>
      <div className={styles.surveyBody}>
        <div className={styles.prog}>
          <Scoremeter score={inclusionScore} size={150} />
        </div>
        <div className={styles.dateContainer}>
          <DateCalendar date={12} month={"March"} size={50} />
        </div>
      </div>
      <div
        className={styles.participation}
        style={{ width: `${participation}%` }}
      >
        Participation: {participation}%
      </div>
    </div>
  );
};
export default SurveyCard;
