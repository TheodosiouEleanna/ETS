import React, { useContext } from "react";
import FileUpload from "./FileUpload";
import { Context } from "../context/context";
import FileViewer from "./FileViewer";

const MainContent = () => {
  const { file, loading } = useContext(Context);

  return (
    <main className='z-0 h-full w-full flex items-center flex-col text-xl font-bold text-gray-800 bg-[#525659] '>
      {file.size === 0 && !loading && (
        <div className='flex flex-col items-center w-[40%] h-96 mt-10'>
          <div>No PDF uploaded</div>
          <div className='flex flex-col justify-center items-center bg-gray-200 w-full h-full border border-gray-500 shadow rounded '>
            <FileUpload />
          </div>
        </div>
      )}
      {loading && <div> Loading Pdf Document...</div>}
      {file.size !== 0 && <FileViewer />}
    </main>
  );
};

export default MainContent;
