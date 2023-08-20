import { useState, useEffect, useContext } from "react";
import {
  darkBg_primary,
  lightBg_primary,
  lightBg_secondary,
} from "../../consts";
import { Context } from "../../context/Context";

const Snackbar = ({ message, status, duration = 2000, onClose }) => {
  const [visible, setVisible] = useState(!!message);
  const { userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";

  useEffect(() => {
    if (message && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, visible, duration, onClose]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "info":
        return "bg-blue-600";
      default:
        return "bg-gray-400";
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-20 left-[1.5rem] p-2 rounded shadow-lg ${getStatusStyle(
        status
      )}`}
      style={{ color: lightBg_secondary }}
    >
      {message}
    </div>
  );
};

export default Snackbar;
