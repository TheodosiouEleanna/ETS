import React, { useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import { Context } from "../../context/context";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";

const Footer = () => {
  const {
    goToPrevPage,
    goToNextPage,
    pageCount,
    currentPage,
    setCurrentPage,
    pdfDimensions,
    setInputScroll,
  } = useContext(Context);

  const [inputValue, setInputValue] = useState(0);

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

  // Todo: Handle zoom change with ctrl and mouse wheel

  return (
    <footer className='z-10 w-full flex items-center justify-center border border-gray-400 py-[2px] px-4 bg-slate-200'>
      <div>
        <Button
          className='bg-blue-500 text-slate-200 text-sm rounded-full hover:scale-110 py-2 px-1 active:scale-95 transform transition focus:outline-none  shadow-lg'
          onClick={onPrevClick}
          disabled={currentPage === 1 || currentPage === 0}
        >
          <BiSolidLeftArrow />
        </Button>

        <span className='mx-2 text-sm'>
          Page
          <input
            className='slider text-gray-900 p-1 h-7 rounded border border-gray-300 w-10 my-3 mx-1 active:scale-95 transform transition focus:outline-none  shadow-lg'
            type='number'
            min='1'
            max={pageCount}
            value={inputValue}
            onChange={handlePageChange}
          />
          of {pageCount}
        </span>
        <Button
          className='bg-blue-500 text-slate-200 text-sm rounded-full hover:scale-110 py-2 px-1 active:scale-95 transform transition focus:outline-none  shadow-lg'
          onClick={onNextClick}
          disabled={currentPage === pageCount || currentPage === 0}
        >
          <BiSolidRightArrow />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
