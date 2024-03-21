import styles from "./styles.module.css";
import { CustomButton, Card, EmptyContainer } from "../../Components/common";
import { useState } from "react";
import { Modal } from "../../Components/common";
import { AddTeamForm, TeamList } from "./components";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTeams } from "../../store/team-slice";
import { getDepartments } from "../../store/department-slice";
import { getEmployees } from "../../store/employee-slice";
import { Loader } from "../../Components/common";

const Teams = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const teams = useSelector((state) => state.team.teams);
  const deps = useSelector((state) => state.department.departments);
  const employees = useSelector((state) => state.employee.employees);
  const statusEmployees = useSelector((state) => state.employee.status);
  const statusDepartments = useSelector((state) => state.department.status);
  const statusTeams = useSelector((state) => state.team.status);

  useEffect(() => {
    dispatch(getTeams({ orgId, token }));
    dispatch(getDepartments({ orgId, token }));
    dispatch(getEmployees({ orgId, token }));
  }, []);
  const [modal, setModal] = useState(false);

  const modalCloseHandler = () => {
    setModal(false);
  };
  const AddTeamHandler = (e) => {
    e.stopPropagation();
    setModal(true);
  };
  if (
    statusEmployees === "idle" ||
    statusEmployees === "loading" ||
    statusDepartments === "idle" ||
    statusDepartments === "loading" ||
    statusTeams === "idle" ||
    statusTeams === "loading"
  ) {
    return <Loader isLoading={true} />;
  }
  return (
    <>
      <Modal isOpen={modal}>
        <AddTeamForm modalCloseHandler={modalCloseHandler} />
      </Modal>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>TEAMS</h1>
          <div className={styles.buttons}>
            <CustomButton
              text="Add Team"
              icon={<FaPlus size={18} />}
              buttonProps={{
                type: "button",
                onClick: AddTeamHandler,
              }}
            />
          </div>
        </div>
        <div className={styles.teamContainer}>
          <Card
            style={{
              padding: "2rem",
              minHeight: "55vh",
              backgroundColor: "var(--color-light)",
            }}
          >
            {teams.length === 0 ? (
              <EmptyContainer
                title="No Team Found"
                description="Choose another filters to see data or add team"
                confirmButton={{
                  text: "Add Team",
                  onClick: (e) => {
                    e.stopPropagation();
                    setModal(true);
                  },
                }}
              />
            ) : (
              <TeamList teams={teams} employees={employees} deps={deps} />
            )}
          </Card>
        </div>
      </div>
    </>
  );
};
export default Teams;
