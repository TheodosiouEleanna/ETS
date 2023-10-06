import TranslationPopup from "components/TranslationPopup";
import { Context } from "context/Context";
import { useEyeTrackingData } from "context/EyeTrackingContext";
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

const testWord = "comprehending";

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

  // console.log({ wordPositions, currentPageData });

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
    const fetchTranslation = async () => {
      if (currentWord && shouldTranslate) {
        try {
          const response = await fetch(
            `http://localhost:5002/translate_a/single?client=at&dt=t&dt=rm&dj=1&sl=en&tl=el&q=${testWord}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setTranslation(data.sentences[0].trans);
          } else {
            console.error("Failed to fetch translation");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    fetchTranslation();
  }, [currentWord, shouldTranslate]);

  return (
    <>
      <div>
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
    </>
  );
};

export default TextBox;
