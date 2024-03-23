import styles from "./styles.module.css";
import { IoIosAddCircle } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { CiCircleChevDown } from "react-icons/ci";
import { useState } from "react";
import { CustomButton ,TableFooter} from "../../../../Components/common";
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
      return slice.map((employee, index) => {
        let name = employee.firstname;
        if (employee.lastname) {
          name = name + " " + employee.lastname;
        }
        const depName = deps.find(
          (dep) => dep.value === employee.departmentId
        )?.label;
        const teamName = teams.find(
          (team) => team.id === employee.teamId
        )?.name;

        return (
          <tr key={index}>
            <td>{(page - 1) * 10 + index + 1}</td>
            <td>{name}</td>
            <td>{employee.email}</td>
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
