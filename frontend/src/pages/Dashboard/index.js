import styles from "./styles.module.css";
import { Dashbody } from "./components";
import Select from "react-select";
import { customStyles } from "../../consts";
import {useSelector,useDispatch} from "react-redux";
import { useEffect } from "react";
import { getDepartments } from "../../store/department-slice";
const Dashboard = () => {
  const dispatch = useDispatch();
  const deps = useSelector((state) => state.department.departments);
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => { 
    dispatch(getDepartments({orgId,token}));
  },[])
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Dashboard</h1>
        <div className={styles.buttons}>
          <Select
            style={customStyles}
            options={deps}
            placeholder="Select Department"
          />
          <Select
            style={customStyles}
            options={deps}
            placeholder="Select Team"
          />
        </div>
      </div>
      <Dashbody />
    </div>
  );
};
export default Dashboard;
