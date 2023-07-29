import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";

const Documents = ({ selectedDocumentID, setSelectedDocumentID }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/documents", {
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
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='overflow-auto text-base'>
      <div className=''>
        <div
          id='header'
          className='grid grid-cols-7 text-left border-b-2 sticky top-0 ml-7  border-b-2 border-slate-100'
        >
          <div className='p-2 col-span-3 font-bold'>Name</div>
          <div className='p-2 col-span-2 font-bold'>Last Read Page</div>
          <div className='p-2 col-span-2 font-bold'>Upload Date</div>
        </div>
        {documents.map((doc) => (
          <div className='flex items-center'>
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
              onClick={() => handleDocumentClick(doc.docID)}
            >
              <div className='px-1 py-2 col-span-3'>{doc.docName}</div>
              <div className='px-1 py-2 col-span-2'>{doc.lastReadPage}</div>
              <div className='px-1 py-2 col-span-2'>{doc.uploadDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
