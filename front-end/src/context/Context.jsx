import React, { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { apiURL, aspectRatio } from "../consts";

const initialState = {
  file: { size: 0 },
  selectedDocID: localStorage.getItem("selectedDocID") || null,
  currentPage: 0,
  pageCount: 0,
  loading: false,
  pdfDimensions: {
    width: 0,
    height: 0,
    aspectRatio: aspectRatio,
  },
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || {
    isLoggedIn: false,
  },
  userSettingsApi: {},
  userSettingsUi: JSON.parse(localStorage.getItem("userSettingsUi")) || {
    language: "English",
    theme: "light",
    zoom: 0.5,
  },
  isMenuOpen: false,
  selectedEyeTracker: localStorage.getItem("eyeTracker") || { device_name: "" },
  isEyeTrackerConnected: false,
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
    case "SET_USER_SETTINGS_UI":
      localStorage.setItem(
        "userSettingsUi",
        JSON.stringify({ ...state.userSettingsUi, ...action.payload })
      );
      return {
        ...state,
        userSettingsUi: { ...state.userSettingsUi, ...action.payload },
      };
    case "SET_USER_SETTINGS_API":
      return {
        ...state,
        userSettingsApi: { ...state.userSettingsApi, ...action.payload },
      };
    case "SET_PDF_DIMENSIONS":
      return {
        ...state,
        pdfDimensions: {
          ...state.pdfDimensions,
          ...action.payload,
        },
      };
    case "SET_IS_MENU_OPEN":
      return {
        ...state,
        isMenuOpen: action.payload,
      };
    case "SET_SELECTED_EYE_TRACKER":
      localStorage.setItem("eyeTracker", JSON.stringify(action.payload));
      return {
        ...state,
        selectedEyeTracker: action.payload,
      };
    case "SET_IS_EYE_TRACKER_CONNECTED":
      return {
        ...state,
        isEyeTrackerConnected: action.payload,
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

  // -------------------- DOCUMENT ACTIONS -----------------------
  const loadFile = (file) => {
    dispatch({ type: "LOAD_FILE", payload: file });
  };

  const setSelectedDocID = (id) => {
    dispatch({ type: "SET_DOCUMENT_ID", payload: id });
  };

  const setPdfDimensions = (dimensions) => {
    dispatch({ type: "SET_PDF_DIMENSIONS", payload: dimensions });
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

  // -------------------- OTHER ACTIONS -----------------------

  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setUserInfo = (userInfo) => {
    dispatch({ type: "SET_SESSION", payload: userInfo });
  };

  const setUserSettingsUi = (userSettings) => {
    dispatch({ type: "SET_USER_SETTINGS_UI", payload: userSettings });
  };
  const setUserSettingsApi = (userSettings) => {
    dispatch({ type: "SET_USER_SETTINGS_API", payload: userSettings });
  };

  const setIsMenuOpen = (isOpen) => {
    dispatch({ type: "SET_IS_MENU_OPEN", payload: isOpen });
  };

  const setSelectedEyeTracker = (eyeTracker) => {
    dispatch({ type: "SET_SELECTED_EYE_TRACKER", payload: eyeTracker });
  };

  const setIsEyeTrackerConnected = (isConnected) => {
    dispatch({ type: "SET_IS_EYE_TRACKER_CONNECTED", payload: isConnected });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    if (state.file && state.file.size === 0 && state.selectedDocID) {
      setLoading(true);
      axios
        .get(`${apiURL}/get_file`, {
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
  }, [state.file, state.file?.size, state.selectedDocID]);

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
    pageInputFocused: state.pageInputFocused,
    userSettingsUi: state.userSettingsUi,
    setUserSettingsUi,
    userSettingsApi: state.userSettingsApi,
    setUserSettingsApi,
    pdfDimensions: state.pdfDimensions,
    setPdfDimensions,
    isMenuOpen: state.isMenuOpen,
    setIsMenuOpen,
    selectedEyeTracker: state.selectedEyeTracker,
    setSelectedEyeTracker,
    isEyeTrackerConnected: state.isEyeTrackerConnected,
    setIsEyeTrackerConnected,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
