import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  IContextProps,
  IWordPositions,
  IWordPositionsAction,
  IWordPositionsState,
} from "types/AppTypes";
import { Context } from "./Context";
import usePrevious from "hooks/usePrevious";
import { apiURL } from "utils/consts";
import axios from "axios";

interface WordPositionsProviderProps {
  children: ReactNode;
}

const initialWordPositionsState: IWordPositionsState = {
  wordsLoading: false,
  wordPositions: [],
  scaledWordDimensionsPerPage: {
    pageNum: 0,
    wordCoords: { left: 0, top: 0, width: 0, height: 0 },
  },
};

const wordPositionsReducer = (
  state: IWordPositionsState,
  action: IWordPositionsAction
): IWordPositionsState => {
  switch (action.type) {
    case "SET_WORD_LOADING":
      return {
        ...state,
        wordsLoading: action.payload,
      };
    case "SET_WORD_POSITIONS":
      return {
        ...state,
        wordPositions: action.payload,
      };
    case "SET_WORD_DIMENSIONS":
      return {
        ...state,
        scaledWordDimensionsPerPage: action.payload,
      };
    default:
      return state;
  }
};

export const WordPositionsContext = createContext(initialWordPositionsState);

export const WordPositionsProvider: React.FC<WordPositionsProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    wordPositionsReducer,
    initialWordPositionsState
  );
  const { userInfo, userSettingsApi, selectedDocID } =
    useContext<IContextProps>(Context);

  const prevZoom = usePrevious(userSettingsApi.zoom);
  const prevDoc = usePrevious(selectedDocID);
  const setWordsLoading = (wordsLoading: boolean) => {
    dispatch({ type: "SET_WORD_LOADING", payload: wordsLoading });
  };

  const setWordPositions = (
    wordPositions: { data: IWordPositions[]; page: number }[]
  ) => {
    dispatch({ type: "SET_WORD_POSITIONS", payload: wordPositions });
  };

  const setScaledWordDimensionsPerPage = ({
    pageNum,
    wordCoords,
  }: {
    pageNum: number;
    wordCoords: { left: number; top: number; width: number; height: number };
  }) => {
    dispatch({ type: "SET_WORD_DIMENSIONS", payload: { pageNum, wordCoords } });
  };

  useEffect(() => {
    if (
      userInfo.userID &&
      prevZoom &&
      (selectedDocID !== prevDoc ||
        userSettingsApi.zoom !== prevZoom ||
        performance.navigation.type === performance.navigation.TYPE_RELOAD ||
        performance.navigation.type === performance.navigation.TYPE_NAVIGATE)
    ) {
      setWordsLoading(true);
      axios
        .get(`${apiURL}/words-positions`, {
          params: {
            docID: selectedDocID,
            userID: userInfo.userID,
          },
        })
        .then((response) => {
          console.log({ response });
          setWordPositions(response.data.data);
        })
        .catch((error) => {
          alert("Failed to get words positions.");
        })
        .finally(() => {
          setWordsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevDoc, prevZoom, userInfo.userID]);

  // console.log({prevZoom: !!prevZoom, orevDoc: !!prevDoc, or: selectedDocID !== prevDoc || userSettingsApi.zoom !== prevZoom || performance.navigation.type === performance.navigation.TYPE_RELOAD, userID: userInfo.userID, zoom: userSettingsApi.zoom})

  const contextValue = {
    wordsLoading: state.wordsLoading,
    wordPositions: state.wordPositions,
    scaledWordDimensionsPerPage: state.scaledWordDimensionsPerPage,
    setWordPositions,
    setScaledWordDimensionsPerPage,
  };

  return (
    <WordPositionsContext.Provider value={contextValue}>
      {children}
    </WordPositionsContext.Provider>
  );
};
