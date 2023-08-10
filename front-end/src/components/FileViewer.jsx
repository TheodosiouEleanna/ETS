import "react-pdf/dist/esm/Page/TextLayer.css";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { Context } from "../context/context";
import { StyleSheet } from "@react-pdf/renderer";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
});

const FileViewer = () => {
  const {
    zoom,
    file,
    setLoading,
    currentPage,
    setCurrentPage,
    pageCount,
    setPageCount,
    pdfDimensions,
    setPdfDimensions,
    isInputScroll,
    setInputScroll,
  } = useContext(Context);
  const [elWidth, setElWidth] = useState({});

  const wrapperStyle = useMemo(
    () => ({
      width: "100%",
      height: `calc(100vw / ${pdfDimensions.aspectRatio})`,
      maxHeight: "88.5vh",
    }),
    [pdfDimensions.aspectRatio]
  );

  const onDocumentLoadSuccess = async (pdf) => {
    console.log("doc load success");
    setPageCount(pdf.numPages);
    setLoading(false);

    // Get the first page of the document
    const page = await pdf.getPage(1);

    // Wait for the next tick to ensure the DOM is updated
    setTimeout(() => {
      const element = document.querySelector(".react-pdf__Page");
      if (element) {
        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const aspectRatio = width / height;
        setPdfDimensions({ aspectRatio, width, height: height + 34 });
        console.log({ width, height });
      }
    }, 500);

    page.cleanup();
  };

  const handleScroll = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      const container = event.target;
      const pageHeight = pdfDimensions.height;

      if (isInputScroll) {
        setInputScroll(false);
        return;
      } else {
        const scrolledPages =
          Math.floor(
            (container.scrollTop + (pageHeight * 1) / 4) / pageHeight
          ) + 1;

        setCurrentPage(scrolledPages);
        console.log({
          aspectRatio: pdfDimensions.aspectRatio,
          currentPage,
          scrolledPages,
          scrollTop: container.scrollTop,
          pageHeight,
        });
      }
    },
    [
      currentPage,
      isInputScroll,
      pdfDimensions.aspectRatio,
      pdfDimensions.height,
      setCurrentPage,
      setInputScroll,
    ]
  );

  useEffect(() => {
    const containerElement = document.getElementById("pdf-container");
    const { width } = containerElement
      ? containerElement.getBoundingClientRect()
      : {};
    setElWidth(width);
  }, []);

  // Todo: Optimize this to load the pages as you scroll

  return (
    <div
      className={`${
        zoom >= 1 ? "justify-start" : "justify-center"
      } flex overflow-auto`}
      id='pdf-container'
      style={wrapperStyle}
      onScroll={handleScroll}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading=''>
        {Array.from(new Array(pageCount), (el, index) => (
          <Page
            loading=''
            className='mb-8 border border-gray-300 shadow-xl'
            id='page'
            key={`page_${index + 1}`}
            size='A4'
            style={styles.page}
            pageNumber={index + 1} // It should render all pages, not just the current page
            scale={zoom}
            renderMode='canvas'
            renderTextLayer={false}
            width={elWidth}
          />
        ))}
      </Document>
    </div>
  );
};

export default FileViewer;
