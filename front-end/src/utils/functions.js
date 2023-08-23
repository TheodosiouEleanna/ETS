import { dark_primary, dark_secondary, light_primary, light_secondary } from "../consts";

export const base64ToBlob = (base64, type = "") => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: type });
};

export const getFileFromStorage = () => {
  const base64 = localStorage.getItem("pdfFile");
  if (base64) {
    const retrievedPdfBlob = base64ToBlob(base64, "application/pdf");
    return retrievedPdfBlob;
  }
  return { size: 0 };
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const debounce = (fn, delay) => {
  let timeout;
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFontColorPrimary = (isDarkTheme) => (isDarkTheme ? light_primary : dark_primary);

export const getFontColorSecondary = (isDarkTheme) =>
  isDarkTheme ? { color: light_secondary } : { color: dark_secondary };

export const getBgPrimary = (isDarkTheme) => (isDarkTheme ? dark_primary : light_primary);

export const getBgSecondary = (isDarkTheme) => (isDarkTheme ? dark_secondary : light_secondary);

export const getBgPrimaryReverse = (isDarkTheme) => (isDarkTheme ? light_primary : dark_primary);

export const getBgSecondaryReverse = (isDarkTheme) => (isDarkTheme ? light_secondary : dark_secondary);
