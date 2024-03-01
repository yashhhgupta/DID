import styles from "./styles.module.css";
import SurveyDashboard from "./components/SurveyDashboard";
import Surveylist from "./components/SurveyList";

const Survey = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>SURVEY</h1>
      </div>
      <SurveyDashboard/>
      <Surveylist/>
      
    </div>
  );
};
export default Survey;
