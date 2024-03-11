import { Card } from "../../../Components/common";
import { userAttributesOptions } from "./utlils";
import Select from "react-select";
import styles from "../styles.module.css";
import { customStyles } from "../../../consts";
const SecondaryData = ({ user }) => {
  return (
    <Card>
      <div className={styles.diversityOptions}>
        {userAttributesOptions.map((attribute) => {
          return (
            <div>
              <label className={styles.input_label}>{attribute.title}</label>
              <Select
                styles={customStyles}
                options={attribute.options}
                onChange={(selectedOption) => {
                  console.log(selectedOption);
                }}
                value={attribute.options[0]}
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
