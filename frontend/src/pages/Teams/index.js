import styles from "./styles.module.css";
import { CustomButton } from "../../Components/common";
import { useState } from "react";
import { Modal } from "../../Components/common";
import AddEmployeForm from "./components/AddEmployeeForm";

const Teams = () => {
  const [modal, setModal] = useState(false);
  const AddEmployeeHandler = (e) => {
    e.stopPropagation();
    setModal(true);
  };
  const modalCloseHandler = () => {
    setModal(false);
  };
  const buttonProps = {
    type: "button",
    onClick: AddEmployeeHandler,
  };
  return (
    <>
      <Modal isOpen={modal}>
        <AddEmployeForm modalCloseHandler={modalCloseHandler} />
      </Modal>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>TEAMS</h1>
          <div className={styles.buttons}>
            <CustomButton text="Create Team" />{" "}
            <CustomButton text="Add Employee" buttonProps={buttonProps} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Teams;
