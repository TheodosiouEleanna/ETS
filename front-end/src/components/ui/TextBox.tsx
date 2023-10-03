import { translate } from "@vitalets/google-translate-api";
import TranslationPopup from "components/TranslationPopup";
import { Context } from "context/Context";
import { useEyeTrackingData } from "context/EyeTrackingContext";
import { useWordPositions } from "hooks/useWordPositions";
import React, { useContext, useEffect, useState } from "react";
import { IContextProps, IWordPositions } from "types/AppTypes";
import { validateEyeData } from "utils/eyeTracking";
import { calculateScaledPositions } from "utils/functions";

const wordPadding = 10;

const TextBox = () => {
  const { eyeData } = useEyeTrackingData();
  const { scrollTop, currentPage, userSettingsApi } =
    useContext<IContextProps>(Context);

  const testWord = "Infrastructure";
  const {
    wordPositions,
    scaledWordDimensionsPerPage,
    setScaledWordDimensionsPerPage,
  } = useWordPositions();
  const { wordCoords = { left: 0, top: 0, width: 0, height: 0 } } =
    scaledWordDimensionsPerPage;
  const { left, top, width, height } = wordCoords;

  const element = document.getElementById("pdf-page");

  const [currentPageData, setCurrentPageData] = useState<{
    data: IWordPositions[];
    page: number;
  }>();
  const [shouldTranslate, setShouldTranslate] = useState<boolean>(false);
  const [translation, setTranslation] = useState<string>("");

  console.log({ wordPositions, currentPageData, scaledWordDimensionsPerPage });

  useEffect(() => {
    if (wordPositions && wordPositions.length) {
      setCurrentPageData(wordPositions[currentPage - 1]);
    }
  }, [currentPage, wordPositions]);

  useEffect(() => {
    if (!element) return;

    if (currentPageData && currentPageData?.data.length) {
      const wordData = currentPageData?.data.find(
        (word) => word.word === testWord
      );

      if (wordData && wordData.box) {
        const { box } = wordData;
        const { xPrime, yPrime, wPrime, hPrime } = calculateScaledPositions(
          box,
          element,
          scrollTop,
          currentPage,
          userSettingsApi.zoom
        );

        setScaledWordDimensionsPerPage?.({
          pageNum: currentPage + 1,
          wordCoords: {
            left: xPrime,
            top: yPrime,
            width: wPrime,
            height: hPrime,
          },
        });
      }
    }
  }, [
    element,
    currentPage,
    currentPageData,
    currentPageData?.data.length,
    scrollTop,
    userSettingsApi.zoom,
  ]);

  useEffect(() => {
    const validationResult = validateEyeData(eyeData.slice(-300), {
      left: left - wordPadding / 2,
      top: top - wordPadding / 2,
      right: left + width,
      bottom: top + height,
    });
    console.log({ validationResult });

    if (validationResult) {
      setShouldTranslate(validationResult);
    }
  }, [eyeData, height, left, scaledWordDimensionsPerPage, top, width]);

  useEffect(() => {
    if (testWord && shouldTranslate) {
      translate(testWord, { from: "en", to: "gr" })
        .then((res) => {
          console.log("translation res ", res.text);

          setTranslation(res.text);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [shouldTranslate]);

  return (
    <>
      <div
        style={{
          left: left - wordPadding / 2,
          top: top - wordPadding / 2,
          position: "absolute",
          width: width + wordPadding,
          height: height + wordPadding,
          border: "2px solid red",
          zIndex: 999,
        }}
      >
        <div className='relative'>
          {shouldTranslate && (
            <TranslationPopup
              text={testWord}
              translation={translation}
              offset={width + wordPadding}
              setShouldTranslate={setShouldTranslate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TextBox;
