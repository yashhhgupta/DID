import React, { useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import styles from "./styles.module.css";
const DepartmentFilter = ({ deps, setFilteredDeps }) => {
  const [selectedDeps, setSelectedDeps] = useState([]);
  const handleDepChange = (e) => {
    const value = e.target.value;
    if (selectedDeps.includes(value)) {
      setSelectedDeps(selectedDeps.filter((dep) => dep !== value));
    } else {
      setSelectedDeps([...selectedDeps, value]);
    }
  };
  useEffect(() => {
    setFilteredDeps(selectedDeps);
  }, [selectedDeps]);
  
  return (
    <div className={styles.buttons}>
      <CustomButton
        text="ALL"
        buttonProps={{
          type: "button",
          onClick: (e) => {
            e.stopPropagation();
            setSelectedDeps([]);
          },
          style: {
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "5px",
            backgroundColor:
              selectedDeps.length === 0
                ? "var(--color-primary)"
                : "var(--color-light)",
            color: selectedDeps.length === 0 ? "var(--color-light)" : "black",
          },
        }}
      />
      {deps.map((dep) => (
        <div key={dep.value}>
          <CustomButton
            text={dep.label.toUpperCase()}
            buttonProps={{
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                handleDepChange({ target: { value: dep.value } });
              },
              style: {
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "5px",
                backgroundColor: selectedDeps.includes(dep.value)
                  ? "var(--color-primary)"
                  : "var(--color-light)",
                color: selectedDeps.includes(dep.value)
                  ? "var(--color-light)"
                  : "black",
              },
            }}
          />
        </div>
      ))}
    </div>
  );
};
export default DepartmentFilter;
