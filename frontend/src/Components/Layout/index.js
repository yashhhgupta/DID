import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import styles from "./styles.module.css";
import { useState } from "react";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOpenHandler = () => {
    
    setSidebarOpen(true);
  };
  const sidebarCloseHandler = () => {
    
    setSidebarOpen(false);
  };
  return (
    <div className={styles.container}>
      {sidebarOpen && (
        <Sidebar
          isOpen={sidebarOpen}
          sidebarCloseHandler={sidebarCloseHandler}
        />
      )}
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Header sidebarOpenHandler={sidebarOpenHandler} />
          <MainContent>{children}</MainContent>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
