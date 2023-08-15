import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import FileViewer from "./FileViewer";
import axios from "axios";

const MainContent = () => {
  const { file, loading, setUserSettingsApi, userInfo } = useContext(Context);
  const { userID } = userInfo;

  useEffect(() => {
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
      } catch (err) {
      } finally {
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  return (
    <main className='z-0 h-full w-full flex items-center flex-col text-xl text-gray-800 bg-[#525659] '>
      {loading && (
        <div className='h-full flex items-center text-slate-200'>
          Loading Pdf Document...
        </div>
      )}
      {file.size !== 0 && !loading && <FileViewer />}
      {file.size === 0 && !loading && (
        <div className='flex flex-col items-center w-[40%] h-full mt-10'>
          <div className='flex flex-col pt-20 items-center bg-slate-200  w-full h-full border border-gray-500 shadow rounded '>
            <div className='font-bold mb-8'>
              Welcome to the Eye Tracking System
            </div>
            <div className=''>No PDF uploaded</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;
