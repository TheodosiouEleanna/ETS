import React from "react";
import { lightBg_secondary } from "../../consts";

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
      style={{ color: lightBg_secondary, ...style }}
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
