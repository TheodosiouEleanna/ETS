import { useContext, useState } from "react";
import axios from "axios";
import { Button } from "./ui/Button";
import { Context } from "../context/Context";
import { useSnackbar } from "../hooks/useSnackbar";
import { apiURL, dark_primary, light_primary } from "../consts";
import { getFontColorSecondary } from "../utils/functions";

function FileUpload() {
  const [pdfFile, setPdfFile] = useState(null);
  const { userInfo, setSelectedDocID, userSettingsApi } = useContext(Context);
  const { userID } = userInfo;
  const { triggerSnackbar, snackbarData } = useSnackbar();
  const isDarkTheme = userSettingsApi.theme === "dark";

  const submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("userID", userID);
    axios
      .post(`${apiURL}/upload_file`, formData, {
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
      <h1
        className='py-1 mb-4 text-xl font-bold text-gray-900 border-b border-gray-300'
        style={getFontColorSecondary(isDarkTheme)}
      >
        Upload File
      </h1>
      <div className='mb-6 text-gray-600' style={getFontColorSecondary(isDarkTheme)}>
        Choose a pdf file to upload and click Confirm to load the document.
      </div>
      <form onSubmit={submitFile} className='flex'>
        <input
          className={`w-96 bg-gray-500 hover:bg-gray-400 text-slate-200 py-1 px-2 rounded cursor-pointer text-base`}
          style={getFontColorSecondary(isDarkTheme)}
          type='file'
          id='file'
          accept='.pdf'
          onChange={handleFileUpload}
        />
        <Button
          type='submit'
          label='Upload'
          disabled={pdfFile === null}
          className={`bg-blue-500 p-4 mx-4 text-base active:scale-95 transform transition focus:outline-none shadow-lg`}
          style={
            isDarkTheme
              ? {
                  color: light_primary,
                }
              : {
                  color: dark_primary,
                }
          }
        />
      </form>
    </div>
  );
}

export default FileUpload;
