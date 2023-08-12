import { useCallback, useContext, useState } from "react";
import { MdCastConnected, MdDensityMedium } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import Profile from "./Profile";
import { Button } from "./ui/Button";
import Menu from "./Menu";
import { Context } from "../context/context";
import axios from "axios";
import Connection from "./Connection";
import { useSnackbar } from "../hooks/useSnackbar";

export const HeaderMenu = () => {
  const { file, logout, isMenuOpen, setIsMenuOpen } = useContext(Context);
  const [showProfile, setShowProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [showConnectionModal, setShowConnectionModal] = useState("");
  const [eyeTrackers, setEyeTrackers] = useState([]);
  const [error, setError] = useState("");
  const { triggerSnackbar } = useSnackbar();

  const buttonStyle = () => ({
    backgroundColor: connectionStatus === "connected" ? "green" : "",
  });

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
      .get("http://localhost:5000/api/get-eye-trackers")
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
      .post("http://localhost:5000/api/search")
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
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className='ml-4 flex space-x-8'>
        <Button
          className='py-2 px-2 bg-[#323639] text-slate-200 rounded-full hover:scale-110 hover:bg-gray-500 transform transition-transform duration-300 active:scale-95 focus:outline-none  shadow-lg'
          onClick={toggleOpen}
        >
          <MdDensityMedium className='text-xl' />
        </Button>
        {file.size !== 0 && (
          <Button
            // label={capitalize(connectionStatus) || "Select Eye Tracker"}
            style={buttonStyle()}
            className='py-2 px-2 bg-[#323639] text-slate-200 rounded-full hover:scale-110 hover:bg-gray-500 transform transition-transform duration-300  active:scale-95 focus:outline-none  shadow-lg'
            onClick={handleClick}
          >
            <MdCastConnected className='text-xl' />
          </Button>
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
      <div className='relative'>
        {showProfile && <Profile onClick={onClickLogout} />}
        <Button
          className='py-2 px-2 bg-[#323639] text-slate-200 rounded-full hover:scale-110 hover:bg-gray-500 transform transition-transform duration-300 mr-4  active:scale-95 focus:outline-none  shadow-lg'
          onClick={toggleProfile}
        >
          <BsFillPersonFill className='text-xl' />
        </Button>
      </div>
    </>
  );
};
