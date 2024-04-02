import styles from "../styles.module.css";
import { Card, CustomButton, CustomInput } from "../../../Components/common";
import { AiOutlineUser, AiOutlineMail, AiOutlineTeam } from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { GiAges } from "react-icons/gi";
import { MdOutlineDateRange } from "react-icons/md";
import { useSelector } from "react-redux";
import { useState } from "react";
import { BASE_URL } from "../../../consts";

const PrimaryData = ({ user, updateProfileData, currentUpdateData }) => {
  const token = useSelector((state) => state.auth.token);

  let {
    firstname = "",
    lastname = null,
    email,
    age = null,
    teamId,
    departmentId,
    dateOfJoining,
    dateOfLeaving = null,
    image,
  } = user;
  const [primaryFormData, setPrimaryFormData] = useState({
    lastname: lastname || "",
    age: age || "",
    image : image || "https://www.w3schools.com/howto/img_avatar.png",
  });
  const deps = useSelector((state) => state.department.departments);
  const teams = useSelector((state) => state.team.teams);
  const depName = deps.find((dep) => dep.value === departmentId)?.label;
  const teamName = teams.find((team) => team.id === teamId)?.name;
  dateOfJoining = new Date(dateOfJoining).toLocaleDateString();
  const EditProfileHandler = () => {
    document.getElementById("file").click();
  };
  const ProfileImageHandler = async (e) => {
    const profileImage = e.target.files[0];
    const formData = new FormData();
    formData.append("file", profileImage);
    const res = await fetch(BASE_URL + "/service/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const { link } = await res.json();
    setPrimaryFormData({
      ...primaryFormData,
      image: link,
    });
    updateProfileData({
      ...currentUpdateData,
      image: link,
    });
  };
  
  return (
    <div className={styles.top}>
      <Card style={{ padding: "1rem 5rem 0.5rem 5rem" }}>
        <div className={styles.profile}>
          <img src={primaryFormData.image} alt="profile" className={styles.image} />
          <input
            type="file"
            id="file"
            style={{ display: "none" }} // Hidden by default
            onChange={ProfileImageHandler}
          />
          <CustomButton
            text="Edit"
            buttonProps={{
              type: "button",
              onClick: EditProfileHandler,
              style: { width: "100%" },
            }}
          />
        </div>
      </Card>
      <Card style={{ flexGrow: "1" }}>
        <div className={styles.horz}>
          <CustomInput
            type="text"
            placeholder="Enter First Name"
            style={{ width: "100%" }}
            label="First Name"
            readOnly="true"
            value={firstname}
            icon={<AiOutlineUser />}
          />
          <CustomInput
            type="text"
            placeholder="Enter Last Name"
            style={{ width: "100%" }}
            label="Last Name"
            value={primaryFormData.lastname}
            icon={<AiOutlineUser />}
            onChange={(e) => {
              setPrimaryFormData({
                ...primaryFormData,
                lastname: e.target.value,
              });
              updateProfileData({
                ...currentUpdateData,
                lastname: e.target.value,
              });
            }}
          />
        </div>
        <div className={styles.horz}>
          <CustomInput
            type="text"
            placeholder="Email"
            style={{ width: "100%" }}
            label="Email"
            readOnly="true"
            value={email}
            icon={<AiOutlineMail />}
          />
          <CustomInput
            type="number"
            placeholder="Age"
            style={{ width: "100%" }}
            label="Age "
            value={primaryFormData.age}
            icon={<GiAges />}
            onChange={(e) => {
              setPrimaryFormData({
                ...primaryFormData,
                age: e.target.value,
              });
              updateProfileData({
                ...currentUpdateData,
                age: e.target.value,
              });
            }}
          />
        </div>
        <div className={styles.horz}>
          <CustomInput
            type="text"
            placeholder="No team assigned"
            style={{ width: "100%" }}
            label={"Team"}
            value={teamName}
            readOnly="true"
            icon={<AiOutlineTeam />}
          />
          <CustomInput
            type="text"
            placeholder="Department"
            style={{ width: "100%" }}
            label={"Department"}
            value={depName}
            readOnly="true"
            icon={<HiOutlineOfficeBuilding />}
          />
        </div>
        <div className={styles.horz}>
          <CustomInput
            type="text"
            placeholder="Date of Joining"
            style={{ width: "100%" }}
            label={"Date of Joining"}
            readOnly="true"
            value={dateOfJoining}
            icon={<MdOutlineDateRange />}
          />
          {dateOfLeaving ? (
            <CustomInput
              type="text"
              placeholder="Date of Leaving"
              style={{ width: "100%" }}
              label={"Date of Leaving"}
              icon={<MdOutlineDateRange />}
            />
          ) : (
            <div></div>
          )}
        </div>
      </Card>
    </div>
  );
};
export default PrimaryData;
