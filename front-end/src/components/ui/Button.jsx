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
      className={`${
        disabled
          ? "py-1 px-2 rounded opacity-50"
          : "hover:opacity-80 py-1 px-2 rounded"
      } ${className} `}
    >
      {children && children}
      {label && label}
    </button>
  );
};
