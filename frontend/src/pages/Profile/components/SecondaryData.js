import { Card } from "../../../Components/common";
import { userAttributesOptions } from "./utlils";
import Select from "react-select";
import styles from "../styles.module.css";
import { customStyles } from "../../../consts";
import { useState } from "react";
const SecondaryData = ({ user }) => {
  const {
    gender,
    sexualOrientation,
    disabilityStatus,
    married,
    parentalStatus,
    religion,
    ethnicity,
    geographicalLocation,
    workExperience,
    generationalDiversity,
  } = user;
  const [secondaryData, setSecondaryData] = useState({
    gender: gender || "",
    sexualOrientation: sexualOrientation || "",
    disabilityStatus: disabilityStatus || "",
    married: married || "",
    parentalStatus: parentalStatus || "",
    religion: religion || "",
    geographicalLocation: geographicalLocation || "",
    ethnicity: ethnicity || "",
    workExperience: workExperience || "",
    generationalDiversity: generationalDiversity || "",
  });
  console.log(secondaryData);
  return (
    <Card>
      <div className={styles.diversityOptions}>
        {userAttributesOptions.map((attribute) => {
          const value = secondaryData[attribute.value]
            ? {
                label: secondaryData[attribute.value],
                value: secondaryData[attribute.value],
              }
            : null;
          return (
            <div>
              <label className={styles.input_label}>{attribute.title}</label>
              <Select
                styles={customStyles}
                options={attribute.options}
                onChange={(selectedOption) => {
                  setSecondaryData({
                    ...secondaryData,
                    [attribute.value]: selectedOption.value,
                  });
                }}
                value={value}
                placeholder={`Select ${attribute.title}`}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
export default SecondaryData;
