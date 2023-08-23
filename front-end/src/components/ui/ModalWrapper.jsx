import { useContext } from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";
import { RiCloseFill } from "react-icons/ri";
import { Context } from "../../context/Context";
import { dark_secondary, light_secondary } from "../../consts";

const ModalWrapper = ({
  children,
  title,
  style,
  className,
  shouldShowConfirm = true,
  shouldShowUpload = false,
  shouldDisableConfirm = false,
  onConfirm,
  onClickUpload,
  onClose,
}) => {
  const { userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";
  const modalContent = (
    <div className='fixed inset-0 w-full flex items-center justify-center z-40'>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div
        className={`rounded py-6 px-8 m-2 relative ${className}`}
        style={
          isDarkTheme
            ? { ...style, backgroundColor: dark_secondary }
            : {
                ...style,
                backgroundColor: light_secondary,
              }
        }
      >
        {title && (
          <div className='flex justify-center items-center mt-2 '>
            <h1 className={`text-xl font-bold m-2`} style={{ color: light_secondary }}>
              {title}
            </h1>
          </div>
        )}
        <Button
          className='text-red-700 hover:text-red-600 absolute right-5 top-8'
          style={{ color: " rgb(153 27 27)" }}
          onClick={onClose}
        >
          <RiCloseFill className='text-3xl' />
        </Button>

        {children}
        <div className='flex relative'>
          {shouldShowConfirm && (
            <Button
              label='Confirm'
              disabled={shouldDisableConfirm}
              className={`bg-blue-500 w-24 flex justify-center items-center text-base absolute right-0 top-3 rounded  active:scale-95 transform transition focus:outline-none  shadow-lg`}
              style={{ color: light_secondary }}
              onClick={(e) => onConfirm("")}
            >
              {/* {loading && <Loader />} */}
            </Button>
          )}
          {shouldShowUpload && (
            <Button
              label='Upload File'
              className={`bg-blue-500 w-24 flex justify-center items-center text-base absolute right-28 top-3`}
              style={{ color: light_secondary }}
              onClick={onClickUpload}
            >
              {/* {loading && <Loader />} */}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById("modal-root"));
};

export default ModalWrapper;
