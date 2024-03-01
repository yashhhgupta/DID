import { Graph, CircularProgr, SurveyDate, Scoremeter } from "../UI";
import styles from "./styles.module.css";

const SurveyDashboard = () => {
  const percentage = 80;
  const surveyDate = [
    {
      date: "22",
      month: "August",
      title: "Survey 1",
      supportText: "Next Survey",
    },
    {
      date: "16",
      month: "March",
      title: "Survey 4",
      supportText: "Current Survey Deadline",
    },
  ];
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardTop}>
        <div className={styles.graph}>
          <Graph />
        </div>
        <div className={styles.currentScore}>
          {/* <CircularProgr percentage={percentage} /> */}
          <Scoremeter score={percentage} size={250} />
          <div className={styles.participation1}>
            <div
              className={styles.participation2}
              style={{ width: `${percentage}%` }}
            >
              Participation: {percentage}%
            </div>
          </div>
        </div>
        <div className={styles.dates}>
          <SurveyDate surveyInfo={surveyDate[1]} />
          <SurveyDate surveyInfo={surveyDate[0]} />
        </div>
      </div>
      <div className={styles.dashboardBottom}>
        <div>Last 5 surveys</div>
        <div>Inclusion score</div>
        <div>dfnsdjl kjdfsj</div>
      </div>
    </div>
  );
};
export default SurveyDashboard;
