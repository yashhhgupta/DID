import styles from "./styles.module.css";
const Modal = ({ isOpen, children }) => {
  
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
        {children}
    </div>
  );
};

export default Modal;
