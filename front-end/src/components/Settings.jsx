import React, { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { Button } from "./Button";
import Loader from "./Loader";
import languageMap from "../consts";
import ModalWrapper from "./ModalWrapper";

const SettingsModal = ({ onClick }) => {
  const { zoom, userInfo, userSettings, setUserSettings } = useContext(Context);
  const { userID } = userInfo;
  const {
    zoomLevel: savedZoomLevel,
    theme: savedTheme,
    language: savedLanguage,
  } = userSettings;

  const [zoomLevel, setZoomLevel] = useState(savedZoomLevel);
  const [theme, setTheme] = useState(savedTheme);
  const [language, setLanguage] = useState(savedLanguage);
  const [loading, setLoading] = useState(false);

  const handleZoomChange = (value) => {
    setZoomLevel(value);
  };

  const handleConfirm = () => {
    setLoading(true);
    // TOdo: Update the context when request finishes
    axios
      .post("http://localhost:5000/settings", {
        userID,
        zoomLevel: zoomLevel / 100,
        theme,
        language,
      })
      .then((res) => {
        setLoading(false);
        onClick();
        setUserSettings({ language, theme, zoomLevel });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <ModalWrapper className='w-[700px] h-96' onClose={onClick}>
      <div className='mx-8'>
        <div className='flex justify-center w-full'>
          <h1 className='mb-8 text-xl font-bold text-gray-900'>Settings</h1>
        </div>
        <div className='mb-4 flex justify-between'>
          <label className='text-gray-900'>Zoom Level</label>
          <div className='flex'>
            <input
              type='range'
              min='50'
              max='200'
              value={zoomLevel}
              onChange={(e) => handleZoomChange(e.target.value)}
              className='slider text-gray-900 p-1 h-10 rounded border border-gray-300'
            />
            <p className='text-gray-900 pl-4'>{zoomLevel}%</p>
          </div>
        </div>
        <div className='mb-4 flex justify-between'>
          <label className='text-gray-900'>Theme</label>
          <select
            className='text-gray-900 p-1 w-48 rounded border border-gray-300'
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
          </select>
        </div>
        <div className='mb-4 flex justify-between'>
          <label className='text-gray-900'>Language</label>
          <select
            value={language}
            className='text-gray-900 p-1 w-48 rounded border border-gray-300'
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-end py-2'>
          <Button
            label={loading ? "" : "Confirm"}
            className='bg-blue-500 w-24 flex justify-center items-center'
            onClick={handleConfirm}
          >
            {loading && <Loader />}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default SettingsModal;
