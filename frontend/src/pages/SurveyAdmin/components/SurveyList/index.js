import styles from './styles.module.css';
import { SurveyCard } from '../UI';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '../../../../context/authcontext';
import { useRequest } from '../../../../hooks/useRequest';
import { BASE_URL } from '../../../../consts';
import { useState } from 'react';

const SurveyList = ({callOn}) => {
  const token = Cookies.get("token");
  const { sendRequest } = useRequest();
  const { orgId } = useAuth();
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    const getSurveys = async () => {
      console.log("called");
      let url = BASE_URL + `/survey/get/${orgId}`;
      const response = await sendRequest(
        url,
        "GET",
        {},
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );
      if (!response) {
        alert("Invalid Credentials, Try Again");
      } else {
        setSurveys(response.surveys);
      }
    };
    getSurveys();
  }, [callOn]);
    return (
        <div className={styles.container}>
            {surveys.map((survey) => {
                return <SurveyCard key={survey.id} survey={survey} />
            })}
        </div>
    );
}
export default SurveyList;