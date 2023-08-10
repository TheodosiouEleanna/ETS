import React, { useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import { Context } from "../context/context";

const Footer = () => {
  const {
    zoom,
    handleZoomChange,
    goToPrevPage,
    goToNextPage,
    pageCount,
    currentPage,
    setCurrentPage,
    pdfDimensions,
    setInputScroll,
  } = useContext(Context);

  const [inputValue, setInputValue] = useState(0);

  console.log({ inputValue, currentPage });

  const handlePageChange = (e) => {
    const pageNumber = e.target.value;

    if (pageNumber > 0 && pageNumber <= pageCount) {
      setInputValue(Number(pageNumber));
      setCurrentPage(pageNumber);
      setInputScroll(true);
      const container = document.getElementById("pdf-container");
      const scrollTop = (pageNumber - 1) * pdfDimensions.height;
      container.scrollTop = scrollTop;
    }
  };

  const onPrevClick = (e) => {
    goToPrevPage();
  };

  const onNextClick = (e) => {
    goToNextPage();
  };

  useEffect(() => {
    setInputValue(currentPage);
  }, [currentPage]);

  // Todo: Think about how to implement the zoom in the ui
  // Todo: Handle zoom change with ctrl and mouse wheel

  return (
    <footer className='z-10 w-full flex items-center justify-center border border-gray-400 py-[2px] px-4 bg-slate-200'>
      {/* <div className='flex'>
        <label className='block text-gray-700 text-sm  pr-4 items-center'>
          Zoom Level
        </label>
        <input
          type='range'
          min='0'
          max='200'
          value={zoom * 100}
          onChange={(e) => handleZoomChange(e.target.value)}
          className='slider bg-blue-500 '
        />
        <p className='text-gray-600 pl-4'>{Math.floor(zoom * 100)}%</p>
      </div> */}

      <div>
        <Button
          className='bg-blue-500 text-slate-200 text-sm'
          label='Prev'
          onClick={onPrevClick}
          disabled={currentPage === 1 || currentPage === 0}
        />

        <span className='mx-2 text-sm'>
          Page
          <input
            className='slider text-gray-900 p-1 h-7 rounded border border-gray-300 w-10 my-3 mx-1'
            type='number'
            min='1'
            max={pageCount}
            value={inputValue}
            onChange={handlePageChange}
          />
          of {pageCount}
        </span>
        <Button
          className='bg-blue-500 text-slate-200 text-sm'
          label='Next'
          onClick={onNextClick}
          disabled={currentPage === pageCount || currentPage === 0}
        />
      </div>
    </footer>
  );
};

export default Footer;
