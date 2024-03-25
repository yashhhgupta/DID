import styles from "./styles.module.css";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { useRef, useState } from "react";
import { CustomInput, CustomButton } from "../../../../Components/common";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { BASE_URL } from "../../../../consts";
import { useRequest } from "../../../../hooks/useRequest";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { getDepartments } from "../../../../store/department-slice";
import { useDispatch } from "react-redux";


const AddDepartmentForm = ({ modalCloseHandler }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const { sendRequest, isError } = useRequest();
  const [departments, setDepartments] = useState([""]);
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });
  const handleInputChange = (e, index) => {
    const newDepartments = [...departments];
    newDepartments[index] = e.target.value;
    setDepartments(newDepartments);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    for (let i = 0; i < departments.length; i++) {
      if (!departments[i].trim()) {
        toast.error("Please enter department name.");
        return;
      }
    }
    let url = BASE_URL + "/department/addMultiple";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        departments: departments,
        orgId: orgId,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      
      toast.error("Departments Adding Failed");
    } else {
      toast.success("Departments Added Successfully");
    dispatch(getDepartments({ orgId, token }));

      modalCloseHandler();
    }
  };
  const buttonProps = {
    type: "button",
    onClick: submitHandler,
    style: { width: "100%" },
  };
  const AddButtonProps = {
    type: "button",
    onClick: () => {
      setDepartments([...departments, ""]);
    },
    style: {
      backgroundColor: "#F8F8FF",
      color: "#0359E0",
      margin: "0rem",
    },
  };
  return (
    <div className={styles.container}>
      <div className={styles.form} ref={containerRef}>
        <form>
          <h1>Add Department</h1>
          {departments.map((department, index) => {
            return (
              <CustomInput
                key={index}
                type="text"
                placeholder="Department Name"
                name="name"
                icon={<HiOutlineOfficeBuilding />}
                required
                value={department}
                onChange={(e) => handleInputChange(e, index)}
              />
            );
          })}

          <CustomButton
            text="Add"
            buttonProps={AddButtonProps}
            icon={<FaPlus size={18} />}
          />
          <CustomButton text="Add Departments" buttonProps={buttonProps} />
        </form>
      </div>
    </div>
  );
};
export default AddDepartmentForm;
