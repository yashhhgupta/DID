import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orgId, setOrgId] = useState(null);

  const login = (id, orgId, token) => {
    setUserID(id);
    setOrgId(orgId);
    setIsLoggedIn(true);
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("userId", id);
    Cookies.set("orgId", orgId);
    setIsAdmin(id==orgId);
  };

  const logout = () => {
    setUserID(null);
    setOrgId(null);
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("orgId");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isloggedIn,userID, login, logout,isAdmin,orgId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
