import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./context/Context";
import { SnackbarProvider } from "./context/SnackbarContext";
import { EyeTrackingProvider } from "./context/EyeTrackingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ContextProvider>
    <SnackbarProvider>
      <EyeTrackingProvider>
        <App />
      </EyeTrackingProvider>
    </SnackbarProvider>
  </ContextProvider>
  // </React.StrictMode>
);
