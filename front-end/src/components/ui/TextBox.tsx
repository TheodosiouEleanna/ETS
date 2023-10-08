import axios from "axios";
import TranslationPopup from "components/TranslationPopup";
import { Context } from "context/Context";
import { useEyeTrackingData } from "context/EyeTrackingContext";
import usePrevious from "hooks/usePrevious";
import { useWordPositions } from "hooks/useWordPositions";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  IContextProps,
  IScaledWordCoords,
  IWordPositions,
} from "types/AppTypes";
import { validateEyeData2 } from "utils/eyeTracking";
import { calculateScaledPositions, debounce } from "utils/functions";

const wordPadding = 10;

const testWord = "complementary";

const initWord = {
  word: testWord,
  wordCoords: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
};

const TextBox = () => {
  const { eyeData } = useEyeTrackingData();
  const { pageMounted, scrollTop, currentPage, userSettingsApi } =
    useContext<IContextProps>(Context);

  const { wordPositions } = useWordPositions();

  const [currentPageData, setCurrentPageData] = useState<{
    data: IWordPositions[];
    page: number;
  }>();

  const [currentWord, setCurrentWord] = useState<IScaledWordCoords>();
  const [wordsScreenPositions, setWordsScreenPositions] =
    useState<IScaledWordCoords[]>();
  const [shouldTranslate, setShouldTranslate] = useState<boolean>(false);
  const [translation, setTranslation] = useState<string>("");

  const prevWord = usePrevious(currentWord?.word);
  const isNewWord = currentWord?.word !== prevWord;
  useEffect(() => {
    if (wordPositions && wordPositions.length) {
      setCurrentPageData(wordPositions[currentPage - 1]);
    }
  }, [currentPage, wordPositions]);

  const finalPositions = useMemo(() => {
    if (pageMounted && currentPageData && currentPageData?.data.length) {
      const screenPositions = currentPageData.data.map((w) => {
        const { box, word } = w;
        const { xPrime, yPrime, wPrime, hPrime } = calculateScaledPositions(
          box,
          scrollTop,
          currentPage,
          userSettingsApi.zoom
        );
        return {
          word,
          wordCoords: {
            left: xPrime,
            top: yPrime,
            width: wPrime,
            height: hPrime,
          },
        };
      });
      return screenPositions;
    }
    return [];
  }, [
    currentPage,
    currentPageData,
    pageMounted,
    scrollTop,
    userSettingsApi.zoom,
  ]);

  useEffect(() => {
    if (finalPositions) setWordsScreenPositions(finalPositions);
  }, [finalPositions]);
  console.log({ wordsScreenPositions });

  useEffect(() => {
    if (
      pageMounted &&
      wordsScreenPositions &&
      wordsScreenPositions.length &&
      eyeData.length > 300
    ) {
      const detectedWord = validateEyeData2(eyeData, wordsScreenPositions);
      console.log({ detectedWord: detectedWord.word });

      if (detectedWord.word) {
        setCurrentWord(detectedWord);
        setShouldTranslate(true);
      }
    }
  }, [pageMounted, eyeData, currentPageData, wordsScreenPositions]);

  useEffect(() => {
    const translateWord = async () => {
      if (currentWord && shouldTranslate) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/translate",
            {
              src: "en",
              tgt: "el",
              text: currentWord?.word,
            }
          );
          setTranslation(response.data.translation.toLowerCase());
        } catch (error) {
          console.error("There was an error translating the text!", error);
        }
      }
    };
    setTranslation("");
    translateWord();
  }, [currentWord, shouldTranslate]);

  // useEffect(() => {
  //   const wordForTransl = wordsScreenPositions?.find(
  //     (w) => w.word === testWord
  //   );
  //   setShouldTranslate(true);
  //   setCurrentWord(wordForTransl || initWord);
  // }, [isNewWord, wordsScreenPositions]);

  console.log({ currentWord: currentWord?.word, isNewWord, shouldTranslate });

  return (
    <div
      style={{
        position: "absolute",
        left: (currentWord?.wordCoords.left || 0) - wordPadding / 2,
        top: currentWord?.wordCoords.top || 0,
        width: (currentWord?.wordCoords.width || 0) + wordPadding,
        height: (currentWord?.wordCoords.height || 0) + wordPadding,
        // border: shouldTranslate ? "2px solid red" : "2px solid transparent",
        zIndex: 40,
      }}
    >
      <div className='relative'>
        {shouldTranslate && (
          <TranslationPopup
            translation={translation}
            offset={(currentWord?.wordCoords.width || 0) + wordPadding}
            setShouldTranslate={setShouldTranslate}
          />
        )}
      </div>
    </div>
  );
};

export default TextBox;
