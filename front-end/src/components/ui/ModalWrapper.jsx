import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";
import { RiCloseFill } from "react-icons/ri";

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
  const modalContent = (
    <div className='fixed inset-0 w-full flex items-center justify-center z-40'>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div
        style={style}
        className={`rounded w-[500px] py-4 px-7 m-2 bg-slate-200 relative ${className}`}
      >
        {title && (
          <div className='flex justify-center items-center mt-2 '>
            <h1 className='text-xl font-bold text-gray-900 m-2'>{title}</h1>
          </div>
        )}
        <Button
          className='text-red-800 hover:text-red-700 absolute right-5 top-8'
          onClick={onClose}
        >
          <RiCloseFill className='text-3xl' />
        </Button>

        {children}
        <div className='flex'>
          {shouldShowConfirm && (
            <Button
              label='Confirm'
              disabled={shouldDisableConfirm}
              className='bg-blue-500 text-slate-200 w-24 flex justify-center items-center text-base absolute right-8 bottom-8 rounded  active:scale-95 transform transition focus:outline-none  shadow-lg'
              onClick={(e) => onConfirm("")}
            >
              {/* {loading && <Loader />} */}
            </Button>
          )}
          {shouldShowUpload && (
            <Button
              label='Upload File'
              className='bg-blue-500 text-slate-200 w-24 flex justify-center items-center text-base absolute right-36 bottom-8'
              onClick={onClickUpload}
            >
              {/* {loading && <Loader />} */}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")
  );
};

export default ModalWrapper;
