// UserContext.js

import { createContext, useReducer, useContext } from "react";

const UserStateContext = createContext();
const UserDispatchContext = createContext();

const initialUserState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")),
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_SESSION":
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case "LOGOUT":
      localStorage.removeItem("userInfo");
      return { ...state, userInfo: { isLoggedIn: false } };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export const useUserState = () => useContext(UserStateContext);
export const useUserDispatch = () => useContext(UserDispatchContext);
