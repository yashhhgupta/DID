import SurveyCard from "./components/SurveyCard";
import styles from "./styles.module.css";
import Graph from "./components/Graph";
import CircularProgr from "./components/CircluarProg";
import SurveyDate from "./components/SurveyDate";

const DUMMY_DATA = [
  {
    id: "1",
    title: "Survey 1",
    description: "This is the first survey",
    participation: "50%",
    deadline: "2021-12-31",
    status: "active",
    created_at: "2021-10-10",
    inclusionScore: "80",
  },
];
const percentage = 80;
const surveyDate = [
    {
        date: "22",
        month: "August",
        title: "Survey 1",
        supportText: "Next Survey"
    },
    {
        date: "16",
        month: "March",
        title: "Survey 4",
        supportText: "Current Survey Deadline"
    }
]

const Survey = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>SURVEY</h1>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.dashboardTop}>
          <div className={styles.graph}>
            <Graph />
          </div>
          <div className={styles.currentScore}>
            <div className={styles.progress}>
              <CircularProgr percentage={percentage} />
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
    </div>
  );
};
export default Survey;
