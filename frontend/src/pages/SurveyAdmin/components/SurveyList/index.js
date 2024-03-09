import styles from './styles.module.css';
import { SurveyCard } from '../UI';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from '../../../../hooks/useRequest';
import { BASE_URL } from '../../../../consts';
import { useState } from 'react';

const SurveyList = ({callOn,totalUsers}) => {
 const orgId = useSelector((state) => state.auth.orgId);
 const token = useSelector((state) => state.auth.token);
  const { sendRequest } = useRequest();
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    const getSurveys = async () => {
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
                return (
                  <SurveyCard
                    key={survey.id}
                    survey={survey}
                    totalUsers={totalUsers}
                  />
                );
            })}
        </div>
    );
}
export default SurveyList;