import React, { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { aspectRatio } from "../consts";

const initialState = {
  file: { size: 0 },
  selectedDocID: localStorage.getItem("selectedDocID") || null,
  currentPage: 0,
  pageCount: 0,
  zoom: 0.5,
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
  isInputScroll: false,
  pdfDimensions: {
    width: 0,
    height: 0,
    aspectRatio: aspectRatio,
  },

  // Todo: Add all the initial values
};

const reducer = (state, action) => {
  let container;
  let scrollTop;
  switch (action.type) {
    case "LOAD_FILE":
      return {
        ...state,
        file: action.payload,
        currentPage: 1,
      };
    case "SET_DOCUMENT_ID":
      localStorage.setItem("selectedDocID", action.payload);
      return {
        ...state,
        selectedDocID: action.payload,
      };
    case "GO_TO_PREV_PAGE":
      container = document.getElementById("pdf-container");
      scrollTop = (state.currentPage - 2) * state.pdfDimensions.height;
      container.scrollTop = scrollTop;
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };

    case "GO_TO_NEXT_PAGE":
      container = document.getElementById("pdf-container");
      scrollTop = state.currentPage * state.pdfDimensions.height;
      container.scrollTop = scrollTop;
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    case "SET_PAGE_COUNT":
      return {
        ...state,
        pageCount: action.payload,
      };
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };
    case "CHANGE_ZOOM":
      return {
        ...state,
        zoom: action.payload / 100,
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
    case "SET_PAGE_INPUT_FOCUS":
      return {
        ...state,
        pageInputFocused: action.payload,
      };
    case "SET_PDF_DIMENSIONS":
      return {
        ...state,
        pdfDimensions: {
          ...state.pdfDimensions,
          ...action.payload,
        },
      };
    case "SET_INPUT_SCROLL":
      return {
        ...state,
        isInputScroll: action.payload,
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

  const setSelectedDocID = (id) => {
    dispatch({ type: "SET_DOCUMENT_ID", payload: id });
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

  const setCurrentPage = (pagesCount) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: parseInt(pagesCount) });
  };

  const handleZoomChange = (zoom) => {
    dispatch({ type: "CHANGE_ZOOM", payload: parseInt(zoom) });
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

  const setPdfDimensions = (dimensions) => {
    dispatch({ type: "SET_PDF_DIMENSIONS", payload: dimensions });
  };

  const setInputScroll = (isInputScroll) => {
    dispatch({ type: "SET_INPUT_SCROLL", payload: isInputScroll });
  };
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    console.log("mpikeee");
    if (state.file.size === 0 && state.selectedDocID) {
      setLoading(true);
      axios
        .get("http://localhost:5000/api/get_file", {
          params: {
            docID: state.selectedDocID,
          },
          responseType: "blob",
        })
        .then((response) => {
          const fileBlob = new Blob([response.data], {
            type: response.data.type,
          });

          loadFile(fileBlob);
          setLoading(false);
        })
        .catch((error) => {
          alert("Failed to load file.");
          setLoading(false);
        });
    }
  }, [state.file.size, state.selectedDocID]);

  const contextValue = {
    zoom: state.zoom,
    file: state.file,
    selectedDocID: state.selectedDocID,
    setSelectedDocID,
    currentPage: state.currentPage,
    setCurrentPage,
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
    pageInputFocused: state.pageInputFocused,
    isInputScroll: state.isInputScroll,
    setInputScroll,
    pdfDimensions: state.pdfDimensions,
    setPdfDimensions,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
