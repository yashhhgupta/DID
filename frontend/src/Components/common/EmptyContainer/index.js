import styles from "./styles.module.css";
import Empty from "../../../assets/empty.jpg";
import { CustomButton } from "../index";
const EmptyContainer = ({
  title = "No Data Found",
  description = "Choose another filters to see data",
  confirmButton=undefined,
  cancelButton=undefined,
}) => {
  return (
    <div className={styles.container}>
      <img src={Empty} alt="empty" height={250} />
      <h2>{title}</h2>
      <p>{description}</p>
      <div className={styles.buttons}>
        {cancelButton && (
          <CustomButton
            text={cancelButton.text || "Cancel"}
            buttonProps={{
                type: "button",
                onClick: cancelButton.onClick,
              style: {
                backgroundColor: "rgba(255,0,0,0.1)",
                color: "red",
                padding: "1rem 4rem",
              },
            }}
          />
        )}
        {confirmButton && (
          <CustomButton
            text={confirmButton.text || "Confirm"}
            buttonProps={{
                type: "button",
                onClick: confirmButton.onClick,
              style: {
                backgroundColor: "rgba(0,0,255,0.1)",
                color: "blue",
                padding: "1rem 4rem",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};
export default EmptyContainer;
