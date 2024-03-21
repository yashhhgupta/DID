import AuthWrapper from "./AuthWrapper";
import React from "react";
import { CustomInput, CustomButton } from "../../Components/common";
import { AiOutlineMail, AiFillLock, AiOutlineUser } from "react-icons/ai";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom"; 
import { useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { BASE_URL } from "../../consts";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const { sendRequest } = useRequest();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e) => { 
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid Gmail format email address.");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    if (formData.password.trim().length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    //if isAdmin is checked, then login as admin
    let url = BASE_URL+"/admin/signup";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
      {
        "Content-Type": "application/json",
      }
    );
    if (!response) {
      toast.error("Invalid Credentials, Try Again");
    }
    else {
      toast.success("Organization Added Successfully, Login to continue.");
      navigate("/");
    }
  };
  const buttonProps = {
    type: "button",
    onClick: submitHandler,
  style: { width: "100%" }
  };
  return (
    <AuthWrapper>
      <div className={styles.formcontainer}>
        <form className={styles.form}>
          <h1 style={{ textAlign: "center" }}>Add Organization</h1>
          <CustomInput
            icon={<AiOutlineUser />}
            type={"text"}
            placeholder={"Organization Name"}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <CustomInput
            icon={<AiOutlineMail />}
            type={"text"}
            placeholder={"Enter your Email"}
            value={formData.email}
            name="email"
            onChange={handleInputChange}
          />
          <CustomInput
            icon={<AiFillLock />}
            type={"password"}
            placeholder={"Enter your Password"}
            value={formData.password}
            onChange={handleInputChange}
            name="password"
          />
          <CustomButton text="Submit" buttonProps={buttonProps} />
        </form>
        <div
          className={styles.addOrg}
          onClick={() => {
            navigate("/");
          }}
        >
          Login as User/Admin
        </div>
      </div>
    </AuthWrapper>
  );
};
export default Signup;
