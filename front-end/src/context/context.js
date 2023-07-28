import React, { createContext, useEffect, useReducer } from "react";

const initialState = {
  file: { size: 0 },
  currentPage: 0,
  pageCount: 0,
  zoom: 100,
  loading: false,
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || {
    isLoggedIn: false,
    userID: null,
    username: "",
  },
  userSettings: JSON.parse(localStorage.getItem("userSettings")) || {
    language: "English",
    theme: "dark",
    zoomLevel: 1,
  },
  // Todo: Add all the initial values
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FILE":
      return {
        ...state,
        file: action.payload,
        currentPage: 1,
      };
    case "GO_TO_PREV_PAGE":
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };

    case "GO_TO_NEXT_PAGE":
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    case "SET_PAGE_COUNT":
      return {
        ...state,
        pageCount: action.payload,
      };

    case "CHANGE_ZOOM":
      return {
        ...state,
        zoom: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_SESSION":
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return {
        ...state,
        userInfo: action.payload,
      };
    case "SET_USER_SETTINGS":
      localStorage.setItem("userSettings", JSON.stringify(action.payload));
      return {
        ...state,
        userSettings: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("userInfo");
      return {
        ...state,
        userInfo: { isLoggedIn: false },
      };
    default:
      return state;
  }
};

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log({ state });

  const loadFile = (file) => {
    dispatch({ type: "LOAD_FILE", payload: file });
  };

  const goToNextPage = (pageNumber) => {
    dispatch({ type: "GO_TO_NEXT_PAGE", payload: parseInt(pageNumber) });
  };

  const goToPrevPage = (pageNumber) => {
    dispatch({ type: "GO_TO_PREV_PAGE", payload: parseInt(pageNumber) });
  };

  const setPageCount = (pagesCount) => {
    dispatch({ type: "SET_PAGE_COUNT", payload: parseInt(pagesCount) });
  };

  const handleZoomChange = (zoom) => {
    dispatch({ type: "CHANGE_ZOOM", payload: parseInt(zoom * 100) });
  };

  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setUserInfo = (userInfo) => {
    dispatch({ type: "SET_SESSION", payload: userInfo });
  };

  const setUserSettings = (userSettings) => {
    dispatch({ type: "SET_USER_SETTINGS", payload: userSettings });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const contextValue = {
    zoom: state.zoom,
    file: state.file,
    currentPage: state.currentPage,
    pageCount: state.pageCount,
    setPageCount,
    loadFile,
    isLoggedIn: state.isLoggedIn,
    userInfo: state.userInfo,
    setUserInfo,
    loading: state.loading,
    setLoading,
    logout,
    goToNextPage,
    goToPrevPage,
    handleZoomChange,
    userSettings: state.userSettings,
    setUserSettings,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
