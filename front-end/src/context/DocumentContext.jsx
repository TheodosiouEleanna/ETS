import { createContext, useReducer, useContext } from "react";

const DocumentStateContext = createContext();
const DocumentDispatchContext = createContext();

const initialDocumentState = {
  file: { size: 0 },
  selectedDocID: localStorage.getItem("selectedDocID") || null,
};

const documentReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FILE":
      return { ...state, file: action.payload };
    case "SET_DOCUMENT_ID":
      localStorage.setItem("selectedDocID", action.payload);
      return { ...state, selectedDocID: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialDocumentState);

  return (
    <DocumentStateContext.Provider value={state}>
      <DocumentDispatchContext.Provider value={dispatch}>
        {children}
      </DocumentDispatchContext.Provider>
    </DocumentStateContext.Provider>
  );
};

export const useDocumentState = () => {
  const context = useContext(DocumentStateContext);
  if (context === undefined) {
    throw new Error("useDocumentState must be used within a DocumentProvider");
  }
  return context;
};

export const useDocumentDispatch = () => {
  const context = useContext(DocumentDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useDocumentDispatch must be used within a DocumentProvider"
    );
  }
  return context;
};
