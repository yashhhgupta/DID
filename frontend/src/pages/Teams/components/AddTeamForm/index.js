import styles from "./styles.module.css";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { useRef, useState, useEffect } from "react";
import { CustomInput, CustomButton } from "../../../../Components/common";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BASE_URL } from "../../../../consts";
import { useRequest } from "../../../../hooks/useRequest";
import { useSelector, useDispatch } from "react-redux";
import { getDepartments } from "../../../../store/department-slice";
import Select from "react-select";
import { customStyles } from "../../../../consts";
import { getTeams } from "../../../../store/team-slice";
import { toast } from "sonner";

const AddTeamForm = ({ modalCloseHandler }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const departments = useSelector((state) => state.department.departments);
  const { sendRequest } = useRequest();
  const [team, setTeam] = useState({
    name: "",
    department: "",
  });
  useEffect(() => {
    dispatch(getDepartments({ orgId, token }));
  }, []);
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });
  const handleInputChange = (e) => {
    setTeam((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!team.name.trim()) {
      toast.error("Please enter team name.");
      return;
    }
    if (!team.department.value) {
      toast.error("Please select department.");
      return;
    }
    let url = BASE_URL + "/team/add";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        orgId: orgId,
        name: team.name,
        departmentId: team.department.value,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      toast.error("Team Adding Failed");
    } else {
      toast.success("Team Added Successfully");
      dispatch(getTeams({ orgId, token }));
      modalCloseHandler();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form} ref={containerRef}>
        <form>
          <h1>Add Team</h1>
          {departments.length === 0 && (
          <p>No departments added, <br/>To add a team add a department</p>)}
          <CustomInput
            type="text"
            placeholder="Team Name"
            name="name"
            icon={<HiOutlineOfficeBuilding />}
            required
            value={team.name}
            onChange={handleInputChange}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Select
              styles={customStyles}
              options={departments}
              onChange={(selectedOption) => {
                setTeam((prevData) => ({
                  ...prevData,
                  department: selectedOption,
                }));
              }}
              value={team.department}
              placeholder="Select a department"
            />
          </div>
          <CustomButton
            text="Add Team"
            buttonProps={{
              type: "button",
              onClick: submitHandler,
              style: { width: "100%" },
            }}
          />
        </form>
      </div>
    </div>
  );
};
export default AddTeamForm;
