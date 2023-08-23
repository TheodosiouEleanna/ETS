import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { apiURL } from "../consts";
import { IAction, IContextState, IEyeTracker, IFile, IUserInfo, IUserSettings } from "types/AppTypes";
import React from "react";
import { initEyeTracker, initFile, initPdfDimensions, initSettings, initUserInfo } from "utils/initData";

const selectedDocID = localStorage.getItem("selectedDocID") || "";

const userInfoFromStorage = localStorage.getItem("userInfo");
const userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage) : initUserInfo;

const userSettingsFromStorage = localStorage.getItem("userSettingsUi");
const userSettingsUi = userSettingsFromStorage ? JSON.parse(userSettingsFromStorage) : initSettings;

const eyeTrackerFromStorage = localStorage.getItem("eyeTracker");
const selectedEyeTracker = eyeTrackerFromStorage ? JSON.parse(eyeTrackerFromStorage) : initEyeTracker;

const initialState: IContextState = {
  file: initFile,
  selectedDocID,
  currentPage: 0,
  pageCount: 0,
  loading: false,
  pdfDimensions: initPdfDimensions,
  userInfo,
  userSettingsApi: initSettings,
  userSettingsUi,
  isMenuOpen: false,
  selectedEyeTracker,
  isEyeTrackerConnected: false,
};

const reducer = (state: IContextState, action: IAction): IContextState => {
  let container: HTMLElement | null;
  let scrollTop: number;
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
      if (container) {
        scrollTop = (state.currentPage - 2) * state.pdfDimensions.height;
        container.scrollTop = scrollTop;
      }
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };

    case "GO_TO_NEXT_PAGE":
      container = document.getElementById("pdf-container");
      if (container) {
        scrollTop = state.currentPage * state.pdfDimensions.height;
        container.scrollTop = scrollTop;
      }
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
      localStorage.setItem("userSettingsUi", JSON.stringify({ ...state.userSettingsUi, ...action.payload }));
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
        isEyeTrackerConnected: true,
      };
    case "LOGOUT":
      localStorage.removeItem("userInfo");
      return {
        ...state,
        userInfo: initUserInfo,
      };
    default:
      return state;
  }
};

export const Context = createContext<Partial<IContextState>>({});

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log({ state });

  // -------------------- DOCUMENT ACTIONS -----------------------

  const loadFile = (file: IFile) => {
    dispatch({ type: "LOAD_FILE", payload: file });
  };

  const setSelectedDocID = (id: string) => {
    dispatch({ type: "SET_DOCUMENT_ID", payload: id });
  };

  const setCurrentPage = (pageCount: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pageCount });
  };

  const setPageCount = (pageCount: number) => {
    dispatch({ type: "SET_PAGE_COUNT", payload: pageCount });
  };

  const setPdfDimensions = (dimensions: { width: number; height: number }) => {
    dispatch({ type: "SET_PDF_DIMENSIONS", payload: dimensions });
  };

  const goToNextPage = (pageNumber: string) => {
    dispatch({ type: "GO_TO_NEXT_PAGE", payload: parseInt(pageNumber) });
  };

  const goToPrevPage = (pageNumber: string) => {
    dispatch({ type: "GO_TO_PREV_PAGE", payload: parseInt(pageNumber) });
  };
  // -------------------- OTHER ACTIONS -----------------------

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setUserInfo = (userInfo: IUserInfo) => {
    dispatch({ type: "SET_SESSION", payload: userInfo });
  };

  const setUserSettingsUi = (userSettings: IUserSettings) => {
    dispatch({ type: "SET_USER_SETTINGS_UI", payload: userSettings });
  };
  const setUserSettingsApi = (userSettings: IUserSettings) => {
    dispatch({ type: "SET_USER_SETTINGS_API", payload: userSettings });
  };

  const setIsMenuOpen = (isOpen: boolean) => {
    dispatch({ type: "SET_IS_MENU_OPEN", payload: isOpen });
  };

  const setSelectedEyeTracker = (eyeTracker: IEyeTracker) => {
    dispatch({ type: "SET_SELECTED_EYE_TRACKER", payload: eyeTracker });
  };

  const setIsEyeTrackerConnected = (isConnected: boolean) => {
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
    file: state.file,
    selectedDocID: state.selectedDocID,
    setSelectedDocID,
    currentPage: state.currentPage,
    setCurrentPage,
    pageCount: state.pageCount,
    setPageCount,
    loadFile,
    isLoggedIn: state.userInfo.isLoggedIn,
    userInfo: state.userInfo,
    setUserInfo,
    loading: state.loading,
    setLoading,
    logout,
    userSettingsUi: state.userSettingsUi,
    setUserSettingsUi,
    userSettingsApi: state.userSettingsApi,
    setUserSettingsApi,
    pdfDimensions: state.pdfDimensions,
    setPdfDimensions,
    goToNextPage,
    goToPrevPage,
    isMenuOpen: state.isMenuOpen,
    setIsMenuOpen,
    selectedEyeTracker: state.selectedEyeTracker,
    setSelectedEyeTracker,
    isEyeTrackerConnected: state.isEyeTrackerConnected,
    setIsEyeTrackerConnected,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
