import React from "react";

export const Button = ({
  label,
  children,
  disabled,
  type,
  onClick,
  className,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${className} hover:bg-gray-400 text-white py-1 px-2 rounded `}
    >
      {label && label}
      {children && children}
    </button>
  );
};
