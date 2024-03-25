import styles from "./styles.module.css";
import { useState } from "react";
import { CustomButton,Search,TableFooter } from "../../../../Components/common";
import { toast } from "sonner";
import useTable from "../../../../hooks/useTable";
const SelectEmployee = ({ employees=[], deps=[], teamName="",callback }) => {
  const [emp, setEmp] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const handleCheckboxChange = (empId) => {
    const isEmployeeInList = emp.find((e) => e === empId);
    if (!isEmployeeInList) {
      setEmp([...emp, empId]);
    } else {
      setEmp(emp.filter((e) => e !== empId));
    }
  };
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(filteredEmployees, page, 10);
  const [search, setSearch] = useState("");
  const SubmitHandler = (e) => {
    e.preventDefault();
    if(emp.length === 0){
      toast.error("Please select atleast one employee");
      return;
    }
    callback(e,emp);
  }
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

      return (
        <tr key={index}>
          <td>
            {employee.id && (
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(employee.id)}
                checked={emp.includes(employee.id)}
              />
            )}
          </td>
          <td>{(page - 1) * 10 + index + 1}</td>
          <td>{name}</td>
          <td>{employee.email || ""}</td>
          <td>{depName}</td>
        </tr>
      );
    });
  };

  const searchHandler = (value) => {
    setSearch(value);
    if (value === "") {
      setFilteredEmployees(employees);
      return;
    }
    let temp = employees.filter((employee) => {
      return (
        employee.firstname.toLowerCase().includes(value.toLowerCase()) ||
        employee.lastname.toLowerCase().includes(value.toLowerCase()) ||
        employee.email.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredEmployees(temp);
  };
  return (
    <div>
      <div className={styles.heading}>
        <h1>Add Employee to {teamName} Team</h1>
        <Search
          search={search}
          onChangeSearch={searchHandler}
          text={"Search by Name or Email"}
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
      <CustomButton
        text={"Add Selected Employees to team " + teamName}
        buttonProps={{
          type: "button",
          onClick: SubmitHandler,
          style: {
            width: "100%",
          },
        }}
      />
    </div>
  );
};
export default SelectEmployee;
