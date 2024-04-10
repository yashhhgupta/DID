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
import Search from "../../Components/common/Search";

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
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  let [filteredTeams, setFilteredTeams] = useState([]);
  useEffect(() => {
    dispatch(getDepartments({ orgId, token }));
    dispatch(getTeams({ orgId, token }));
    dispatch(getEmployees({ orgId, token }));
  }, []);

  const modalCloseHandler = () => {
    setModal(false);
  };
  const AddTeamHandler = (e) => {
    e.stopPropagation();
    setModal(true);
  };
  useEffect(() => {
    if (statusTeams === "succeeded") {
      setFilteredTeams(teams);
    }
  }, [statusEmployees, statusDepartments, statusTeams]);
  if (statusTeams === "idle" || statusTeams === "loading") {
    return <Loader isLoading={true} />;
  }

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value === "") {
      setFilteredTeams(teams);
      return;
    }
    let temp = teams.filter((team) => {
      return team.name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredTeams(temp);
  };
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
              padding: "1rem 2rem",
              minHeight: "55vh",
              backgroundColor: "var(--color-light)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div className={styles.horz}>
              <Search
                search={search}
                onChangeSearch={handleSearchChange}
                text="Search by Team name"
              />
            </div>
            {filteredTeams.length === 0 ? (
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
              <TeamList
                teams={filteredTeams}
                employees={employees}
                deps={deps}
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
};
export default Teams;
