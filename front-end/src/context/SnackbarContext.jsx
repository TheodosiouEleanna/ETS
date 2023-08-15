import React, { createContext, useState } from "react";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    status: "",
    open: false,
  });

  const closeSnackbar = () => {
    setSnackbarData((prevData) => ({ ...prevData, open: false }));
  };

  const triggerSnackbar = (newData) => {
    // closeSnackbar();
    setTimeout(() => {
      setSnackbarData({ ...newData, open: true });
    }, 100);
  };

  return (
    <SnackbarContext.Provider
      value={{ snackbarData, triggerSnackbar, closeSnackbar }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};
