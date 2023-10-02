import {Context } from "context/Context";
import { useEyeTrackingData } from "context/EyeTrackingContext";
import { useWordPositions } from "hooks/useWordPositions";
import  React, { useContext, useMemo } from "react";
import { GazeData, IContextProps } from "types/AppTypes";
import { getGazePointCoordinates } from "utils/eyeTracking";
import { calculateScaledPositions } from "utils/functions";

const wordPadding = 10;

const normalizeBounds = ( { xPrime, yPrime, wPrime, hPrime }:  { xPrime:number; yPrime:number; wPrime:number; hPrime:number;}) => {
  const screenWidth = document.documentElement.scrollWidth;
  const screenHeight = document.documentElement.scrollHeight;

  const left = xPrime / screenWidth;
  const top = yPrime / screenHeight;
  const right = (xPrime + wPrime) / screenWidth;
  const bottom = (yPrime + hPrime) / screenHeight;

  return { left, top, right, bottom };
}

const validateEyeData = (eyeData: GazeData[], bounds: {
  left: number;
  top: number;
  right: number;
  bottom: number;
}) => {

  const { left, top, right, bottom } = bounds;
  for(const dato of eyeData) {
    const { pointX, pointY } = getGazePointCoordinates(dato);
    console.log('Average gaze point', pointX, pointY)
    console.log('Tis leksis',   left, top, right, bottom )
    // console.log('Average gaze point + 0.1', pointX + 0.1, pointY + 0.1)
    if(pointX < left || pointX > right || pointY  < top || pointY > bottom) return false;
  }
  return true;
}

const TextBox = () => {
  const { scrollTop, currentPage, userSettingsApi } =
    useContext<IContextProps>(Context);
  // const [currentPageData, setCurrentPageData] = useState<{
  //   data: IWordPositions[];
  //   page: number;
  // }>();
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
  const testWord = "Document";
  const currentPageData = useMemo(() => wordPositions[currentPage - 1], [currentPage, wordPositions]);

  if (currentPageData) {
    const wordData = currentPageData.data.find((word) => word.word === testWord);

    if (wordData && wordData.box) {
      const { box } = wordData;

      console.log({ wordPositions, currentPageData, box });
      const { xPrime, yPrime, wPrime, hPrime } = calculateScaledPositions(box,
              scrollTop,
              currentPage,
              userSettingsApi.zoom
            );

      // const normalizedWordData = normalizeBounds( { xPrime, yPrime, wPrime:wPrime + wordPadding, hPrime: hPrime + wordPadding })
      // console.log({normalizedWordData})

      const validationResult = validateEyeData(eyeData.slice(-300), {left: xPrime, top: yPrime, right: xPrime+ wPrime, bottom: yPrime + hPrime })
      console.log({validationResult});
        
      if(validationResult) console.log({testWord})

      return (
        <div
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
          TestBox
        </div>
      );
    }
  }
  return null;
};

export default TextBox;
