import TranslationPopup from "components/TranslationPopup";
import { Context } from "context/Context";
import { useEyeTrackingData } from "context/EyeTrackingContext";
import useCurrentPageData from "hooks/useCurrentPageData";
import { useWordPositions } from "hooks/useWordPositions";
import React, { useContext, useEffect, useState } from "react";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { GazeData, IContextProps, IWordPositions } from "types/AppTypes";
import { getGazePointCoordinates } from "utils/eyeTracking";
import { calculateScaledPositions } from "utils/functions";

const wordPadding = 10;

const validateEyeData = (
  eyeData: GazeData[],
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }
) => {
  const { left, top, right, bottom } = bounds;
  for (const dato of eyeData) {
    const { pointX, pointY } = getGazePointCoordinates(dato);
    console.log("Average gaze point", pointX, pointY);
    console.log("Tis leksis", left, top, right, bottom);
    // console.log('Average gaze point + 0.1', pointX + 0.1, pointY + 0.1)
    if (pointX < left || pointX > right || pointY < top || pointY > bottom)
      return false;
  }
  return true;
};

const TextBox = () => {
  const { scrollTop, currentPage, userSettingsApi } =
    useContext<IContextProps>(Context);
  const [currPageData, setCurrentPageData] = useState<{
    data: IWordPositions[];
    page: number;
  }>();
  const [shouldTranslate, setShouldTranslate] = useState<boolean>(false);
  const { eyeData } = useEyeTrackingData();
  const { wordPositions, setScaledWordDimensionsPerPage } = useWordPositions();

  // useEffect(() => {
  //   if (wordPositions && wordPositions.length) {
  //     setCurrentPageData(wordPositions[currentPage - 1]);
  //   }
  // }, [currentPage, wordPositions]);

  // return (
  //   <>
  //     {currentPageData &&
  // currentPageData.data.map((wordData, index) => {
  //   if (wordData && wordData.box) {
  //     const { box, word } = wordData;
  //     const { xPrime, yPrime, wPrime, hPrime } = calculateScaledPositions(
  //       box,
  //       scrollTop,
  //       currentPage,
  //       userSettingsApi.zoom
  //     );
  //     setScaledWordDimensionsPerPage?.({
  //       pageNum: currentPage,
  //       wordCoords: {
  //         left: xPrime,
  //         top: yPrime,
  //         width: wPrime,
  //         height: hPrime,
  //       },
  //     });
  //     return (
  //       <div
  //         key={index}
  //         style={{
  //           opacity: 0.3,
  //           left: xPrime,
  //           top: yPrime,
  //           position: "absolute",
  //           width: wPrime + wordPadding,
  //           height: hPrime + wordPadding,
  //           border: "2px solid red",
  //           zIndex: 999,
  //         }}
  //       >
  //         {/* {word} */}
  //       </div>
  //     );
  //   }
  //   return null;
  // })
  //       ''
  //       }
  //   </>
  // );
  const currentPageData = useCurrentPageData(wordPositions, currentPage);

  // if (!currentPageData) return null;

  const testWord = "Document";
  const wordData = currentPageData?.data.find((word) => word.word === testWord);
  // if (!wordData || !wordData.box) return null;

  const { xPrime, yPrime, wPrime, hPrime } = calculateScaledPositions(
    wordData?.box || [0, 0, 0, 0],
    scrollTop,
    currentPage,
    userSettingsApi.zoom
  );

  useEffect(() => {
    const validationResult = validateEyeData(eyeData.slice(-300), {
      left: xPrime - wordPadding / 2,
      top: yPrime - wordPadding / 2,
      right: xPrime + wPrime,
      bottom: yPrime + hPrime,
    });
    console.log({ validationResult });

    if (validationResult) {
      console.log({ testWord });
      setShouldTranslate(validationResult);
    }
  }, [eyeData, hPrime, wPrime, xPrime, yPrime]);

  return (
    <>
      <div
        style={{
          left: xPrime - wordPadding / 2,
          top: yPrime - wordPadding / 2,
          position: "absolute",
          width: wPrime + wordPadding,
          height: hPrime + wordPadding,
          border: "2px solid red",
          zIndex: 999,
        }}
      >
        <div className='relative'>
          {shouldTranslate && (
            <TranslationPopup
              text={testWord}
              translation={testWord}
              offset={wPrime + wordPadding}
              setShouldTranslate={setShouldTranslate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TextBox;
