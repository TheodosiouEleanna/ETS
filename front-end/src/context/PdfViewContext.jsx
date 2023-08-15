// PdfViewContext.js

import { createContext, useReducer, useContext } from "react";
import { aspectRatio } from "../consts";

const PdfViewStateContext = createContext();
const PdfViewDispatchContext = createContext();

const initialPdfViewState = {
  currentPage: 0,
  pageCount: 0,
  pdfDimensions: {
    width: 0,
    height: 0,
    aspectRatio: aspectRatio,
  },
  isInputScroll: false,
};

const pdfViewReducer = (state, action) => {
  let container;
  let scrollTop;
  switch (action.type) {
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
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const PdfViewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pdfViewReducer, initialPdfViewState);

  return (
    <PdfViewStateContext.Provider value={state}>
      <PdfViewDispatchContext.Provider value={dispatch}>
        {children}
      </PdfViewDispatchContext.Provider>
    </PdfViewStateContext.Provider>
  );
};

export const usePdfViewState = () => useContext(PdfViewStateContext);
export const usePdfViewDispatch = () => useContext(PdfViewDispatchContext);
