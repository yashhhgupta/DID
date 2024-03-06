import styles from './styles.module.css';
import { SurveyListEmp } from './components';
const SurveyEmployee = () => {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.heading}>
            <h1>SURVEY</h1>
          </div>
            <SurveyListEmp />
          
        </div>
      </>
    );
}
export default SurveyEmployee;