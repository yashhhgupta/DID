import styles from "../styles.module.css";
import { Card, CustomButton, CustomInput } from "../../../Components/common";
import { AiOutlineUser, AiOutlineMail, AiOutlineTeam } from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { GiAges } from "react-icons/gi";
import { MdOutlineDateRange } from "react-icons/md";
import { useSelector } from "react-redux";
const PrimaryData = ({ user }) => {
  let {
    firstname="",
    lastName = null,
    email,
    age = null,
    team,
    departmentId,
    dateOfJoining,
    dateOfLeaving = null,
  } = user;
  const deps = useSelector((state) => state.department.departments);
  const depName = deps.find((dep) => dep.value === departmentId)?.label;
  dateOfJoining = new Date(dateOfJoining).toLocaleDateString();
  const EditProfileHandler = () => {
    console.log("Edit Profile");
  };

  return (
    <div className={styles.top}>
      <Card style={{ padding: "1rem 5rem 0.5rem 5rem" }}>
        <div className={styles.profile}>
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="profile"
            className={styles.image}
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
            icon={<AiOutlineUser />}
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
            icon={<GiAges />}
          />
        </div>
        <div className={styles.horz}>
          <CustomInput
            type="text"
            placeholder="Team"
            style={{ width: "100%" }}
            label={"Team"}
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
            />) : (
              <div></div>
            )}
          
        </div>
      </Card>
    </div>
  );
};
export default PrimaryData;
