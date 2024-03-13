import styles from "../styles.module.css";
import { Card, CustomButton, CustomInput } from "../../../Components/common";
import { AiOutlineUser, AiOutlineMail, AiOutlineTeam } from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { GiAges } from "react-icons/gi";
import { MdOutlineDateRange } from "react-icons/md";
import { useSelector } from "react-redux";
import { useState } from "react";
const PrimaryData = ({ user }) => {
  let {
    firstname = "",
    lastName = null,
    email,
    age = null,
    team,
    departmentId,
    dateOfJoining,
    dateOfLeaving = null,
    img
  } = user;
  const [primaryFormData, setPrimaryFormData] = useState({
    lastName: lastName || "",
    age: age || "",
  });
  const [profileImage, setProfileImage] = useState(img || "https://www.w3schools.com/howto/img_avatar.png");
  const deps = useSelector((state) => state.department.departments);
  const depName = deps.find((dep) => dep.value === departmentId)?.label;
  dateOfJoining = new Date(dateOfJoining).toLocaleDateString();
  const EditProfileHandler = () => {
    console.log("Edit Profile", primaryFormData);
    document.getElementById("file").click();
  };
  const ProfileImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImage(reader.result); 
    };
  };
  return (
    <div className={styles.top}>
      <Card style={{ padding: "1rem 5rem 0.5rem 5rem" }}>
        <div className={styles.profile}>
          <img src={profileImage} alt="profile" className={styles.image} />
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
            value={primaryFormData.lastName}
            icon={<AiOutlineUser />}
            onChange={(e) => {
              setPrimaryFormData({
                ...primaryFormData,
                lastName: e.target.value,
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
            }}
          />
        </div>
        <div className={styles.horz}>
          <CustomInput
            type="text"
            placeholder="No team assigned"
            style={{ width: "100%" }}
            label={"Team"}
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
