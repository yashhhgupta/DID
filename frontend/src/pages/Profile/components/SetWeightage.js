import { Card, CustomInput, CustomButton,Modal,ConfirmationPopUp } from "../../../Components/common";
import { userAttributesOptions } from "./utlils";
import styles from "../styles.module.css";
import { useState } from "react";
import { BASE_URL } from "../../../consts";
import { useRequest } from "../../../hooks/useRequest";
import { useSelector } from "react-redux";
import { toast } from "sonner";
const SetWeightage = ({ weightage }) => {
  const { sendRequest } = useRequest();
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const [showModal, setShowModal] = useState(false);
  const modalCloseHandler = () => { 
    setShowModal(false);
  }
  const [weightageForm, setWeightageForm] = useState({
    ...weightage,
  });
  const HandleSubmit = (e) => {
    e.stopPropagation();
    //if weightage and weightageForm are same then no need to update
    if (JSON.stringify(weightage) === JSON.stringify(weightageForm)) {
      toast.error("No changes made");
      return;
    }
    //sum of all weightage should be 100
    let sum = 0;
    for (let key in weightageForm) {
      sum += +weightageForm[key];
    }
    if (sum !== 100) {
      toast.error("Sum of all weightage should be 100");
      return;
    }
    //update weightage
    setShowModal(true);
  }
  const UpdateWeightage = async () => { 
    const response = await sendRequest(
      BASE_URL + "/admin/updateProfile",
      "POST",
      JSON.stringify({
        dataToUpdate: { weightage: weightageForm },
        orgId: orgId,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      toast.error("Weightage Update Failed,please try again later.");
    } else {
      toast.success("Weightage Updated");
      setShowModal(false);
    }
  }
  return (
    <>
      <Modal isOpen={showModal}>
        <ConfirmationPopUp
          title="Update Weightage"
          subTitle={`Do you really want to update the weightage?`}
          onCancel={modalCloseHandler}
          onConfirm={UpdateWeightage}
          modalCloseHandler={modalCloseHandler}
        />
      </Modal>
      <div className={styles.heading}>
        <h1>WEIGHTAGE</h1>
        <div className={styles.buttons}>
          <CustomButton
            text="Update"
            buttonProps={{
              type: "button",
              onClick: HandleSubmit,
              disabled:
                JSON.stringify(weightage) === JSON.stringify(weightageForm),
            }}
          />
        </div>
      </div>
      <Card>
        <div className={styles.diversityOptions}>
          {userAttributesOptions.map((option,index) => {
            return (
              <div key={index}>
                <CustomInput
                  type="number"
                  label={option.title}
                  value={weightageForm[option.value]}
                  onChange={(e) => {
                    setWeightageForm({
                      ...weightageForm,
                      [option.value]: e.target.value,
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};
export default SetWeightage;
