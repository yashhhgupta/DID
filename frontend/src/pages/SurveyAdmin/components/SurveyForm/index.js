import styles from "./styles.module.css";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { useRef } from "react";
import { CustomInput,CustomButton } from "../../../../Components/common";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "../../../../consts";
import { useAuth } from "../../../../context/authcontext";
import { useRequest } from "../../../../hooks/useRequest";
import Cookies from "js-cookie";

const SurveyForm = ({ modalCloseHandler }) => {
  const token = Cookies.get("token");
  const { sendRequest } = useRequest();
  const { orgId } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: Array(2).fill({
      text: "",
      weightage: undefined,
    }),
    deadline: new Date(),
  });
  
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });
  const handleQuestionChange = (index, key, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [key]: value,
    };
    setFormData({ ...formData, questions: newQuestions });
  };

  const DeleteQuestion = (index, e) => {
    e.stopPropagation();
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleDeadlineChange = (date, e) => {
    e.stopPropagation();
    setFormData({ ...formData, deadline: date });
  };

  const submitHandler = async () => {
    // console.log(formData);
    if(formData.title === "" || formData.description === ""){
      alert("Please fill all the fields");
      return;
    }
    if(formData.questions.length < 2){
      alert("Please add atleast 2 questions");
      return;
    }
    if(formData.deadline < new Date()){
      alert("Please select a valid deadline");
      return;
    }
    for(let i=0;i<formData.questions.length;i++){
      if (formData.questions[i].text === "" || formData.questions[i].weightage==="") {
        alert("Please fill all the questions ans its weightage");
        return;
      }
    }
    let cnt = 0;
    for (let i = 0; i < formData.questions.length; i++) {
      cnt += Number(formData.questions[i].weightage);
    }
    if (cnt != 100) {
      console.log(cnt);
      alert("weightage sum needs to be 100")
      return;
    }
    let url = BASE_URL + "/survey/add";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        orgId: orgId,
        deadline: formData.deadline,
        questions: formData.questions,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      alert("Invalid Credentials, Try Again");
    } else {
      alert("Survey Added Successfully");
      modalCloseHandler();
    }
  }

  const AddButtonProps = {
    type: "button",
    onClick: () => {
      setFormData({
        ...formData,
        questions: [...formData.questions, ""],
      });
    },
    style: {
      backgroundColor: "#F8F8FF",
      color: "#0359E0",
      margin: "0rem",
    },
  };
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
        <h1>Add Survey</h1>
        <CustomInput
          type="text"
          placeholder="Enter Survey Title"
          value={formData.title}
          label="Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <CustomInput
          type="text"
          placeholder="Enter Survey Description"
          value={formData.description}
          label="Description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div className={styles.questions}>
          {formData.questions.map((question, index) => {
            return (
              <div key={index} className={styles.questionContainer}>
                <div style={{ flexGrow: "1" }}>
                  <CustomInput
                    type="text"
                    placeholder="Enter question"
                    icon={<FaRegQuestionCircle />}
                    value={question.text}
                    label={`Question ${ index+ 1}`}
                    onChange={(e) =>
                      handleQuestionChange(index, "text", e.target.value)
                    }
                    endIcon={<MdDelete />}
                    onEndIconClick={(e) => DeleteQuestion(index, e)}
                  />
                </div>
                <CustomInput
                  type="number"
                  placeholder="0"
                  value={question.weightage}
                  label={"Weightage"}
                  onChange={(e) =>
                    handleQuestionChange(index, "weightage", e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
        <div className={styles.subButtons}>
          <CustomButton text="Add Question" buttonProps={AddButtonProps} />
          <div className={styles.datepicker}>
            Deadline &nbsp;
            <DatePicker
              selected={formData.deadline}
              onChange={(date, e) => handleDeadlineChange(date, e)}
            />
          </div>
        </div>
        <CustomButton text="Submit" buttonProps={submitButtonProps} />
      </div>
    </div>
  );
};
export default SurveyForm;
