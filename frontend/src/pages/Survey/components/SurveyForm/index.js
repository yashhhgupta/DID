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
     questions: Array(3).fill(""), // Initial questions array with 5 empty strings
     deadline: new Date(),
   });
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleDeadlineChange = (date, e) => {
    e.stopPropagation();
    setFormData({ ...formData, deadline: date });
  };
  const DeleteQuestion = (index, e) => {
    e.stopPropagation();
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  }
  const submitHandler = async() => {
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
      if(formData.questions[i] === ""){
        alert("Please fill all the questions");
        return;
      }
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
              <CustomInput
                type="text"
                placeholder="Enter question"
                
                icon={<FaRegQuestionCircle />}
                key={index}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                endIcon={<MdDelete />}
                onEndIconClick={(e) => DeleteQuestion(index, e)}
              />
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
