import styles from "./styles.module.css";
import {
  CustomButton,
  Card,
  Modal,
  DepartmentFilter,
  EmptyContainer,
} from "../../Components/common";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { EmployeeList, AddDepartmentForm, AddEmployeeForm } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { getDepartments } from "../../store/department-slice";
import { getEmployees } from "../../store/employee-slice";
import { getTeams } from "../../store/team-slice";
import {Loader,Search,CustomToggle} from "../../Components/common";

const Employees = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const employees = useSelector((state) => state.employee.employees);
  const statusEmployees = useSelector((state) => state.employee.status);
  const deps = useSelector((state) => state.department.departments);
  const teams = useSelector((state) => state.team.teams);
  const [showModal, setShowModal] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);
  const modalCloseHandler = () => {
    setShowModal(null);
  };
  useEffect(() => {
    dispatch(getDepartments({ orgId, token }));
    dispatch(getEmployees({ orgId, token }));
    dispatch(getTeams({ orgId, token }));
  }, []);
  if (
    statusEmployees === "idle" ||
    statusEmployees === "loading"
  ) {
    return (
      <Loader isLoading={true} />
    );
  }
  const HandleFilterEmployee = (filteredDeps) => {
    if (filteredDeps.length === 0) {
      setFilteredEmployees(employees);
      return;
    }
    let temp = employees.filter((emp) => {
      return filteredDeps.includes(emp.departmentId);
    });
    setFilteredEmployees(temp);
  };
  const handleSearchChange = (value) => {
    setSearch(value);
    if (value === "") {
      setFilteredEmployees(employees);
      return;
    }
    let temp = employees.filter((emp) => {
      
      if (
        emp.firstname === undefined ||
        emp.lastname === undefined ||
        emp.email === undefined
      )
        return false;
      return (
        emp.firstname.toLowerCase().includes(value.toLowerCase()) ||
        emp.lastname.toLowerCase().includes(value.toLowerCase()) ||
        emp.email.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredEmployees(temp);
  }
  return (
    <>
      <Modal isOpen={showModal}>
        {showModal === "addDepartment" && (
          <AddDepartmentForm modalCloseHandler={modalCloseHandler} />
        )}
        {showModal === "addEmployee" && (
          <AddEmployeeForm modalCloseHandler={modalCloseHandler} />
        )}
      </Modal>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>Employees</h1>
          <div className={styles.buttons}>
            <CustomButton
              text="Add Departmemt"
              icon={<FaPlus size={18} />}
              buttonProps={{
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  setShowModal("addDepartment");
                },
              }}
            />
            <CustomButton
              text="Add Employee"
              icon={<FaPlus size={18} />}
              buttonProps={{
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  setShowModal("addEmployee");
                },
              }}
            />
          </div>
        </div>
        <Card
          style={{
            padding: "1rem 2rem",
            backgroundColor: "var(--color-light)",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className={styles.horz}>
            <DepartmentFilter
              deps={deps}
              setFilteredDeps={(filteredDeps) =>
                HandleFilterEmployee(filteredDeps)
              }
            />
            {/* <CustomToggle selected={toggle} handleClick={(value)=>setToggle(value)}/> */}
            <Search search={search} onChangeSearch={handleSearchChange} text="Search by Name or Email"/>
          </div>
          {filteredEmployees.length === 0 ? (
            <EmptyContainer
              title="No Employee Found"
              description="Choose another filters to see data or add new employee"
              confirmButton={{
                text: "Add Employee",
                onClick: () => setShowModal("addEmployee"),
              }}
            />
          ) : (
            <EmployeeList
              employees={filteredEmployees}
              deps={deps}
              teams={teams}
            />
          )}
        </Card>
      </div>
    </>
  );
};
export default Employees;
