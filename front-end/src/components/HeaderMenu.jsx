import { useCallback, useContext, useMemo, useState } from "react";
import { MdCastConnected, MdDensityMedium } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import Profile from "./Profile";
import { Button } from "./ui/Button";
import Menu from "./Menu";
import { Context } from "../context/Context";
import axios from "axios";
import Connection from "./Connection";
import { useSnackbar } from "../hooks/useSnackbar";
import { isEqual } from "lodash";
import Dialog from "./ui/Dialog";
import Tooltip from "./ui/Tooltip";
import {
  apiURL,
  darkBg_primary,
  darkBg_secondary,
  lightBg_primary,
  lightBg_secondary,
} from "../consts";

export const HeaderMenu = () => {
  const {
    file,
    logout,
    isMenuOpen,
    setIsMenuOpen,
    userSettingsUi,
    userSettingsApi,
  } = useContext(Context);
  const [showProfile, setShowProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [showConnectionModal, setShowConnectionModal] = useState("");
  const [eyeTrackers, setEyeTrackers] = useState([]);
  const [error, setError] = useState("");
  const { triggerSnackbar } = useSnackbar();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const areSettingsEqual = useMemo(
    () => isEqual(userSettingsUi, userSettingsApi),
    [userSettingsApi, userSettingsUi]
  );

  const buttonStyle = () => ({
    backgroundColor: connectionStatus === "connected" ? "green" : "",
  });

  const isDarkTheme = userSettingsApi.theme === "dark";

  const toggleOpen = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const requestEyeTrackers = () => {
    axios
      .get(`${apiURL}/get-eye-trackers`)
      .then((response) => {
        // Store the eye trackers in state
        setEyeTrackers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const toggleEyeTrackerSearch = useCallback(() => {
    axios
      .post(`${apiURL}/search`)
      .then((response) => {
        setConnectionStatus("selection");
        requestEyeTrackers();
      })
      .catch((error) => {
        // setConnectionStatus("error");
        setConnectionStatus("selection");
        triggerSnackbar({
          message: "Search failed!",
          status: "error",
          open: true,
        });
        setError(error.message);
        console.error(error);
      });
  }, [triggerSnackbar]);

  const connectToEyeTracker = () => {
    console.log("connection!!!!!!");
  };

  const handleClick = useCallback(() => {
    setShowConnectionModal(true);
    setConnectionStatus("searching");
    toggleEyeTrackerSearch();
  }, [toggleEyeTrackerSearch]);

  const onClickLogout = () => {
    logout();
  };

  const updateStatus = (status) => {
    setConnectionStatus(status);
  };

  const onCloseConnection = () => {
    if (connectionStatus === "connected") {
      setShowConnectionModal(false);
    } else {
      setConnectionStatus("");
      setShowConnectionModal(false);
    }
  };

  const onCloseMenu = () => {
    if (!areSettingsEqual) {
      setShowDiscardDialog(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const onDialogConfirm = () => {
    setShowDiscardDialog(false);
    setIsMenuOpen(false);
  };

  const onDialogClose = () => {
    setShowDiscardDialog(false);
  };

  return (
    <>
      {showDiscardDialog && (
        <Dialog
          title='Discard'
          content='Are you sure you want to discard your changes?'
          onClose={onDialogClose}
          onConfirm={onDialogConfirm}
        />
      )}
      <div className='ml-4 flex space-x-8'>
        <Tooltip
          content='Menu'
          position='right'
          color={isDarkTheme ? lightBg_secondary : darkBg_secondary}
        >
          <Button
            className={`py-2 px-2 rounded-full hover:scale-110 ${
              isDarkTheme
                ? "bg-darkBg_primary hover:bg-darkHoverColor"
                : "bg-lightBg_secondary hover:bg-lightHoverColor"
            } transform transition-transform duration-300 active:scale-95 focus:outline-none`}
            onClick={toggleOpen}
          >
            <MdDensityMedium
              className='text-xl'
              style={
                isDarkTheme
                  ? { color: lightBg_secondary }
                  : { color: darkBg_secondary }
              }
            />
          </Button>
        </Tooltip>
        {file.size !== 0 && (
          <Tooltip
            content='Connection'
            position='right'
            color={isDarkTheme ? lightBg_secondary : darkBg_secondary}
          >
            <Button
              className={`py-2 px-2 rounded-full hover:scale-110 ${
                isDarkTheme
                  ? "bg-darkBg_primary hover:bg-darkHoverColor"
                  : "bg-lightBg_secondary hover:bg-lightHoverColor"
              } transform transition-transform duration-300 active:scale-95 focus:outline-none`}
              onClick={handleClick}
            >
              <MdCastConnected
                className='text-xl'
                style={
                  isDarkTheme
                    ? { color: lightBg_secondary }
                    : { color: darkBg_secondary }
                }
              />
            </Button>
          </Tooltip>
        )}
        {showConnectionModal && (
          <Connection
            error={error}
            status={connectionStatus}
            connectToEyeTracker={connectToEyeTracker}
            updateStatus={updateStatus}
            onClose={onCloseConnection}
          />
        )}
        {isMenuOpen && <Menu onCloseMenu={onCloseMenu} />}
      </div>
      <div className='ml-[-35px]'>
        <img
          src={isDarkTheme ? "./logo5.png" : "./logo_light.png"}
          alt=''
          className='h-[2.3rem]'
        />
      </div>
      <div className='relative mr-4'>
        {showProfile && <Profile onClick={onClickLogout} />}
        <Tooltip
          content='Profile'
          position='left'
          color={isDarkTheme ? lightBg_secondary : darkBg_secondary}
        >
          <Button
            className={`py-2 px-2 rounded-full hover:scale-110 ${
              isDarkTheme
                ? "bg-darkBg_primary hover:bg-darkHoverColor"
                : "bg-lightBg_secondary hover:bg-lightHoverColor"
            } transform transition-transform duration-300 active:scale-95 focus:outline-none`}
            onClick={toggleProfile}
          >
            <BsFillPersonFill
              className='text-xl'
              style={
                isDarkTheme
                  ? { color: lightBg_secondary }
                  : { color: darkBg_secondary }
              }
            />
          </Button>
        </Tooltip>
      </div>
    </>
  );
};
