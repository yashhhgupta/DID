import styles from "./styles.module.css";
import SurveyCardEmp from "./SurveyCardEmp";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUserSurvey } from "../../../../store/suvrey-slice";
const SurveyListEmp = ({callOn=false}) => {
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const userId = useSelector((state) => state.auth.userId);
  const surveys = useSelector((state) => state.survey.survey);
  const status = useSelector((state) => state.survey.status);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getUserSurvey({
        userId: userId,
        orgId: orgId,
        token: token,
      })
    );
  }, []);
  
  return (
    <>
      {status === "loading" || status === "idle" ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.container}>
          {surveys.map((survey) => {
            return <SurveyCardEmp survey={survey} />;
          })}
        </div>
      )}
    </>
  );
};
export default SurveyListEmp;
