import { Context } from "context/Context";
import React, { useContext, useMemo } from "react";
import { IContextProps } from "types/AppTypes";
import { calculateScaledPositions } from "utils/functions";

const TestBox = () => {
  const { scrollTop, wordPositions, currentPage } = useContext<IContextProps>(Context);

  const testWord = "structured";
  const currentPageData = useMemo(() => wordPositions[currentPage - 1], [currentPage, wordPositions]);

  if (currentPageData) {
    const wordData = currentPageData.data.find((word) => word.word === testWord);

    if (wordData && wordData.box) {
      const { box } = wordData;

      console.log({ wordPositions, currentPageData, box });
      const { xPrime, yPrime, wPrime, hPrime } = calculateScaledPositions(box, scrollTop);

      console.log({ xPrime, yPrime, wPrime, hPrime });

      return (
        <div
          style={{
            opacity: 0.3,
            left: xPrime,
            top: yPrime,
            position: "absolute",
            width: wPrime,
            height: hPrime,
            border: "2px solid red",
            zIndex: 999,
          }}
        >
          TestBox
        </div>
      );
    }
  }
  return null;
};

export default TestBox;
