import "react-pdf/dist/esm/Page/TextLayer.css";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { Context } from "../context/context";
import { StyleSheet } from "@react-pdf/renderer";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
});

const FileViewer = () => {
  const { zoom, file, setLoading, currentPage, setPageCount } =
    useContext(Context);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [elWidth, setElWidth] = useState(0);

  const wrapperStyle = useMemo(
    () => ({
      width: "100%",
      height: `calc(100vw / ${aspectRatio})`,
      maxHeight: "88.5vh",
    }),
    [aspectRatio]
  );

  const onDocumentLoadSuccess = async ({ numPages }) => {
    setPageCount(numPages);
  };

  const onPageLoadSuccess = ({ width, height }) => {
    setLoading(false);
    const aspectRatio = width / height;
    setAspectRatio(aspectRatio);
  };
  useEffect(() => {
    const containerElement = document.getElementById("pdf-container");
    const { width } = containerElement
      ? containerElement.getBoundingClientRect()
      : {};
    setElWidth(width);
  }, []);

  return (
    <div
      className='flex justify-center overflow-auto'
      id='pdf-container'
      style={wrapperStyle}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading=''>
        <Page
          size='A4'
          style={styles.page}
          pageNumber={currentPage}
          scale={zoom * 0.005}
          renderMode='canvas'
          renderTextLayer={false}
          width={elWidth}
          onLoadSuccess={onPageLoadSuccess}
        />
      </Document>
    </div>
  );
};

export default FileViewer;
