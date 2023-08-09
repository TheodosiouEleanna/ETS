import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { FaRegSquare, FaCheckSquare, FaCheck } from "react-icons/fa";
import { Button } from "./Button";
import { RiCloseFill, RiDeleteBin4Fill } from "react-icons/ri";
import Dialog from "./Dialog";

const Documents = ({ selectedDocumentID, setSelectedDocumentID }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(Context);
  const { userID } = userInfo;

  const handleDocumentClick = (docID) => {
    setSelectedDocumentID((prev) => {
      if (prev === docID) {
        return "";
      } else {
        return docID;
      }
    });
  };

  const onClickDelete = (id) => {
    setSelectedDocumentID(id);
    setShowDeleteDialog(true);
  };

  const onDialogClose = () => {
    setShowDeleteDialog(false);
  };

  const onDialogConfirm = () => {
    axios
      .delete("http://localhost:5000/api/delete_file", {
        params: {
          userID,
          docID: selectedDocumentID,
        },
      })
      .then((response) => {
        setShowDeleteDialog(false);
        setDocuments((prev) => {
          return prev.filter((doc) => doc.docID !== selectedDocumentID);
        });
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
      .get("http://localhost:5000/api/documents", {
        params: {
          userID,
        },
      })
      .then((response) => {
        console.log(response.data);
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
      <div className='text-base  bg-slate-200'>
        <div
          id='header'
          className='grid grid-cols-7 text-left border-b-2 sticky top-0 pl-10 pt-2 bg-slate-200 border-slate-100 w-full'
        >
          <div className='py-2 col-span-3 font-bold'>Document Name</div>
          <div className='py-2 col-span-1 font-bold'>Last Read Page</div>
          <div className='py-2 col-span-2 font-bold'>Upload Date</div>
          <div className='py-2 px-1 col-span-1 font-bold ml-[-15px]'>
            Actions
          </div>
        </div>
        {documents.map((doc) => (
          <div className='flex items-center px-4'>
            <div
              onClick={() => handleDocumentClick(doc.docID)}
              className='flex items-center justify-center h-6 w-6 text-gray-500 cursor-pointer m-1'
            >
              {selectedDocumentID === doc.docID ? (
                <FaCheckSquare />
              ) : (
                <FaRegSquare />
              )}
            </div>
            <div
              key={doc.docID}
              className={`grid grid-cols-7 text-left border-b-2 border-slate-100 top-0 hover:bg-gray-100 transition-colors duration-200 text-sm w-full ${
                selectedDocumentID === doc.docID ? "bg-gray-100" : ""
              }`}
              onDoubleClick={() => handleDocumentClick(doc.docID)}
            >
              <div className='flex items-center px-1 py-2 col-span-3 w-96 truncate'>
                {doc.docName}
              </div>
              <div className='flex items-center px-1 py-2 col-span-1'>
                {doc.lastReadPage}
              </div>
              <div className='flex items-center px-1 py-2 col-span-2'>
                {doc.uploadDate}
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
