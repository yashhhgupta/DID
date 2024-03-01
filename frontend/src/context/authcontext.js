import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (id,isAdmin,token) => {
    setUserID(id);
    setIsLoggedIn(true);
    Cookies.set("token", token, { expires: 7 });
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    setUserID(null);
    Cookies.remove("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isloggedIn,userID, login, logout,isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
