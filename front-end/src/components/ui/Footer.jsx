import React, { useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import { Context } from "../../context/Context";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import {
  darkBg_primary,
  darkBg_secondary,
  lightBg_primary,
  lightBg_secondary,
} from "../../consts";

const Footer = () => {
  const {
    loading,
    goToPrevPage,
    goToNextPage,
    pageCount,
    currentPage,
    setCurrentPage,
    pdfDimensions,
    userSettingsApi,
  } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";
  const [inputValue, setInputValue] = useState(0);

  const handlePageChange = (e) => {
    const pageNumber = e.target.value;

    if (pageNumber > 0 && pageNumber <= pageCount) {
      setInputValue(Number(pageNumber));
      setCurrentPage(pageNumber);
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

  return (
    <footer
      className={`z-10 w-full flex items-center justify-center py-[2px] px-4 shadow-xl`}
      style={
        isDarkTheme
          ? {
              backgroundColor: darkBg_primary,
            }
          : {
              backgroundColor: lightBg_secondary,
            }
      }
    >
      <div>
        <Button
          className={`bg-blue-500 text-[${
            isDarkTheme ? lightBg_primary : darkBg_primary
          }] text-sm rounded-full hover:scale-110 py-2 px-1 active:scale-95 transform transition focus:outline-none  shadow-lg`}
          onClick={onPrevClick}
          disabled={currentPage === 1 || currentPage === 0 || loading}
        >
          <BiSolidLeftArrow />
        </Button>

        <span
          className='mx-2 text-sm'
          style={
            isDarkTheme
              ? { color: lightBg_secondary }
              : { color: darkBg_secondary }
          }
        >
          Page
          <input
            className='slider text-gray-900 p-1 h-7 rounded  w-10 my-3 mx-1 active:scale-95 transform transition focus:outline-none'
            style={
              isDarkTheme
                ? {
                    backgroundColor: darkBg_secondary,
                    color: lightBg_secondary,
                  }
                : {
                    backgroundColor: lightBg_primary,
                    color: darkBg_primary,
                  }
            }
            type='number'
            min='1'
            disabled={currentPage === pageCount || currentPage === 0 || loading}
            max={pageCount}
            value={inputValue}
            onChange={handlePageChange}
          />
          of {pageCount}
        </span>
        <Button
          className={`bg-blue-500 text-[${
            isDarkTheme ? darkBg_primary : lightBg_primary
          }] text-sm rounded-full hover:scale-110 py-2 px-1 active:scale-95 transform transition focus:outline-none shadow-lg`}
          onClick={onNextClick}
          disabled={currentPage === pageCount || currentPage === 0 || loading}
        >
          <BiSolidRightArrow />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
