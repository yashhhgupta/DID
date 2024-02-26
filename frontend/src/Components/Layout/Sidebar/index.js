import styles from "./styles.module.css";
import Modal from "../../common/Modal";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { useRef } from "react";
import Logo from "../../../assets/logo.png";
import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import classNames from "classnames";

const options = [
  {
    title: "Home",
    icon : <FaHome />
  },
  {
    title: "Dashboard",
    icon : <MdDashboard />
  },
  {
    title: "Teams",
    icon: <MdGroups />
  }
]

const Tab = ({option}) => {
  return (
    <div className={styles.tab}>
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
              <Tab key={index} option={option} />
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