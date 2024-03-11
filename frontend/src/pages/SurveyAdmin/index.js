import styles from "./styles.module.css";
import { Surveylist,SurveyDashboard,SurveyForm } from "./components";
import { CustomButton,Modal } from "../../Components/common";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRequest } from "../../hooks/useRequest";
import { BASE_URL } from "../../consts";

const SurveyAdmin = () => {
  const [modal, setModal] = useState(false);
  const token = Cookies.get("token");
  const orgId = Cookies.get("orgId");
  const { sendRequest } = useRequest();
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => { 
    const getTotalUsers = async () => {
      let url = BASE_URL + `/admin/getUsersCount/${orgId}`;
      const response = await sendRequest(
        url,
        "GET",
        {},
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );
      if (!response) {
        alert("Invalid Credentials, Try Again");
      } else {
        setTotalUsers(response.count);
      }
    };
    getTotalUsers();
  }, []);
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
        <SurveyDashboard totalUsers={totalUsers} />
        <Surveylist totalUsers={totalUsers} />
      </div>
    </>
  );
};
export default SurveyAdmin;
