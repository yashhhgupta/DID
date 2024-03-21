import React from "react";
import { Toaster } from 'sonner'
 
const Notification = () => {
  return (
    <Toaster
      position="top-center"
      duration={1500}
      richColors
      toastOptions={{
        style: {
          height: "70px",
          fontSize: "1.05rem",
          backgroundColor: "#0359E0",
          color: "white",
        },
      }}
    />
  );
};
 
export default Notification;
 