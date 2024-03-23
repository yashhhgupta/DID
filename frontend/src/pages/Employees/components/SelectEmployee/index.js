import styles from "./styles.module.css";
import { useState } from "react";
import { CustomButton,TableFooter } from "../../../../Components/common";
import { CiCircleChevDown } from "react-icons/ci";
import { toast } from "sonner";
import useTable from "../../../../hooks/useTable";
const SelectEmployee = ({ employees=[], deps=[], teamName="",callback }) => {
  const [emp, setEmp] = useState([]);
  const [view, setView] = useState("View more");

  const handleCheckboxChange = (index) => {
    const employeeToAdd = employees[index];
    const isEmployeeInList = emp.find((e) => e === employeeToAdd.id);
    if (!isEmployeeInList) {
      setEmp([...emp, employeeToAdd.id]);
    } else {
      setEmp(emp.filter((e) => e !== employeeToAdd.id));
    }
  };
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(employees, page, 10);
  const SubmitHandler= (e) => {
    e.preventDefault();
    if(emp.length === 0){
      toast.error("Please select atleast one employee");
      return;
    }
    callback(e,emp);
  }
  const renderEmployees = () => { 
      return slice.map((employee, index) => {
        let name = employee.firstname;
        if (employee.lastname) {
          name = name + " " + employee.lastname;
        }
        const depName = deps.find(
          (dep) => dep.value === employee.departmentId
        )?.label;
        return (
          <tr key={index}>
            <td>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(index)}
              />
            </td>
            <td>{(page-1) * 10 + index + 1}</td>
            <td>{name}</td>
            <td>{employee.email}</td>
            <td>{depName}</td>
          </tr>
        );
      });
    
  }
  return (
    <div>
      <div className={styles.heading}>
        <h1>Add Employee to {teamName} Team</h1>
        <CustomButton
          text="Add"
          buttonProps={{
            type: "button",
            onClick: SubmitHandler,
          }}
        />
      </div>
      <table className={styles.customtable}>
        <tr>
          <th></th>
          <th>S.No.</th>
          <th>Name</th>
          <th>Gmail</th>
          <th>Department</th>
        </tr>
        <tbody>{renderEmployees()}</tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </div>
  );
};
export default SelectEmployee;
