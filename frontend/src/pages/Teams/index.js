import styles from "./styles.module.css";
import { CustomButton } from "../../Components/common";
import { useState } from "react";
import { Modal } from "../../Components/common";
import { AddEmployeeForm, AddDepartmentForm } from "./components";
import { FaPlus } from "react-icons/fa";

const Teams = () => {
  const [empModal, setEmpModal] = useState(false);
  const [depModal, setDepModal] = useState(false);
  const AddEmployeeHandler = (e) => {
    e.stopPropagation();
    setEmpModal(true);
  };
  const AddDepartmentHandler = (e) => { 
    e.stopPropagation();
    setDepModal(true);
  }
  const modalCloseHandler = () => {
    setEmpModal(false);
    setDepModal(false);
  };
  const EmpbuttonProps = {
    type: "button",
    onClick: AddEmployeeHandler,
  };
  const DepbuttonProps = {
    type: "button",
    onClick: AddDepartmentHandler,
  };
  return (
    <>
      <Modal isOpen={empModal}>
        <AddEmployeeForm modalCloseHandler={modalCloseHandler} />
      </Modal>
      <Modal isOpen={depModal}>
        <AddDepartmentForm modalCloseHandler={modalCloseHandler} />
      </Modal>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>TEAMS</h1>
          <div className={styles.buttons}>
            <CustomButton text="Create Team" icon={<FaPlus size={18} />} />
            <CustomButton text="Add Departmemt" buttonProps={DepbuttonProps} />
            <CustomButton text="Add Employee" buttonProps={EmpbuttonProps} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Teams;
