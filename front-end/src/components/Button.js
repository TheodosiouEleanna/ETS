import React from "react";

export const Button = ({ label, type, onClick, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-gray-500 hover:bg-gray-400 text-white font-bold py-3 mx-2 px-4 rounded ${className}`}
    >
      {label}
    </button>
  );
};
