import styles from "./styles.module.css";
import { GoSidebarCollapse } from "react-icons/go";
import Logo from "../../../assets/logo.png";
import { FaRegUserCircle } from "react-icons/fa";
const Header = ({ sidebarOpenHandler }) => {
  const handleSidebarClick = (e) => {
    e.stopPropagation(); // Stop the event from propagating to document body
    sidebarOpenHandler();
  };
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <GoSidebarCollapse
          size={25}
          className={styles.logo}
          onClick={handleSidebarClick}
        />
        <div className={styles.logoWrapper}>
          <img src={Logo} alt="logo" />
        </div>
      </div>
      <div className={styles.headerRight}>
        <FaRegUserCircle size={25} className={styles.logo} />
      </div>
    </div>
  );
};
export default Header;
