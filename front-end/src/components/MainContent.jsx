import React, { useContext } from "react";
import FileUpload from "./FileUpload";
import { Context } from "../context/context";
import FileViewer from "./FileViewer";

const MainContent = () => {
  const { file, loading } = useContext(Context);

  return (
    <main className='z-0 h-full w-full flex items-center flex-col text-xl text-gray-800 bg-[#525659] '>
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
      {loading && (
        <div className='h-full flex items-center text-slate-200'>
          Loading Pdf Document...
        </div>
      )}
      {file.size !== 0 && <FileViewer />}
    </main>
  );
};

export default MainContent;
