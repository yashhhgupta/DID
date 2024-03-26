import React, { useRef } from "react";
import { CustomButton, CustomInput } from "../../../Components/common";
import styles from "./styles.module.css";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { AiFillLock } from "react-icons/ai";
import { useState } from "react";
import { toast } from "sonner";
import { BASE_URL } from "../../../consts";
import { useDispatch, useSelector } from "react-redux";
import { useRequest } from "../../../hooks/useRequest";

const ChangePassword = ({ modalCloseHandler }) => {
  const dispatch = useDispatch();
  const { sendRequest } = useRequest();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    modalCloseHandler();
  });
  const [password, setPassword] = useState({
    old: "",
    new: "",
  });
  const submitHandler = async () => {
    if (!password.old.trim() || !password.new.trim()) {
      toast.error("Please enter old and new password.");
      return;
    }
    //length of password should be atleast 8
    if (password.new.length < 8) {
      toast.error("Password should be atleast 8 characters long.");
      return;
    }
    //should not be same as old password
    if (password.old === password.new) {
      toast.error("New password should not be same as old password.");
      return;
    }

    let url = BASE_URL + "/user/updatePassword";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        userId: userId,
        oldPassword: password.old,
        newPassword: password.new,
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
      modalCloseHandler();
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.form} ref={containerRef}>
        <form>
          <h1>Change Password</h1>
          <CustomInput
            icon={<AiFillLock />}
            type={"password"}
            name="password"
            label={"Old Password"}
            placeholder={"Enter Old Password"}
            value={password.old}
            onChange={(e) => {
              setPassword({ ...password, old: e.target.value });
            }}
          />
          <CustomInput
            icon={<AiFillLock />}
            type={"password"}
            name="password"
            label={"New Password"}
            placeholder={"Enter New Password"}
            value={password.new}
            onChange={(e) => setPassword({ ...password, new: e.target.value })}
          />

          <CustomButton
            text="Update Password"
            buttonProps={{
              type: "button",
              onClick: submitHandler,
              style: { width: "100%" },
            }}
          />
        </form>
      </div>
    </div>
  );
};
export default ChangePassword;
