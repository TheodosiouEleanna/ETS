import React, { createContext, useEffect, useReducer } from "react";

const initialState = {
  file: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FILE":
      return {
        ...state,
        file: action.payload,
      };

    default:
      return state;
  }
};

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadFile = (file) => {
    dispatch({ type: "LOAD_FILE", payload: file });
  };

  const contextValue = {
    file: state.file,
    loadFile,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
