import React from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { CustomButton } from "../../../Components/common";
import styles from "./styles.module.css";
import { ConfirmationPopUp, Modal } from "../../../Components/common";
import { BASE_URL } from "../../../consts";
import { useAuth } from "../../../context/authcontext";
import Cookies from "js-cookie";
import { useRequest } from "../../../hooks/useRequest";

const CsvUpload = ({ closeModal }) => {
  const token = Cookies.get("token");
  const { sendRequest } = useRequest();
  const { orgId } = useAuth();
  const [file, setFile] = useState(null);
  const [modal, setModal] = useState(false);
  const [employeesToAdd, setEmployeesToAdd] = useState([]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const modalCloseHandler = () => {
    setModal(false);
  };
  const handleUpload = async (e) => {
    e.stopPropagation();
    if (!file) {
      alert("Please select a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Assuming you want to convert the first sheet
      const json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setEmployeesToAdd(json_data);
    };

    reader.readAsArrayBuffer(file);
    setModal(true);
  };
  const handleSubmit = async () => {
    console.log(employeesToAdd);
    let url = BASE_URL + "/admin/add-employees";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        employees: employeesToAdd,
        orgId: orgId,
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
      closeModal();
    }
  };
  const buttonProps = {
    type: "button",
    onClick: handleUpload,
    style: { width: "100%" },
  };
  return (
    <>
      <Modal isOpen={modal}>
        <ConfirmationPopUp
          title="Add Employee"
          subTitle="Do you want to add 400 employe"
          onCancel={modalCloseHandler}
          onConfirm={handleSubmit}
          modalCloseHandler={modalCloseHandler}
        />
      </Modal>
      <form className={styles.csvform}>
        <h1>Add Multiple Employees</h1>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
          className={styles.file_input}
        />
        <CustomButton text="Upload" buttonProps={buttonProps} />
      </form>
    </>
  );
};

export default CsvUpload;
