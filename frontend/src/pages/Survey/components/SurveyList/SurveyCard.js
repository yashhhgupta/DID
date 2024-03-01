import styles from "./styles.module.css";
import classNames from "classnames";
import { Scoremeter } from "../UI";

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
        <div className={styles.description}>{description}</div>
        <div className={styles.prog}>
          <Scoremeter score={inclusionScore} size={150} />
          <div>Inclusion Score </div>
        </div>
      </div>
      <div className={styles.dateeee}>
        <div className={styles.dateContainer}>
          <h4>Creation Date  </h4>
          <DateCalendar date={12} month={"March"} size={50} />
        </div>
        <div className={styles.dateContainer}>
          <h4>Valid Till </h4>

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
