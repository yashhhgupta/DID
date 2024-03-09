import styles from "./styles.module.css";
import { Modal } from "../../common";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { useRef } from "react";
import Logo from "../../../assets/logo.png";
import { FiLogOut } from "react-icons/fi";
import classNames from "classnames";
import options from "./utls";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/auth-slice";
import Cookies from "js-cookie";

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
};

const Sidebar = ({ isOpen, sidebarCloseHandler }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    sidebarCloseHandler();
  });
  const LogoutHandler = () => {
    dispatch(logout());
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("orgId");
    sidebarCloseHandler();
    navigate("/");
  };

  return (
    <Modal isOpen={isOpen}>
      <div className={styles.sidebar} ref={containerRef}>
        <div className={styles.sidebarTop}>
          <div className={styles.logoWrapper}>
            <img src={Logo} alt="logo" />
          </div>
          <div className={styles.options}>
            {options.map((option, index) => (
              <Tab
                key={index}
                option={option}
                sidebarCloseHandler={sidebarCloseHandler}
              />
            ))}
          </div>
        </div>
        <div
          className={classNames(styles.tab, styles.logout)}
          onClick={LogoutHandler}
        >
          <FiLogOut />
          Logout
        </div>
      </div>
    </Modal>
  );
};
export default Sidebar;
