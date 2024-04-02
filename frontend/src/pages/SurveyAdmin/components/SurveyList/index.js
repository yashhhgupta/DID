import styles from "./styles.module.css";
import { SurveyCard } from "../UI";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSurvey } from "../../../../store/suvrey-slice";
import { EmptyContainer } from "../../../../Components/common";

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
  if (status === "loading" || status === "idle") return;
  return (
    <>
      
        <div className={styles.container}>
            {surveys.length === 0 && <EmptyContainer title={"No Survey Found"}
              description="Create a new survey to see it here"
            />}
          {surveys.length > 0 &&
            surveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                totalUsers={totalUsers}
              />
            ))}
        </div>
    </>
  );
};
export default SurveyList;
