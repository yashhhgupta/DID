import styles from "./styles.module.css";
import Modal from "../../common/Modal";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { useRef } from "react";
import Logo from "../../../assets/logo.png";
import { FiLogOut } from "react-icons/fi";
import classNames from "classnames";
import options from "./utls";
import { useNavigate } from "react-router-dom";

const Tab = ({ option, sidebarCloseHandler }) => {
  const navigate = useNavigate();
  const tabClickHandler = () => {
    sidebarCloseHandler();
    navigate(option.redirect);
  };
  return (
    <div className={styles.tab} onClick={tabClickHandler}>
      {option.icon}
      <span>{option.title}</span>
    </div>
  );
}

const Sidebar = ({ isOpen, sidebarCloseHandler }) => {
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    sidebarCloseHandler();
  });
  
  return (
    <Modal isOpen={isOpen}>
      <div className={styles.sidebar} ref={containerRef}>
        <div className={styles.sidebarTop}>
          <div className={styles.logoWrapper}>
            <img src={Logo} alt="logo" />
          </div>
          <div className={styles.options}>
            {options.map((option, index) => (
              <Tab key={index} option={option} sidebarCloseHandler={ sidebarCloseHandler} />
            ))}
          </div>
        </div>
        <div className={classNames({
          [styles.tab]: true,
          [styles.logout]: true
        })}>
          <FiLogOut />
          Logout
        </div>
      </div>
    </Modal>
  );
};
export default Sidebar;