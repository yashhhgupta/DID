import React from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { CustomButton } from "../../../../Components/common";
import styles from "./styles.module.css";
import { ConfirmationPopUp, Modal } from "../../../../Components/common";
import { BASE_URL } from "../../../../consts";
import { useRequest } from "../../../../hooks/useRequest";
import { useSelector } from "react-redux";

const CsvUpload = ({ closeModal }) => {
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
  const { sendRequest } = useRequest();
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
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setEmployeesToAdd(json_data);
    };
    reader.readAsArrayBuffer(file);
    setModal(true);
  };
  const handleSubmit = async () => {
    // console.log(employeesToAdd);
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
      console.log(response);
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
          subTitle={`Do you really want to add ${employeesToAdd.length} employee`}
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
