import styles from "./styles.module.css";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { useRef,useState } from "react";
import { RatingComponent } from "react-rating-emoji";
import "react-rating-emoji/dist/index.css";
import { CustomButton } from "../../../../Components/common";
import { BASE_URL } from "../../../../consts";
import { useRequest } from "../../../../hooks/useRequest";
import Cookies from "js-cookie";
const SurveyEmp = ({ modalCloseHandler, survey }) => {
  const token = Cookies.get("token");
  const { sendRequest } = useRequest();
  const userId = Cookies.get("userId");
    const {title,description,questions} = survey;
   const containerRef = useRef(null);
   useOutsideClick(containerRef, () => {
     modalCloseHandler();
   });
  const [ratings, setRatings] = useState(new Array(questions.length).fill({
    weightage: 0,
    score:0
  }));
  const handleRating = (index, newRating,weightage) => {
    const newRatings = [...ratings];
    newRatings[index] = {
      weightage,
      score: newRating
    };
    setRatings(newRatings);
  };
  const submitHandler = async () => {
    let inclusionScore = ratings.reduce((x, y) => {
      if(y.score === 0){
        alert("Please fill all the ratings");
        return 0;
      }
      return x + y.score * y.weightage * 0.2;
    },0)
    let url = BASE_URL + "/user/fillSurvey";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        userId: userId,
        surveyId: survey._id,
        score: inclusionScore,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      alert("Survey filling failed, please try again later");
    } else {
      alert("Survey Filled Successfully");
      modalCloseHandler();
    }
  }
  const submitButtonProps = {
    type: "button",
    onClick: submitHandler,
    style: {
      width: "100%",
    },
  };
  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.form}>
        <div className={styles.surveyHeader}>
          <div>{title}</div>
          <div className={styles.subheading}>
            No. of Questions - {questions.length}
          </div>
        </div>
        {description && <div className={styles.description}>{description}</div>}
        {questions.map((question, index) => {
          const lastQuestionMarkIndex = question.text.lastIndexOf("?");
          const ques = question.text.slice(0, lastQuestionMarkIndex + 1);
          const hint = question.text.slice(lastQuestionMarkIndex + 1).trim();
          return (
            <div key={index} className={styles.questionContainer}>
              <div className={styles.question}>{ques}</div>
              {hint && <div className={styles.hint}>{hint}</div>}
              <RatingComponent
                rating={ratings[index].score}
                onClick={(newRating) => handleRating(index, newRating,question.weightage)}
              />
            </div>
          );
        })}
        <CustomButton text="Submit" buttonProps={submitButtonProps} />
      </div>
    </div>
  );
};
export default SurveyEmp;

