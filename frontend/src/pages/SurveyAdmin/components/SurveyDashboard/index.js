import { Graph, SurveyDate, Scoremeter } from "../UI";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";

const SurveyDashboard = ({ totalUsers }) => {
  const dispatch = useDispatch();
  const surveys = useSelector((state) => state.survey.survey);
  const status = useSelector((state) => state.survey.status);
  if (status === "idle" || status === "loading") {
    return <div>Loading...</div>;
  }
  let averageScore =
    surveys.map((survey) => survey.inclusionScore).reduce((a, b) => a + b, 0) /
    surveys.length;
  const totalUsersFilled = surveys.reduce(
    (a, b) => a + b.countOfUsersFilled,
    0
  );
  let participation = (
    (totalUsersFilled / (totalUsers * surveys.length)) *
    100
  ).toFixed(2);
  let date = new Date();
  let activeSurvey = surveys.filter((survey) => {
    let deadlineDate = new Date(survey.deadline)
      return deadlineDate> date
  });
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
  if (participation === Infinity || isNaN(participation)) {
    participation = 0;
  }
  if (!averageScore) {
    averageScore = 0;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardTop}>
        <div className={styles.graph}>
          <Graph />
        </div>
        <div className={styles.currentScore}>
          {/* <CircularProgr percentage={percentage} /> */}
          <Scoremeter score={averageScore} size={250} />
          <div className={styles.participation1}>
            <div
              className={styles.participation2}
              style={{ width: `${participation}%` }}
            >
              Participation: {participation}%
            </div>
          </div>
        </div>
        <div className={styles.dates}>
          <SurveyDate
            surveyInfo={{
              date: activeSurvey.length,
              title: "Surveys",
              supportText: "Total Active",
              month: "Active",
            }}
          />
          <SurveyDate
            surveyInfo={{
              date: surveys.length-activeSurvey.length,
              title: "Surveys",
              supportText: "Total Completed",
              month: "Ended",
            }}
          />
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
