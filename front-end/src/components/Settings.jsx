import React from "react";

const Settings = ({ onClick }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-40'>
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={onClick}
      ></div>
      <div className='z-50 rounded p-6 m-4 max-w-xs mx-auto bg-slate-600'>
        <h1 className='mb-4 text-xl font-semibold'>Modal Content</h1>
        <p className='mb-4'>This is your modal content...</p>
        <button
          className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600'
          onClick={onClick}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default Settings;
