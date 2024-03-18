import styles from "./styles.module.css";
import { useState } from "react";
import { CustomButton } from "../../../../Components/common";
const SelectEmployee = ({ employees=[], deps=[], teamName="",callback }) => {
  const [emp, setEmp] = useState([]);
  const handleCheckboxChange = (index) => {
    const employeeToAdd = employees[index];
    const isEmployeeInList = emp.find((e) => e === employeeToAdd.id);
    if (!isEmployeeInList) {
      setEmp([...emp, employeeToAdd.id]);
    } else {
      setEmp(emp.filter((e) => e !== employeeToAdd.id));
    }
  };
  const SubmitHandler= (e) => {
    e.preventDefault();
    if(emp.length === 0){
      alert("Please select atleast one employee");
      return;
    }
    callback(e,emp);
  }
  return (
    <div>
      <div className={styles.heading}>
        <h1>Add Employee to {teamName} Team</h1>
        <CustomButton text="Add" buttonProps={{
          type: "button",
          onClick : SubmitHandler,
        }} />
      </div>
      <table className={styles.customtable}>
        <tr>
          <th></th>
          <th>S.No.</th>
          <th>Name</th>
          <th>Gmail</th>
          <th>Department</th>
        </tr>
        <tbody>
          {employees.map((employee, index) => {
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
                <td>{index + 1}</td>
                <td>{name}</td>
                <td>{employee.email}</td>
                <td>{depName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default SelectEmployee;
