import styles from "./styles.module.css";
import SurveyCardEmp from "./SurveyCardEmp";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../../../../context/authcontext";
import { useRequest } from "../../../../hooks/useRequest";
import { BASE_URL } from "../../../../consts";
import { useState } from "react";

const SurveyListEmp = ({callOn=false}) => {
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  const { sendRequest } = useRequest();
  const { orgId } = useAuth();
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surveysResponse, userSurveysResponse] = await Promise.all([
          sendRequest(
            BASE_URL + `/survey/get/${orgId}`,
            "GET",
            {},
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            }
          ),
          sendRequest(
            BASE_URL + `/user/getSurveys/${userId}`,
            "GET",
            {},
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            }
          ),
        ]);

        if (!surveysResponse || !userSurveysResponse) {
          alert("Invalid Credentials, Try Again");
          return;
        }

        const updatedSurveys = surveysResponse.surveys.map((survey) => {
          const userSurvey = userSurveysResponse.surveys.find(
            (userSurvey) => userSurvey.surveyId === survey._id
          );
          return userSurvey
            ? {
                ...survey,
                score: userSurvey.score,
              }
            : survey;
        });

        setSurveys(updatedSurveys);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log("1", surveys);
  // console.log("2", userSurveys);
  
  return (
    <div className={styles.container}>
      {surveys.map((survey) => {
          return (
            <SurveyCardEmp survey={survey} />
        );
      })}
    </div>
  );
};
export default SurveyListEmp;
