import AuthWrapper from "./AuthWrapper";
import React, { useState } from "react";
import CustomInput from "../../Components/common/CustomInput";
import CustomButton from "../../Components/common/CustomButton";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../../hooks/useRequest";
import { useAuth } from "../../context/authcontext";
import { BASE_URL } from "../../consts";


const Login = () => {
  const {sendRequest} = useRequest();
  const navigate = useNavigate();
  const {login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    // console.log(formData);
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

    if (!formData.password.trim()) {
      alert("Please enter your password.");
      return;
    }

    if (formData.password.trim().length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    //if isAdmin is checked, then login as admin
    let url = BASE_URL;
    if (formData.isAdmin) { 
      url += "/admin/login";
    }
    else {
      url += "/user/login";
    }
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
      {
        "Content-Type": "application/json",
      }
    );
    if (!response) {
      alert("Invalid Credentials, Try Again");
    }
    else {
      login(response.userId,formData.isAdmin, response.token);
      navigate("/dashboard");
    }
  };

  const buttonProps = {
    type: "button",
    onClick: submitHandler,
  };

  return (
    <AuthWrapper>
      <div className={styles.formcontainer}>
        <form className={styles.form}>
          <h1 style={{ textAlign: "center" }}>Login Account</h1>
          <CustomInput
            icon={<AiOutlineMail />}
            type={"text"}
            name="email"
            placeholder={"Enter your Email"}
            value={formData.email}
            onChange={handleInputChange}
          />
          <CustomInput
            icon={<AiFillLock />}
            type={"password"}
            name="password"
            placeholder={"Enter your Password"}
            value={formData.password}
            onChange={handleInputChange}
          />
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleInputChange}
              className={styles.checkbox}
              style={{ cursor: "pointer" }}
            ></input>
            {"  "}
            Login as admin
          </label>
          <CustomButton text="Submit" buttonProps={buttonProps} />
        </form>
        <div className={styles.addOrg} onClick={() => {
          navigate("/signup");
        }}>Add your Organization</div>
      </div>
    </AuthWrapper>
  );
};

export default Login;
