import { AiOutlineMail } from "react-icons/ai";
import { Card, CustomButton, CustomInput } from "../../../Components/common";
import { GoOrganization, GoGoal } from "react-icons/go";
import styles from "../styles.module.css";
import { BASE_URL } from "../../../consts";
import { useSelector } from "react-redux";
const OrgData = ({ orgData, updateFormData, emp = 0, dep = 0, team = 0 }) => {
  const { name, email, image, diversityGoalScore } = orgData;
  const token = useSelector((state) => state.auth.token);
  const EditProfileHandler = () => {
    document.getElementById("adminfile").click();
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
    updateFormData({
      ...orgData,
      image: link,
    });
  };
  return (
    <div className={styles.top}>
      <Card style={{ padding: "1rem 5rem 0.5rem 5rem" }}>
        <div className={styles.profile}>
          <img src={image} alt="profile" className={styles.image} />
          <input
            type="file"
            id="adminfile"
            style={{ display: "none" }}
            onChange={ProfileImageHandler}
          />
          <CustomButton
            text="Edit"
            buttonProps={{
              type: "button",
              style: { width: "100%" },
              onClick: EditProfileHandler,
            }}
          />
        </div>
      </Card>
      <Card style={{ flexGrow: "1" }}>
        <CustomInput
          type="text"
          placeholder="Enter Company Name"
          style={{ width: "100%" }}
          label="Company Name"
          value={name}
          icon={<GoOrganization />}
          onChange={(e) => {
            updateFormData({
              ...orgData,
              name: e.target.value,
            });
          }}
        />
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
          placeholder="Enter Diversity Goal Score"
          style={{ width: "100%" }}
          label="Goal"
          value={diversityGoalScore}
          icon={<GoGoal />}
          onChange={(e) => {
            updateFormData({
              ...orgData,
              diversityGoalScore: e.target.value,
            });
          }}
        />
        <div className={styles.horz}>
          <CustomInput
            type="number"
            style={{ width: "100%" }}
            label="Number of Employees"
            value={emp}
            readOnly="true"
          />
          <CustomInput
            type="number"
            style={{ width: "100%" }}
            label="Number of Departments"
            value={dep}
            readOnly="true"
          />
          <CustomInput
            type="number"
            style={{ width: "100%" }}
            label="Number of Teams"
            value={team}
            readOnly="true"
          />
        </div>
      </Card>
    </div>
  );
};
export default OrgData;
