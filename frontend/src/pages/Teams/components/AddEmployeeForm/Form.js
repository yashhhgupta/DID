import { useState } from "react";
import { CustomButton, CustomInput } from "../../../../Components/common";
import { useRequest } from "../../../../hooks/useRequest";
import { BASE_URL } from "../../../../consts";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import "react-dropdown/style.css";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { useSelector } from "react-redux";

const Form = ({ modalCloseHandler }) => {
  const token = useSelector((state) => state.auth.token);
  const { sendRequest } = useRequest();
  const orgId = useSelector((state) => state.auth.orgId);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    department: "",
  });
  useEffect(() => {
    const getDepartments = async () => {
      let url = BASE_URL + "/department/getAll";
      const response = await sendRequest(
        url,
        "POST",
        JSON.stringify({
          orgId: orgId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      let tempOptions = response.departments.map((department) => {
        return {
          value: department._id,
          label: department.name,
        };
      });
      setDepartments(tempOptions);
    };
    getDepartments();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert("Please enter a valid Gmail format email address.");
      return;
    }
    let url = BASE_URL + "/admin/add-employee";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        firstname: formData.firstName,
        email: formData.email,
        orgId: orgId,
        departmentId: formData.department,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      alert("Invalid Credentials, Try Again");
    } else {
      alert("Employee Added Successfully");
      modalCloseHandler();
    }
  };
  const buttonProps = {
    type: "button",
    onClick: submitHandler,
    style: { width: "100%" },
  };

  return (
    <form>
      <h1>Add Employee</h1>
      <CustomInput
        type="text"
        placeholder="First Name"
        name="firstName"
        icon={<AiOutlineUser />}
        required
        value={formData.firstName}
        onChange={handleInputChange}
      />
      <CustomInput
        type="email"
        placeholder="Email"
        name="email"
        icon={<AiOutlineMail />}
        required
        value={formData.email}
        onChange={handleInputChange}
      />
      <Dropdown
        options={departments}
        onChange={(selectedOption) => {
          setFormData((prevData) => ({
            ...prevData,
            department: selectedOption.value, // Assuming the value is the department ID
          }));
        }}
        value={formData.department}
        placeholder="Select an option"
      />
      <CustomButton text="Add Employee" buttonProps={buttonProps} />
    </form>
  );
};
export default Form;
