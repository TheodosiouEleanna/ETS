import React, { useContext, useState } from "react";
import axios from "axios";
import { Button } from "./ui/Button";
import { Context } from "../context/Context";
import { useSnackbar } from "../hooks/useSnackbar";

function FileUpload() {
  const [pdfFile, setPdfFile] = useState(null);
  const { userInfo, setSelectedDocID } = useContext(Context);
  const { userID } = userInfo;
  const { triggerSnackbar, snackbarData } = useSnackbar();

  const submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("userID", userID);
    axios
      .post("http://localhost:5000/api/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        triggerSnackbar({
          message: "File uploaded successfully!",
          status: "success",
          open: true,
        });
        setSelectedDocID(response.data.docID);
      })
      .catch((error) => {
        triggerSnackbar({
          message: "File upload failed!",
          status: "error",
          open: true,
        });
      });
  };

  const handleFileUpload = (event) => {
    setPdfFile(event.target.files[0]);
  };

  return (
    <div className='flex flex-col m-2 p-4'>
      <h1 className='py-1 mb-4 text-xl font-bold text-gray-900 border-b border-gray-300'>
        Upload File
      </h1>
      <div className='mb-6 text-gray-600'>
        Choose a pdf file to upload and click Confirm to load the document.
      </div>
      <form onSubmit={submitFile} className='flex'>
        <input
          className='w-96 bg-gray-500 hover:bg-gray-400 text-slate-200 py-1 px-2 rounded cursor-pointer text-base'
          type='file'
          id='file'
          accept='.pdf'
          onChange={handleFileUpload}
        />
        {snackbarData.status !== "success" && (
          <Button
            type='submit'
            label='Upload'
            disabled={pdfFile === null}
            className='bg-blue-500 hover:bg-gray-400 text-slate-200 p-4 mx-4 text-base active:scale-95 transform transition focus:outline-none  shadow-lg'
          />
        )}
      </form>
    </div>
  );
}

export default FileUpload;
