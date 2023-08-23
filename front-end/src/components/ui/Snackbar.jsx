import { useState, useEffect, useContext } from "react";
import { dark_primary, light_primary, light_secondary } from "../../consts";
import { Context } from "../../context/Context";

const Snackbar = ({ message, status, duration = 2000, onClose }) => {
  const [visible, setVisible] = useState(!!message);

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
      className={`fixed bottom-16 left-[1.3rem] p-2 rounded shadow-lg ${getStatusStyle(status)}`}
      style={{ color: light_secondary }}
    >
      {message}
    </div>
  );
};

export default Snackbar;
