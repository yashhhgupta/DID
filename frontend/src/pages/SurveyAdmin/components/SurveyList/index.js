import styles from "./styles.module.css";
import { SurveyCard } from "../UI";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSurvey, surveyActions } from "../../../../store/suvrey-slice";

const SurveyList = ({ totalUsers }) => {
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
  const surveys = useSelector((state) => state.survey.survey);
  const status = useSelector((state) => state.survey.status);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getSurvey({
        orgId: orgId,
        token: token,
      })
    );
  }, []);
  return  (
    <>
      {status === "loading" || status === "idle" ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.container}>
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              totalUsers={totalUsers}
            />
          ))}
        </div>
      )}
    </>
  );
};
export default SurveyList;
