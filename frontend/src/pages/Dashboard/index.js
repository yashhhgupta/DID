import styles from "./styles.module.css";
import { Dashbody } from "./components";
import Select from "react-select";
import { customStyles } from "../../consts";
import {useSelector,useDispatch} from "react-redux";
import { useEffect,useState } from "react";
import { getDepartments } from "../../store/department-slice";
import { getTeams } from "../../store/team-slice";
const Dashboard = () => {
  const dispatch = useDispatch();
  const deps = useSelector((state) => state.department.departments);
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
  const teams = useSelector((state) => state.team.teams);
  const [selectedDep, setSelectedDep] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  useEffect(() => { 
    dispatch(getDepartments({ orgId, token }));
    dispatch(getTeams({ orgId, token }));
  }, [])
  let updatedTeams = [];
  updatedTeams = teams.filter((team) => {
    if (selectedDep) {
      return team.departmentId === selectedDep.value;
    }
    return team;
  }).map((team) => {
    return {
      value: team._id,
      label: team.name,
    };
  });
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Dashboard</h1>
        <div className={styles.buttons}>
          <Select
            style={customStyles}
            options={deps}
            placeholder="Select Department"
            onChange={(e) => setSelectedDep(e)}
            isClearable={true}
          />
          { selectedDep && (
            <Select
              style={customStyles}
              options={updatedTeams}
              placeholder="Select Team"
              onChange={(e) => setSelectedTeam(e)}
              isClearable={true}
            />
          )}
        </div>
      </div>
      <Dashbody department={selectedDep} team={selectedTeam} />
    </div>
  );
};
export default Dashboard;
