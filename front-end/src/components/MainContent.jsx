import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import FileViewer from "./FileViewer";
import axios from "axios";
import { apiURL, dark_primary, dark_secondary, light_primary, light_secondary } from "../consts";

const MainContent = () => {
  const { file, loading, userSettingsApi, setUserSettingsApi, userInfo } = useContext(Context);
  const { userID } = userInfo;
  const isDarkTheme = userSettingsApi.theme === "dark";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${apiURL}/get_settings`, {
          params: { userID },
        });
        const settings = response.data;
        setUserSettingsApi({
          zoom: settings.zoomLevel,
          theme: settings.theme,
          language: settings.selected_language,
        });
      } catch (err) {
      } finally {
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  return (
    <main
      className={`z-0 h-full w-full flex items-center flex-col text-xl text-gray-800`}
      style={
        isDarkTheme
          ? {
              backgroundColor: dark_secondary,
            }
          : {
              backgroundColor: light_secondary,
            }
      }
    >
      {loading && (
        <div
          className={`h-full flex items-center`}
          style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}
        >
          Loading Pdf Document...
        </div>
      )}
      {file.size !== 0 && !loading && <FileViewer />}
      {file.size === 0 && !loading && (
        <div className='flex flex-col items-center w-[40%] h-full mt-10'>
          <div
            className={`flex flex-col pt-20 items-center w-full h-full border border-[${light_secondary}] shadow rounded`}
            style={{
              backgroundColor: light_primary,
            }}
          >
            <div className='font-bold mb-8'>Welcome to the Eye Tracking System</div>
            <div className=''>No PDF uploaded</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;
