import React, { createContext, useEffect, useReducer } from "react";

const initialState = {
  file: { size: 0 },
  currentPage: 1,
  pageCount: 0,
  zoom: 100,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FILE":
      return {
        ...state,
        file: action.payload,
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

  const contextValue = {
    zoom: state.zoom,
    file: state.file,
    currentPage: state.currentPage,
    pageCount: state.pageCount,
    setPageCount,
    loadFile,
    loading: state.loading,
    setLoading,
    goToNextPage,
    goToPrevPage,
    handleZoomChange,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
