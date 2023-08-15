import { useContext, useState } from "react";
import ModalWrapper from "./ui/ModalWrapper";
import Documents from "./Documents";
import { Context } from "../context/Context";
import axios from "axios";
import FileUpload from "./FileUpload";
import Settings from "./Settings";
import Vocabulary from "./Vocabulary";
import { useSnackbar } from "../hooks/useSnackbar";

function Menu({ onCloseMenu }) {
  const {
    file,
    loadFile,
    setLoading,
    selectedDocID,
    userInfo,
    userSettingsUi,
    setUserSettingsApi,
  } = useContext(Context);
  const { zoom, theme, language } = userSettingsUi;
  const { userID } = userInfo;
  const [selectedOption, setSelectedOption] = useState("settings");
  const [loadingMenu, setLoadingMenu] = useState(false);
  const { triggerSnackbar } = useSnackbar();

  const onConfirm = (id) => {
    onCloseMenu();
    setLoadingMenu(true);
    if (selectedOption === "settings") {
      setLoading(true);
      axios
        .post("http://localhost:5000/api/settings", {
          userID,
          zoomLevel: zoom,
          theme,
          language,
        })
        .then((res) => {
          setLoadingMenu(false);
          loadFile(file);
          setLoading(false);
          setUserSettingsApi({
            zoom,
            theme,
            language,
          });
          triggerSnackbar({
            message: "Settings saved successfully!",
            status: "success",
            open: true,
          });
        })
        .catch((err) => {
          console.error(err);
          setLoadingMenu(false);
        });
    }
    if (selectedOption === "documents" || selectedOption === "upload") {
      axios
        .get("http://localhost:5000/api/get_file", {
          params: {
            docID: id || selectedDocID,
          },
          responseType: "blob",
        })
        .then((response) => {
          const fileBlob = new Blob([response.data], {
            type: response.data.type,
          });
          setLoadingMenu(false);
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
        return <Settings onConfirm={onConfirm} />;
      case "vocabulary":
        return <Vocabulary onConfirm={onConfirm} />;
      case "documents":
        return <Documents onConfirm={onConfirm} />;
      case "upload":
        return <FileUpload />;
      default:
        return <div>Please select an option.</div>;
    }
  };

  return (
    <>
      <ModalWrapper
        loading={loadingMenu}
        className='w-[70%] h-[80vh] '
        title='Menu'
        onConfirm={onConfirm}
        onClickUpload={onClickUpload}
        shouldDisableConfirm={
          (selectedOption === "documents" || selectedOption === "upload") &&
          selectedDocID === ""
        }
        shouldShowUpload={selectedOption === "documents"}
        onClose={onCloseMenu}
      >
        <div className='flex border-2 border-slate-200 h-[64vh]'>
          <div className='bg-[#323639] border rounded'>
            <div
              className={`cursor-pointer border-bottom-2 border-slate-200 border-b-0 p-1 w-48 text-base  hover:bg-[#525659] hover:text-blue-500 text-white px-4 py-2 ${
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
          <div className='bg-[#323639] w-full rounded border-2 h-[63.7vh] border-slate-200 '>
            <div className='bg-slate-200 h-full w-full rounded overflow-y-scroll  border-[1rem] border-[#323639]'>
              {renderContent()}
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export default Menu;
