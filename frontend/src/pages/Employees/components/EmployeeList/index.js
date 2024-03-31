import styles from "./styles.module.css";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { ConfirmationPopUp, Modal, TableFooter} from "../../../../Components/common";
import useTable from "../../../../hooks/useTable";
import { BASE_URL } from "../../../../consts";
import { useRequest } from "../../../../hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "../../../../store/employee-slice";
import { toast } from "sonner";

const EmployeeList = ({
  employees = [],
  deps = [],
  teams = [],
  title = "",
}) => {
  const { sendRequest } = useRequest();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const [showModal, setShowModal] = useState(null);
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(employees, page, 10);

  const modalCloseHandler = () => {
    setShowModal(false);
  }

  const deleteEmployeeHandler = async () => {
    let url = BASE_URL + "/admin/removeEmployee";
    if(title) url = BASE_URL + "/admin/removeEmployeeTeam";

    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        userId: showModal,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      toast.error("User deletion failed, please try again later");
    } else {
      modalCloseHandler();
      toast.success("User removed from org successfully");
      dispatch(getEmployees({ orgId, token }));
    }
  };

  const renderEmployees = () => {
    const employeesToRender =
      slice.length >= 10
        ? slice
        : [...slice, ...Array(10 - slice.length).fill({})];

    return employeesToRender.map((employee, index) => {
      if (!employee.id) {
        return (
          <tr key={index}>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td width={20}></td>
          </tr>
        );
      }
      let name = employee.firstname || "";
      if (employee.lastname) {
        name = name + " " + employee.lastname;
      }
      const depName = employee.departmentId
        ? deps.find((dep) => dep.value === employee.departmentId)?.label
        : "";
      const teamName = employee.teamId
        ? teams.find((team) => team.id === employee.teamId)?.name
        : "";
      const active = employee.dateOfLeaving === undefined ? true : false;

      return (
        <tr key={index}>
          <td>{(page - 1) * 10 + index + 1}</td>
          <td>{name}</td>
          <td>{employee.email || ""}</td>
          <td>{depName}</td>
          <td>{teamName}</td>
          <td>{active ? "CURRENT" : "FORMER"}</td>
          {active?(
          <td width={20}>
            <div className={styles.icons}>
              <MdDelete size={25} className={styles.icon} onClick={(e) => {
                e.stopPropagation();
                setShowModal(employee.id);
              }}/>
            </div>
            </td>):
            (<td></td>)}
        </tr>
      );
    });
  };

  return (
    <>
      <Modal isOpen={showModal}>
        <ConfirmationPopUp
          title={!title?"Remove Employee":"Remove Employee from team"}
          subTitle={!title?"Are you sure you want to remove employee from org?":`Are you sure you want to remove this employee from the team?`}
          onCancel={modalCloseHandler}
          onConfirm={deleteEmployeeHandler}
          modalCloseHandler={modalCloseHandler}
          deleteButtonColor={true}
        />
      </Modal>
      <div>
        {title && <h1>{title}</h1>}
        <table className={styles.customtable}>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Gmail</th>
              <th>Department</th>
              <th>Team</th>
              <th>Status</th>
              <th width={20}></th>
            </tr>
          </thead>
          <tbody>{renderEmployees()}</tbody>
        </table>
        <TableFooter
          range={range}
          slice={slice}
          setPage={setPage}
          page={page}
        />
      </div>
    </>
  );
};
export default EmployeeList;
