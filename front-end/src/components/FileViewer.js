import React, { useContext, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { Context } from "../context/context";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const FileViewer = () => {
  const { file, loadFile } = useContext(Context);
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className='w-full flex justify-center '>
      <div className='flex justify-center bg-white w-[60%] border border-gray-300'>
        <Document
          className='text-red-600 m-4'
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            scale={zoom}
            className='w-full-page'
            renderMode='canvas'
          />
        </Document>
      </div>
    </div>
  );
};

export default FileViewer;
