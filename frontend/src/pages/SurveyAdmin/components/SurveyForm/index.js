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
import { useRequest } from "../../../../hooks/useRequest";
import { useSelector } from "react-redux";
import { getSurvey } from "../../../../store/suvrey-slice";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const SurveyForm = ({ modalCloseHandler }) => {
  const dispatch = useDispatch();
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
  const { sendRequest } = useRequest();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: Array(2).fill({
      text: "",
      weightage: undefined,
    }),
    deadline: new Date()+1,
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
      toast.error("Please fill all the fields");
      return;
    }
    if(formData.questions.length < 2){
      toast.error("Please add atleast 2 questions");
      return;
    }
    if(formData.deadline < new Date()){
      toast.error("Please select a valid deadline");
      return;
    }
    for(let i=0;i<formData.questions.length;i++){
      if (formData.questions[i].text === "" || formData.questions[i].weightage==="") {
        toast.error("Please fill all the questions ans its weightage");
        return;
      }
    }
    let cnt = 0;
    for (let i = 0; i < formData.questions.length; i++) {
      cnt += Number(formData.questions[i].weightage);
    }
    if (cnt != 100) {
      console.log(cnt);
      toast.error("weightage sum needs to be 100")
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
      toast.error("Adding Survey Failed, Please try again.");
    } else {
      toast.success("Survey Added Successfully");
      modalCloseHandler();
      dispatch(
        getSurvey({
          orgId: orgId,
          token: token,
        })
      );
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
                    label={`Question ${index + 1}`}
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
          <CustomButton
            text="Add Question"
            buttonProps={AddButtonProps}
            icon={<FaPlus size={18} />}
          />
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
