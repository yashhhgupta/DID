import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { BASE_URL } from "../../consts";
import { PrimaryData, SecondaryData } from "./components";
import { useDispatch } from "react-redux";
import { getDepartments } from "../../store/department-slice";
import { getTeams } from "../../store/team-slice";
import { ConfirmationPopUp, CustomButton, Modal } from "../../Components/common";
import { toast } from "sonner";
import { Loader } from "../../Components/common";

const ProfileEmp = () => {
  const [datatoUpdate, setDatatoUpdate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { sendRequest, isLoading } = useRequest();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  
  const status = useSelector((state) => state.department.status);
  const status2 = useSelector((state) => state.team.status);
  const [user, setUser] = useState(null);
  const modalCloseHandler = () => { 
    setShowModal(false);
  }
  useEffect(() => {
    dispatch(getDepartments({ orgId, token }));
    dispatch(getTeams({ orgId, token }));
    const getUser = async () => {
      let url = BASE_URL + "/user/get/" + userId;
      const response = await sendRequest(url, "GET", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });
      if (!response) {
        toast.error("Profile Fetching Failed,please try again later.");
      } else {
        setUser(response.user);
      }
    };
    getUser();
  }, [showModal]);
  if (
    isLoading ||
    !user ||
    status === "loading" ||
    status === "idle" ||
    status2 === "loading" ||
    status2 === "idle"
  ) {
    return <Loader isLoading={true} />;
  }
  const updateProfileData = (data) => {
    setDatatoUpdate(data);
  };
  const EditProfileHandler = async () => {
    const response = await sendRequest(
      BASE_URL + "/user/updateProfile",
      "POST",
      JSON.stringify({
        datatoUpdate,
        userId: userId,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      toast.error("Profile Update Failed, Please try again.");
    } else {
      toast.success("Profile Updated");
      setShowModal(false);
      setDatatoUpdate({});
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
                disabled:!datatoUpdate || Object.keys(datatoUpdate).length === 0,
                onClick: (e) => {
                  console.log("clicked", datatoUpdate);
                  e.stopPropagation();
                  setShowModal(true);
                },
              }}
            />
          </div>
        </div>
        <PrimaryData
          user={user}
          updateProfileData={updateProfileData}
          currentUpdateData={datatoUpdate}
        />
        <SecondaryData
          user={user}
          updateProfileData={updateProfileData}
          currentUpdateData={datatoUpdate}
        />
      </div>
    </>
  );
};
export default ProfileEmp;
