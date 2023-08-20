import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import {
  darkBg_primary,
  darkBg_secondary,
  languageMap,
  lightBg_primary,
  lightBg_secondary,
} from "../consts";

const Settings = () => {
  const { userSettingsUi, setUserSettingsUi, userSettingsApi } =
    useContext(Context);
  const { zoom, theme, language } = userSettingsUi;
  const [loading, setLoading] = useState(false);
  const isDarkTheme = userSettingsApi.theme === "dark";

  const handleSettingsChange = (key, value) => {
    if (key === "zoom") {
      value = value / 100;
    }
    setUserSettingsUi({ [key]: value });
  };

  useEffect(() => {
    setLoading(true);
    setUserSettingsUi(userSettingsApi);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettingsApi]);

  if (loading) {
    return (
      <div
        className='flex justify-center items-center w-full h-full'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        Loading documents...
      </div>
    );
  }

  return (
    <div className='flex flex-col m-2 p-4'>
      <h1
        className='py-1 mb-4 text-xl font-bold text-gray-900 border-b border-gray-300'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        Settings
      </h1>
      <div
        className='mb-8 text-gray-600'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        Adjust the settings to your preferences and click Confirm to apply them
        to your document.
      </div>
      <div className='w-[500px]'>
        <div className='mb-4 flex justify-between '>
          <label
            className='text-base'
            style={
              isDarkTheme
                ? { color: lightBg_secondary }
                : { color: darkBg_secondary }
            }
          >
            Zoom Level
          </label>
          <div
            className='flex '
            style={
              isDarkTheme
                ? { color: lightBg_secondary }
                : { color: darkBg_secondary }
            }
          >
            <input
              type='range'
              min='10'
              max='200'
              value={zoom * 100}
              onChange={(e) =>
                handleSettingsChange("zoom", Number(e.target.value))
              }
              className='slider text-gray-900 p-1 h-10 rounded border border-gray-300'
            />
            <p
              className='text-base pl-4 align-middle'
              style={
                isDarkTheme
                  ? { color: lightBg_secondary }
                  : { color: darkBg_secondary }
              }
            >
              {(zoom * 100).toFixed()}%
            </p>
          </div>
        </div>
        <div className='mb-4 flex justify-between'>
          <label
            className='text-base'
            style={
              isDarkTheme
                ? { color: lightBg_secondary }
                : { color: darkBg_secondary }
            }
          >
            Theme
          </label>
          <select
            className='text-base  p-1 w-48 rounded border border-gray-300'
            style={
              isDarkTheme
                ? {
                    backgroundColor: darkBg_secondary,
                    color: lightBg_secondary,
                  }
                : {
                    backgroundColor: lightBg_primary,
                    color: darkBg_primary,
                  }
            }
            value={theme}
            onChange={(e) => handleSettingsChange("theme", e.target.value)}
          >
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
          </select>
        </div>
        <div className='mb-4 flex justify-between'>
          <label
            className='text-base'
            style={
              isDarkTheme
                ? { color: lightBg_secondary }
                : { color: darkBg_secondary }
            }
          >
            Language
          </label>
          <select
            value={language}
            style={
              isDarkTheme
                ? {
                    backgroundColor: darkBg_secondary,
                    color: lightBg_secondary,
                  }
                : {
                    backgroundColor: lightBg_primary,
                    color: darkBg_primary,
                  }
            }
            className='text-base p-1 w-48 rounded border border-gray-300'
            onChange={(e) => handleSettingsChange("language", e.target.value)}
          >
            {Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-end py-2'></div>
      </div>
    </div>
  );
};

export default Settings;
