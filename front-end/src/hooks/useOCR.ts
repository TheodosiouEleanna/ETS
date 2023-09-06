import { Context } from "context/Context";
import html2canvas from "html2canvas";
import { useContext, useEffect } from "react";
import Tesseract from "tesseract.js";
import { IContextProps } from "types/AppTypes";

type RealTimeOperation = (text: string, confidence: number, bbox: any) => void;

const useOCR = (
  pageNumber: number,
  performRealTimeOperation: RealTimeOperation
) => {
  const { scrollTop } = useContext<IContextProps>(Context);

  useEffect(() => {
    const pdfContainer = document.getElementById("pdf-container");

    if (pdfContainer) {
      html2canvas(pdfContainer).then((canvas) => {
        Tesseract.recognize(canvas, "eng", {
          logger: (m) => console.log(m),
        }).then(({ data: { words } }) => {
          words.forEach((word) => {
            performRealTimeOperation(word.text, word.confidence, word.bbox);
          });
        });
      });
    }
  }, [pageNumber, scrollTop, performRealTimeOperation]);
};

export default useOCR;
