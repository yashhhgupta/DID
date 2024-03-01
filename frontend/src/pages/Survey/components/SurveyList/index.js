import styles from './styles.module.css';
import { SurveyCard } from '../UI';
const DUMMY_DATA = [
  {
    id: "1",
    title: "Survey 1",
    participation: "50",
    deadline: "2021-12-31",
    status: "ENDED",
    created_at: "2021-10-10",
    inclusionScore: "80",
  },
  {
    id: "2",
    title: "Survey 2",
    participation: "30",
    deadline: "2023-2-13",
    status: "ACTIVE",
    created_at: "2021-10-10",
    inclusionScore: "60",
  },
  {
    id: "2",
    title: "Survey 2",
    participation: "45",
    deadline: "2023-2-13",
    status: "ACTIVE",
    created_at: "2021-10-10",
    inclusionScore: "20",
  },
  {
    id: "2",
    title: "Survey 2",
    participation: "20",
    deadline: "2023-2-13",
    status: "ACTIVE",
    created_at: "2021-10-10",
    inclusionScore: "10",
  },
];

const SurveyList = () => {
    return (
        <div className={styles.container}>
            {DUMMY_DATA.map((survey) => {
                return <SurveyCard key={survey.id} survey={survey} />
            })}
        </div>
    );
}
export default SurveyList;