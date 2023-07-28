import React from "react";

export const Button = ({
  label,
  children,
  disabled,
  type,
  style,
  onClick,
  className,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      style={style}
      onClick={onClick}
      className={`${className} ${
        disabled
          ? " text-white py-1 px-2 rounded opacity-50"
          : "hover:opacity-80 text-white py-1 px-2 rounded "
      } `}
    >
      {label && label}
      {children && children}
    </button>
  );
};
