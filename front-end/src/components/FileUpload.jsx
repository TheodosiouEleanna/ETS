import React, { useContext, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { Context } from "../context/context";

function FileUpload() {
  const [pdfFile, setPdfFile] = useState();
  const { file, userInfo, setSelectedDocID } = useContext(Context);
  const { userID } = userInfo;

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
        alert("File uploaded successfully.");
        setSelectedDocID(response.data.docID);
      })
      .catch((error) => {
        alert("Failed to upload file.");
      });
  };

  const handleFileUpload = (event) => {
    setPdfFile(event.target.files[0]);
  };

  return (
    <div className='flex flex-col w-[500px] m-2 p-4'>
      <h1 className='py-1 mb-8 text-xl font-bold text-gray-900 border-b border-gray-300'>
        Upload File
      </h1>
      <form onSubmit={submitFile} className='flex'>
        <input
          className='w-96 bg-gray-500 hover:bg-gray-400 text-white py-1 px-2 mx-2 rounded cursor-pointer text-base'
          type='file'
          id='file'
          accept='.pdf'
          onChange={handleFileUpload}
        />
        <Button
          type='submit'
          label='Upload'
          disabled={file.size !== 0}
          className='bg-blue-500 hover:bg-gray-400 text-white p-4 mx-2 rounded text-base'
        />
      </form>
    </div>
  );
}

export default FileUpload;
