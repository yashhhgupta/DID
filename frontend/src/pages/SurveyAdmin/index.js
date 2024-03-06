import styles from "./styles.module.css";
import { Surveylist,SurveyDashboard,SurveyForm } from "./components";
import { CustomButton,Modal } from "../../Components/common";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";

const SurveyAdmin = () => {
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
          <CustomButton
            text="CREATE SURVEY"
            buttonProps={buttonProps}
            icon={<FaPlus size={18} />}
          />
        </div>
        <SurveyDashboard />
        <Surveylist callOn={modal} />
      </div>
    </>
  );
};
export default SurveyAdmin;
