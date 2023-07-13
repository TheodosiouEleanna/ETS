import React, { useContext } from "react";
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
  } = useContext(Context);

  return (
    <footer className='w-full z-10 flex items-center justify-between border border-gray-400 p-4 bg-gray-200'>
      <div className='flex'>
        <label className='block text-gray-700 text-sm font-bold pr-4 flex items-center'>
          Zoom Level
        </label>
        <input
          type='range'
          min='50'
          max='200'
          value={zoom}
          onChange={(e) => handleZoomChange(e.target.value / 100)}
          className='slider bg-blue-500'
        />
        <p className='text-gray-600 pl-4'>{zoom}%</p>
      </div>

      <div>
        <Button
          className=''
          label='Prev'
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        />

        <span>
          Page {currentPage} of {pageCount}
        </span>
        <Button
          className=''
          label='Next'
          onClick={goToNextPage}
          disabled={currentPage === pageCount}
        />
      </div>
    </footer>
  );
};

export default Footer;
