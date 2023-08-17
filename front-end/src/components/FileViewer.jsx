import "react-pdf/dist/esm/Page/TextLayer.css";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { Context } from "../context/Context";
import { StyleSheet } from "@react-pdf/renderer";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useSnackbar } from "../hooks/useSnackbar";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
});

const FileViewer = () => {
  const {
    file,
    setLoading,
    setCurrentPage,
    pageCount,
    userSettingsApi,
    setPageCount,
    pdfDimensions,
    setPdfDimensions,
  } = useContext(Context);
  // const isElectron = window && window.process && window.process.type;
  const isElectron = /Electron/.test(navigator.userAgent);
  const [elWidth, setElWidth] = useState({});
  // const [visiblePages, setVisiblePages] = useState([1]);
  // const [observer, setObserver] = useState(null);
  const { triggerSnackbar } = useSnackbar();
  const { zoom: savedZoom } = userSettingsApi;

  const wrapperStyle = useMemo(
    () => ({
      width: "100%",
      height: `calc(100vw / ${pdfDimensions.aspectRatio})`,
      maxHeight: isElectron ? "89.1vh" : "88.7vh",
    }),
    [isElectron, pdfDimensions.aspectRatio]
  );

  const onDocumentLoadSuccess = async (pdf) => {
    console.log("doc load success");
    setPageCount(pdf.numPages);
    setLoading(false);
    triggerSnackbar({
      message: "Document loaded successfully!",
      status: "success",
      open: true,
    });
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
      }
    }, 500);

    page.cleanup();
  };

  // const observePage = useCallback(
  //   (node) => {
  //     if (observer && node !== null) {
  //       observer.observe(node);
  //     }
  //   },
  //   [observer]
  // );

  const handleScroll = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      const container = event.target;
      const pageHeight = pdfDimensions.height;

      const scrolledPages =
        Math.floor((container.scrollTop + pageHeight / 4) / pageHeight) + 1;

      setCurrentPage(scrolledPages);
    },
    [pdfDimensions.height, setCurrentPage]
  );

  useEffect(() => {
    const containerElement = document.getElementById("pdf-container");
    const { width } = containerElement
      ? containerElement.getBoundingClientRect()
      : {};
    setElWidth(width);
  }, []);

  // useEffect(() => {
  //   const containerElement = document.getElementById("pdf-container");

  //   const handleIntersect = (entries, observer) => {
  //     const visiblePages = entries
  //       .filter((entry) => entry.isIntersecting)
  //       .map((entry) => parseInt(entry.target.dataset.pageNumber, 10));

  //     setVisiblePages(visiblePages);

  //     if (visiblePages.length) {
  //       setCurrentPage(visiblePages[0]);
  //     }
  //   };
  //   const options = {
  //     root: containerElement,
  //     rootMargin: "0px",
  //     threshold: 0.1,
  //   };

  //   const obs = new IntersectionObserver(handleIntersect, options);
  //   setObserver(obs);

  //   return () => {
  //     if (observer) {
  //       observer.disconnect();
  //     }
  //   };
  // }, [setVisiblePages]);

  // Todo: Optimize this to load the pages as you scroll

  return (
    <div
      className={`${
        savedZoom >= 1 ? "justify-start" : "justify-center"
      } flex overflow-auto`}
      id='pdf-container'
      style={wrapperStyle}
      onScroll={handleScroll}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading=''>
        {Array.from(new Array(pageCount), (el, index) => (
          //    <Page
          //   visiblePages={visiblePages}
          //   index={index}
          //   height={pdfDimensions.height}
          //   observePage={observePage}
          //   style={styles.page}
          //   zoom={finalZoom}
          //   width={elWidth}
          // />
          <div
            key={`wrapper_${index}`}
            style={{ height: pdfDimensions.height }}
            data-page-number={index}
            // ref={(node) => observePage(node, index)}
          >
            <Page
              loading=''
              className='mb-8 border border-gray-300'
              id='page'
              key={`page_${index + 1}`}
              size='A4'
              style={styles.page}
              pageNumber={index + 1}
              scale={savedZoom}
              renderMode='canvas'
              renderTextLayer={false}
              width={elWidth}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default FileViewer;
