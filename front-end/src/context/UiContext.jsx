// UIContext.js

import { createContext, useReducer, useContext } from "react";

const UIStateContext = createContext();
const UIDispatchContext = createContext();

const initialUIState = {
  userSettingsUi: JSON.parse(localStorage.getItem("userSettingsUi")) || {
    language: "English",
    theme: "dark",
    zoom: 0.5,
  },
  isMenuOpen: false,
};

const uiReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_SETTINGS_UI":
      localStorage.setItem("userSettingsUi", JSON.stringify(action.payload));
      return { ...state, userSettingsUi: action.payload };
    case "SET_IS_MENU_OPEN":
      return { ...state, isMenuOpen: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  return (
    <UIStateContext.Provider value={state}>
      <UIDispatchContext.Provider value={dispatch}>
        {children}
      </UIDispatchContext.Provider>
    </UIStateContext.Provider>
  );
};

export const useUIState = () => useContext(UIStateContext);
export const useUIDispatch = () => useContext(UIDispatchContext);
