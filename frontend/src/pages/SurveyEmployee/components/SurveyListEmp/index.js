import styles from "./styles.module.css";
import SurveyCardEmp from "./SurveyCardEmp";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUserSurvey } from "../../../../store/suvrey-slice";
import { EmptyContainer } from "../../../../Components/common";
import { Loader } from "../../../../Components/common";
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
  if (status === "loading" || status === "idle") {
    return <Loader isLoading={true} />;
  }
  return (
    <>
      
        <div className={styles.container}>
          {surveys.length === 0 && (
            <EmptyContainer
              title={"No Survey Found"}
              description="Wait for your admin to create a survey."
            />
          )}
          {surveys.length > 0 &&
            surveys.map((survey) => {
              return <SurveyCardEmp survey={survey} />;
            })}
        </div>
    </>
  );
};
export default SurveyListEmp;
