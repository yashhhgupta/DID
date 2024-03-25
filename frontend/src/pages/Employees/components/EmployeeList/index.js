import styles from "./styles.module.css";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { TableFooter} from "../../../../Components/common";
import useTable from "../../../../hooks/useTable";

const EmployeeList = ({
  employees = [],
  deps = [],
  teams = [],
  title = "",
}) => {
  const [showModal, setShowModal] = useState(null);
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(employees, page, 10);
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

      return (
        <tr key={index}>
          <td>{(page - 1) * 10 + index + 1}</td>
          <td>{name}</td>
          <td>{employee.email || ""}</td>
          <td>{depName}</td>
          <td>{teamName}</td>
          <td width={20}>
            <div className={styles.icons}>
              <MdDelete size={25} className={styles.icon} />
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
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
            <th width={20}></th>
          </tr>
        </thead>
        <tbody>{renderEmployees()}</tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </div>
  );
};
export default EmployeeList;
