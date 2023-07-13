import React from "react";

export const Button = ({ label, disabled, type, onClick, className }) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 mx-2 px-8 rounded ${className}`}
    >
      {label}
    </button>
  );
};
