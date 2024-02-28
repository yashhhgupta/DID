import styles from "./styles.module.css";
const SurveyDate = ({ surveyInfo }) => {
  const { date, month, title, supportText } = surveyInfo;
  return (
    <div className={styles.container}>
          <div className={styles.date}>
        <div className={styles.holders1}></div>
        <div className={styles.holders2}></div>
        <div className={styles.top}>{month}</div>
        <div className={styles.bottom}>{date}</div>
      </div>
      <div className={styles.text}>
        <div className={styles.supportText}>{supportText}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
};
export default SurveyDate;
