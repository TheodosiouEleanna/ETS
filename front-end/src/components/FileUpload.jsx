import React, { useContext, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { Context } from "../context/context";

function FileUpload() {
  const [pdfFile, setPdfFile] = useState();
  const { setLoading, loadFile, userInfo } = useContext(Context);
  const { userID } = userInfo;

  console.log({ userID });

  const submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("userID", userID);
    axios
      .post("http://localhost:5000/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("File uploaded successfully.");
        setLoading(true);
        axios
          .get("http://localhost:5000/get_file", {
            params: {
              docID: response.data.docID,
            },
            responseType: "blob",
          })
          .then((response) => {
            const fileBlob = new Blob([response.data], {
              type: response.data.type,
            });
            loadFile(fileBlob);
          })
          .catch((error) => {
            alert("Failed to load file.");
          });
      })
      .catch((error) => {
        alert("Failed to upload file.");
      });
  };

  const handleFileUpload = (event) => {
    setPdfFile(event.target.files[0]);
  };

  return (
    <form onSubmit={submitFile} className='flex'>
      <input
        className='w-96 bg-gray-500 hover:bg-gray-400 text-white py-1 px-2 mx-2 rounded cursor-pointer'
        type='file'
        id='file'
        accept='.pdf'
        onChange={handleFileUpload}
      />
      <Button
        type='submit'
        label='Upload'
        className='bg-blue-500 hover:bg-gray-400 text-white p-4 mx-2 rounded'
      />
    </form>
  );
}

export default FileUpload;
