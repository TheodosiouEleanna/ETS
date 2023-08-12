import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./context/context";
import { SnackbarProvider } from "./context/SnackbarContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </ContextProvider>
  </React.StrictMode>
);
