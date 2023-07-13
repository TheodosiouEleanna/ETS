import React, { useContext, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { Context } from "../context/context";

function FileUpload() {
  const [pdfFile, setPdfFile] = useState();
  const { file, loading, setLoading, loadFile } = useContext(Context);

  const submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", pdfFile);
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
              docID: response.data.docID, // Replace with the actual document ID you want to retrieve
            },
            responseType: "blob", // Important for handling binary data
          })
          .then((response) => {
            // Create a blob from the file data
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
    <form onSubmit={submitFile}>
      <input
        className='w-96 bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 mr-8 rounded cursor-pointer'
        type='file'
        id='file'
        accept='.pdf'
        onChange={handleFileUpload}
      />
      <Button
        type='submit'
        label='Upload'
        className='bg-gray-500 hover:bg-gray-400 text-white font-bold py-3 mx-2 px-4 rounded'
      />
    </form>
  );
}

export default FileUpload;
