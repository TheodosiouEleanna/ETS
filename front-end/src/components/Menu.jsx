import { useContext, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import Documents from "./Documents";
import { Context } from "../context/context";
import axios from "axios";
import FileUpload from "./FileUpload";
import Settings from "./Settings";
import Vocabulary from "./Vocabulary";

function Menu({ onCloseMenu }) {
  const { loadFile } = useContext(Context);
  const [selectedOption, setSelectedOption] = useState("settings");
  const [selectedDocumentID, setSelectedDocumentID] = useState("");

  const onConfirm = () => {
    onCloseMenu();
    if (selectedOption === "documents" || selectedOption === "upload") {
      axios
        .get("http://localhost:5000/api/get_file", {
          params: {
            docID: selectedDocumentID,
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
    }
  };

  const onClickUpload = () => {
    setSelectedOption("upload");
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "settings":
        return <Settings />;
      case "vocabulary":
        return <Vocabulary />;
      case "documents":
        return (
          <Documents
            selectedDocumentID={selectedDocumentID}
            setSelectedDocumentID={setSelectedDocumentID}
          />
        );
      case "upload":
        return <FileUpload setDocID={setSelectedDocumentID} />;
      default:
        return <div>Please select an option.</div>;
    }
  };

  return (
    <>
      <ModalWrapper
        className='w-[70%] h-[80vh] '
        title='Menu'
        onConfirm={onConfirm}
        onClickUpload={onClickUpload}
        shouldDisableConfirm={
          (selectedOption === "documents" || selectedOption === "upload") &&
          selectedDocumentID === ""
        }
        shouldShowUpload={selectedOption === "documents"}
        onClose={onCloseMenu}
      >
        <div className='flex border-2 border-slate-200 h-[85%]'>
          <div className='bg-[#323639] border rounded'>
            <div
              className={`cursor-pointer border-y-2 border-slate-200 border-b-0 p-1 w-48 text-base  hover:bg-[#525659] hover:text-blue-500 text-white px-4 py-2 ${
                selectedOption === "settings"
                  ? "text-blue-500 bg-[#525659]"
                  : ""
              }`}
              onClick={() => setSelectedOption("settings")}
            >
              Settings
            </div>
            <div
              className={`cursor-pointer border-y-2 border-slate-200 border-b-0 p-1 w-48 text-base bg-[#323639] hover:bg-[#525659] hover:text-blue-500 text-white px-4 py-2 ${
                selectedOption === "documents" || selectedOption === "upload"
                  ? "text-blue-500 bg-[#525659]"
                  : ""
              }`}
              onClick={() => setSelectedOption("documents")}
            >
              Documents
            </div>
            <div
              className={`cursor-pointer border-y-2 border-slate-200 p-1 w-48 text-base bg-[#323639] hover:bg-[#525659] hover:text-blue-500 text-white px-4 py-2  ${
                selectedOption === "vocabulary"
                  ? "text-blue-500 bg-[#525659]"
                  : ""
              }`}
              onClick={() => setSelectedOption("vocabulary")}
            >
              Vocabulary
            </div>
          </div>
          <div className='bg-[#323639] w-full rounded border-2 border-slate-200'>
            <div className='m-4 bg-slate-200 rounded h-[95%] overflow-y-scroll'>
              {renderContent()}
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export default Menu;
