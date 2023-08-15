import React from "react";
import { Button } from "./Button";
import { RiCloseFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";

const Dialog = ({ title, content, onClose, onConfirm }) => {
  return (
    <div className='fixed inset-0 w-full flex items-center justify-center z-40'>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div
        className={`rounded w-[500px] pt-4 pb-24 px-7 m-2 bg-slate-200 relative `}
      >
        <div className='flex items-center mt-2 '>
          <h1 className='text-xl font-bold text-gray-900'>{title}</h1>
        </div>
        <div className='flex items-center mt-2 text-base'>{content}</div>
        <Button
          className='text-red-800 hover:text-red-700 absolute right-14 bottom-8'
          onClick={onClose}
        >
          <RiCloseFill className='text-3xl' />
        </Button>
        <Button
          className='text-green-800 hover:text-green-700 absolute right-6 bottom-9   active:scale-95 transform transition focus:outline-none'
          onClick={onConfirm}
        >
          <FaCheck className='text-xl' />
        </Button>
      </div>
    </div>
  );
};

export default Dialog;
