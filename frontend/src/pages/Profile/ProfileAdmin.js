import styles from "./styles.module.css";
import { CustomButton } from "../../Components/common";
import { OrgData } from "./components";
import { useState } from "react";
import { Modal, ConfirmationPopUp } from "../../Components/common";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../store/department-slice";
import { getTeams } from "../../store/team-slice";
import { BASE_URL } from "../../consts";
import { useRequest } from "../../hooks/useRequest";
import { getEmployees } from "../../store/employee-slice";

const ProfileAdmin = () => {
  const dispatch = useDispatch();
  const { sendRequest } = useRequest();
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
    const orgId = useSelector((state) => state.auth.orgId);
    const deps = useSelector((state) => state.department.departments);
    const teams = useSelector((state) => state.team.teams);
    const emp = useSelector((state) => state.employee.employees);
  const [primaryFormData, setPrimaryFormData] = useState({
    name: "",
    email: "",
    image: "",
    diversityGoalScore: "",
  });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(getDepartments({ orgId, token }));
      dispatch(getTeams({ orgId, token }));
      dispatch(getEmployees({ orgId, token }));
      
    const getUser = async () => {
      let url = BASE_URL + "/admin/get/" + userId;
      const response = await sendRequest(url, "GET", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });
      if (!response) {
        alert("Invalid Credentials, Try Again");
      } else {
        setPrimaryFormData({
          name: response.org.name,
          email: response.org.email,
          image:
            response.org.image ||
            "https://www.w3schools.com/howto/img_avatar.png",
          diversityGoalScore: response.org.diversityGoalScore,
        });
      }
    };
    getUser();
  }, []);
  const updateProfileData = (data) => {
    setPrimaryFormData(data);
  };
  const modalCloseHandler = () => {
    setShowModal(false);
  };
  const EditProfileHandler = async () => {
    const response = await sendRequest(
      BASE_URL + "/admin/updateProfile",
      "POST",
      JSON.stringify({
        dataToUpdate: primaryFormData,
        orgId: orgId,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      alert("Invalid Credentials, Try Again");
    } else {
      alert("Profile Updated");
      setShowModal(false);
      setPrimaryFormData({
        name: response.org.name,
        email: response.org.email,
        image: response.org.image,
        diversityGoalScore: response.org.diversityGoalScore,
      });
    }
  };
  return (
    <>
      <Modal isOpen={showModal}>
        <ConfirmationPopUp
          title="Edit Profile"
          subTitle={`Do you really want to edit the profile?`}
          onCancel={modalCloseHandler}
          onConfirm={EditProfileHandler}
          modalCloseHandler={modalCloseHandler}
        />
      </Modal>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>PROFILE</h1>
          <div className={styles.buttons}>
            <CustomButton
              text="Edit Profile"
              buttonProps={{
                type: "button",
                disabled:
                  !primaryFormData || Object.keys(primaryFormData).length === 0,
                onClick: (e) => {
                  e.stopPropagation();
                  setShowModal(true);
                },
              }}
            />
          </div>
        </div>
        <OrgData
          orgData={primaryFormData}
          updateFormData={updateProfileData}
                  dep={deps.length}
                  team={teams.length}
                  emp={emp.length}
                  
        />
      </div>
    </>
  );
};
export default ProfileAdmin;
