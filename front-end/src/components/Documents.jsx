import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../context/Context";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";
import { Button } from "./ui/Button";
import { RiDeleteBin4Fill } from "react-icons/ri";
import Dialog from "./ui/Dialog";
import { apiURL, darkBg_secondary, lightBg_secondary } from "../consts";

const Documents = ({ onConfirm }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo, selectedDocID, setSelectedDocID, userSettingsApi } =
    useContext(Context);
  const { userID } = userInfo;
  const isDarkTheme = userSettingsApi.theme === "dark";

  const handleDocumentClick = (docID) => {
    if (selectedDocID === docID) {
      setSelectedDocID("");
    } else {
      setSelectedDocID(docID);
    }
  };

  const onDoubleClick = (id) => {
    setSelectedDocID(id);
    onConfirm(id);
  };

  const onClickDelete = (id) => {
    selectedDocID(id);
    setShowDeleteDialog(true);
  };

  const onDialogClose = () => {
    setShowDeleteDialog(false);
  };

  const onDialogConfirm = () => {
    axios
      .delete(`${apiURL}/delete_file`, {
        params: {
          userID,
          docID: selectedDocID,
        },
      })
      .then((response) => {
        setShowDeleteDialog(false);
        setDocuments((prev) => {
          return prev.filter((doc) => doc.docID !== selectedDocID);
        });
        setSelectedDocID(null);
        alert("File successfully deleted");
      })
      .catch((err) => {
        console.error(err);
        setShowDeleteDialog(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiURL}/documents`, {
        params: {
          userID,
        },
      })
      .then((response) => {
        setDocuments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userID]);

  if (loading) {
    return (
      <div className='flex justify-center items-center w-full h-full'>
        Loading documents...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {showDeleteDialog && (
        <Dialog
          title='Delete'
          content='Are you sure you want to delete this document?'
          onClose={onDialogClose}
          onConfirm={onDialogConfirm}
        />
      )}
      <div
        className={`text-base text-gray-800 `}
        style={{
          backgroundColor: isDarkTheme ? darkBg_secondary : lightBg_secondary,
        }}
      >
        <div
          id='header'
          className={`grid grid-cols-7 text-left border-b-2 sticky top-0 pl-10 pt-2 border-slate-100 w-full`}
          style={{
            color: isDarkTheme ? lightBg_secondary : darkBg_secondary,
            backgroundColor: isDarkTheme ? darkBg_secondary : lightBg_secondary,
          }}
        >
          <div className='py-2 col-span-3 font-bold'>Document name</div>
          <div className='py-2 col-span-1 font-bold'>Last read page</div>
          <div className='py-2 col-span-2 font-bold'>Upload date</div>
          <div className='py-2 px-1 col-span-1 font-bold ml-[-15px]'>
            Actions
          </div>
        </div>
        {documents.map((doc) => (
          <div
            className='flex items-center px-4'
            style={
              isDarkTheme
                ? { color: lightBg_secondary }
                : { color: darkBg_secondary }
            }
          >
            <div
              onClick={() => handleDocumentClick(doc.docID)}
              className='flex items-center justify-center h-6 w-6  cursor-pointer m-1'
              style={
                isDarkTheme
                  ? { color: lightBg_secondary }
                  : { color: darkBg_secondary }
              }
            >
              {selectedDocID === doc.docID ? (
                <FaCheckSquare />
              ) : (
                <FaRegSquare />
              )}
            </div>
            <div
              key={doc.docID}
              className={`grid grid-cols-7 text-left border-b-2 border-slate-100 top-0 hover:bg-[${
                isDarkTheme ? darkBg_secondary : lightBg_secondary
              }] transition-colors duration-200 text-sm w-full bg-[${
                selectedDocID === doc.docID
                  ? `${isDarkTheme ? darkBg_secondary : lightBg_secondary}`
                  : ""
              }]`}
              onDoubleClick={() => onDoubleClick(doc.docID)}
            >
              <div className='flex items-center px-1 py-2 col-span-3 w-96 truncate'>
                {doc.docName}
              </div>
              <div className='flex items-center px-1 py-2 col-span-1'>
                {doc.lastReadPage}
              </div>
              <div className='flex items-center px-1 py-2 col-span-2'>
                {doc.uploadDate.split(".")[0]}
              </div>
              <div className='flex items-center py-2 col-span-1'>
                <Button
                  className='p-0'
                  onClick={() => onClickDelete(doc.docID)}
                >
                  <RiDeleteBin4Fill className='text-[1.1rem] text-red-800 hover:text-red-700' />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Documents;
