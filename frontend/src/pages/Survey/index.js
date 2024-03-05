import styles from "./styles.module.css";
import SurveyDashboard from "./components/SurveyDashboard";
import Surveylist from "./components/SurveyList";
import { CustomButton } from "../../Components/common";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { Modal } from "../../Components/common";
import SurveyForm from "./components/SurveyForm";

const Survey = () => {
  const [modal, setModal] = useState(false);
  const AddSurveyHandler = (e) => {
    e.stopPropagation();
    setModal(true);
  };
  const modalCloseHandler = () => {
    setModal(false);
  };
  const buttonProps = {
    type: "button",
    onClick: AddSurveyHandler,
  };
  return (
    <>
      <Modal isOpen={modal}>
        <SurveyForm modalCloseHandler={modalCloseHandler} />
      </Modal>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>SURVEY</h1>
          <CustomButton text="CREATE SURVEY" buttonProps={buttonProps} icon={<FaPlus size={18} />} />
        </div>
        <SurveyDashboard />
        <Surveylist />
      </div>
    </>
  );
};
export default Survey;
