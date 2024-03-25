import {
  CustomButton,
  Modal,
  EmptyContainer,
} from "../../../../Components/common";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { EmployeeList, SelectEmployee } from "../../../Employees/components";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { BASE_URL } from "../../../../consts";
import { useRequest } from "../../../../hooks/useRequest";
import { useSelector, useDispatch } from "react-redux";
import { getEmployees } from "../../../../store/employee-slice";
import { toast } from "sonner";

const TeamRow = ({
  team,
  index,
  depName = "",
  employees = [],
  deps = [],
  teams = [],
}) => {
  const { sendRequest } = useRequest();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [showModal, setShowModal] = useState(null);
  const orgId = useSelector((state) => state.auth.orgId);
  const modalCloseHandler = () => {
    setShowModal(null);
  };
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });

  let employeeWithNoTeam = [];
  let employeeWithThisTeam = [];
  employeeWithNoTeam = employees.filter(
    (employee) =>
      employee.teamId === undefined &&
      employee.departmentId === team.departmentId
  );
  employeeWithThisTeam = employees.filter(
    (employee) => employee.teamId === team.id
  );
  const addToTeamHandler = async (e, emp) => {
    let url = BASE_URL + "/team/addEmployee";
    let data = {
      teamId: team.id,
      members: emp,
    };
    const response = await sendRequest(url, "POST", JSON.stringify(data), {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });
    if (!response) {
      toast.error("Employee adding to team failed, please try again later");
    } else {
      modalCloseHandler();
      toast.success("Employee added to team successfully");
      dispatch(getEmployees({ orgId, token }));
    }
  };
  return (
    <>
      <Modal isOpen={showModal}>
        <div className={styles.containerModal}>
          <div className={styles.form} ref={containerRef}>
            {showModal === "selectEmployee" && (
              <>
                {employeeWithNoTeam.length === 0 ? (
                  <EmptyContainer
                    title="No Employee found to add"
                    description="Add more employee in the department to add in this team"
                    cancelButton={{
                      text: "Close",
                      onClick: modalCloseHandler,
                    }}
                  />
                ) : (
                  <SelectEmployee
                    employees={employeeWithNoTeam}
                    deps={deps}
                    teamName={team.name}
                    callback={(e, emp) => addToTeamHandler(e, emp)}
                  />
                )}
              </>
            )}
            {showModal === "viewEmployee" && (
              <>
                {employeeWithThisTeam.length === 0 ? (
                  <EmptyContainer
                    title="No Employee Found in this team"
                    description="Choose another team to see data"
                    cancelButton={{
                      text: "Close",
                      onClick: modalCloseHandler,
                    }}
                  />
                ) : (
                  <EmployeeList
                    employees={employeeWithThisTeam}
                    deps={deps}
                    title="Employees"
                    teams={teams}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
      <tr key={team.id}>
        <td>{index + 1}</td>
        <td>{team.name}</td>
        <td>{depName}</td>
        <td width={40}>
          <CustomButton
            text="View"
            buttonProps={{
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                setShowModal("viewEmployee");
              },
              style: {
                margin: "0",
                padding: "0.5rem 1rem",
                width: "100%",
                borderRadius: "5px",
              },
            }}
          />
        </td>
        <td width={20}>
          <div className={styles.icons}>
            <IoIosAddCircle
              size={25}
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation();
                setShowModal("selectEmployee");
              }}
            />
            <MdEdit size={25} className={styles.icon} />
            <MdDelete size={25} className={styles.icon} />
          </div>
        </td>
      </tr>
    </>
  );
};
export default TeamRow;
