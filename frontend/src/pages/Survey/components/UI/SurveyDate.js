import styles from "./styles.module.css";
export const DateCalendar = ({ date, month, size }) => {
  const font = size * 3 / 100;
  const blackHolders = size * 0.1;
  return (
    <div
      className={styles.date}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className={styles.holders1}
        style={{ height: `${blackHolders}px` }}
      ></div>
      <div
        className={styles.holders2}
        style={{ height: `${blackHolders}px` }}
      ></div>
      <div className={styles.top} style={{ fontSize: `${font / 2}rem` }}>
        {month}
      </div>
      <div className={styles.bottom} style={{ fontSize: `${font}rem` }}>
        {date}
      </div>
    </div>
  );
}
const SurveyDate = ({ surveyInfo }) => {
  const { date, month, title, supportText } = surveyInfo;
  return (
    <div className={styles.container}>
      <DateCalendar date={date} month={month} size={100} />
      <div className={styles.text}>
        {supportText && <div className={styles.supportText}>{supportText}</div>}
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
};
export default SurveyDate;
