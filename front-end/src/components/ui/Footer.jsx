import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "./Button";
import { Context } from "../../context/Context";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import { dark_primary, dark_secondary, light_primary, light_secondary, shadowLgTop } from "../../consts";
import { getBgPrimary, getFontColorSecondary } from "../../utils/functions";

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

  const style = useMemo(
    () =>
      isDarkTheme
        ? {
            backgroundColor: dark_secondary,
            color: light_secondary,
          }
        : {
            backgroundColor: light_primary,
            color: dark_primary,
          },
    [isDarkTheme]
  );

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
      className={`z-10 w-full flex items-center justify-center px-4 absolute bottom-0 h-12`}
      style={{
        ...(isDarkTheme
          ? {
              backgroundColor: dark_primary,
            }
          : {
              backgroundColor: light_secondary,
            }),
        ...shadowLgTop,
      }}
    >
      <div>
        <Button
          className={`bg-blue-500 text-[${getBgPrimary(
            isDarkTheme
          )}] text-sm rounded-full hover:scale-110 py-2 px-1 active:scale-95 transform transition focus:outline-none shadow-lg`}
          onClick={onPrevClick}
          disabled={currentPage === 1 || currentPage === 0 || loading}
        >
          <BiSolidLeftArrow />
        </Button>

        <span className='mx-2 text-sm' style={{ color: getFontColorSecondary(isDarkTheme) }}>
          Page
          <input
            className='slider text-gray-900 p-1 h-7 rounded  w-10 my-3 mx-1 active:scale-95 transform transition focus:outline-none'
            style={style}
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
          className={`bg-blue-500 text-[${getBgPrimary(
            isDarkTheme
          )}] text-sm rounded-full hover:scale-110 py-2 px-1 active:scale-95 transform transition focus:outline-none shadow-lg`}
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
