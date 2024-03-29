import AuthWrapper from "./AuthWrapper";
import React, { useState } from "react";
import CustomInput from "../../Components/common/CustomInput";
import CustomButton from "../../Components/common/CustomButton";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../../hooks/useRequest";
import { useDispatch } from "react-redux";
import { login } from "../../store/auth-slice";
import { BASE_URL } from "../../consts";
import Cookies from "js-cookie";
import { toast } from "sonner";

const Login = () => {
  const { sendRequest } = useRequest();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      toast.error("Invalid Credentials, Try Again");
    }
    else {
      dispatch(
        login({userId:response.userId, orgId:response.orgId,token: response.token})
      );
      Cookies.set("token", response.token, { expires: 7 });
      Cookies.set("userId", response.userId);
      Cookies.set("orgId", response.orgId);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }
  };

  const buttonProps = {
    type: "button",
    onClick: submitHandler,
    style: { width: "100%" },
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
