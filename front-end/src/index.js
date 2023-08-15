import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./context/Context";
import { SnackbarProvider } from "./context/SnackbarContext";
import { DocumentProvider } from "./context/DocumentContext";
import { UserProvider } from "./context/UserContext";
import { UIProvider } from "./context/UiContext";
import { PdfViewProvider } from "./context/PdfViewContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <SnackbarProvider>
        <DocumentProvider>
          <UserProvider>
            <UIProvider>
              <PdfViewProvider>
                <App />
              </PdfViewProvider>
            </UIProvider>
          </UserProvider>
        </DocumentProvider>
      </SnackbarProvider>
    </ContextProvider>
  </React.StrictMode>
);
