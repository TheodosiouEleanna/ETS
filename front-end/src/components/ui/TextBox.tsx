import { Context } from "context/Context";
import { useWordPositions } from "hooks/useWordPositions";
import React, { useState, useContext, useEffect } from "react";
import { IContextProps, IWordPositions } from "types/AppTypes";
import { calculateScaledPositions } from "utils/functions";

const wordPadding = 5;

const TextBox = () => {
  const { scrollTop, currentPage, userSettingsApi } =
    useContext<IContextProps>(Context);
  const [currentPageData, setCurrentPageData] = useState<{
    data: IWordPositions[];
    page: number;
  }>();

  const { wordPositions, setScaledWordDimensionsPerPage } = useWordPositions();

  useEffect(() => {
    if (wordPositions && wordPositions.length) {
      setCurrentPageData(wordPositions[currentPage - 1]);
    }
  }, [currentPage, wordPositions]);

  return (
    <>
      {currentPageData &&
        currentPageData.data.map((wordData, index) => {
          if (wordData && wordData.box) {
            const { box, word } = wordData;
            const { xPrime, yPrime, wPrime, hPrime } = calculateScaledPositions(
              box,
              scrollTop,
              currentPage,
              userSettingsApi.zoom
            );
            setScaledWordDimensionsPerPage?.({
              pageNum: currentPage,
              wordCoords: {
                left: xPrime,
                top: yPrime,
                width: wPrime,
                height: hPrime,
              },
            });
            return (
              <div
                key={index}
                style={{
                  opacity: 0.3,
                  left: xPrime,
                  top: yPrime,
                  position: "absolute",
                  width: wPrime + wordPadding,
                  height: hPrime + wordPadding,
                  border: "2px solid red",
                  zIndex: 999,
                }}
              >
                {/* {word} */}
              </div>
            );
          }
          return null;
        })}
    </>
  );
};

export default TextBox;
