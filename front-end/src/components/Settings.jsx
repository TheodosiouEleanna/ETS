import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { languageMap } from "../consts";
import axios from "axios";

const Settings = () => {
  const { userSettingsUi, setUserSettingsUi, setUserSettingsApi, userInfo } =
    useContext(Context);
  const { userID } = userInfo;
  const { zoom, theme, language } = userSettingsUi;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSettingsChange = (key, value) => {
    if (key === "zoom") {
      value = value / 100;
    }
    setUserSettingsUi({ [key]: value });
  };

  useEffect(() => {
    setLoading(true);
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/get_settings`,
          {
            params: { userID },
          }
        );
        const settings = response.data;
        setUserSettingsApi({
          zoom: settings.zoomLevel,
          theme: settings.theme,
          language: settings.selected_language,
        });
        setUserSettingsUi({
          zoom: settings.zoomLevel,
          theme: settings.theme,
          language: settings.selected_language,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  if (loading) {
    return (
      <div className='flex justify-center items-center w-full h-full'>
        Loading documents...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='flex flex-col w-[500px] m-2 p-4'>
      <h1 className='py-1 mb-8 text-xl font-bold text-gray-900 border-b border-gray-300'>
        Settings
      </h1>
      <div className='mb-4 flex justify-between'>
        <label className='text-base text-gray-900'>Zoom Level</label>
        <div className='flex'>
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
          <p className='text-base text-gray-900 pl-4'>
            {(zoom * 100).toFixed()}%
          </p>
        </div>
      </div>
      <div className='mb-4 flex justify-between'>
        <label className='text-base text-gray-900'>Theme</label>
        <select
          className='text-base text-gray-900 p-1 w-48 rounded border border-gray-300'
          value={theme}
          onChange={(e) => handleSettingsChange("theme", e.target.value)}
        >
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </select>
      </div>
      <div className='mb-4 flex justify-between'>
        <label className='text-base text-gray-900'>Language</label>
        <select
          value={language}
          className='text-base text-gray-900 p-1 w-48 rounded border border-gray-300'
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
  );
};

export default Settings;
