import { useCallback, useContext, useEffect, useState } from "react";
import { MdDensityMedium } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import Settings from "./Settings";
import Profile from "./Profile";
import { Button } from "./Button";
import Menu from "./Menu";
import { Context } from "../context/context";
import axios from "axios";
import Connection from "./Connection";

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const HeaderMenu = () => {
  const { file, logout } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [showConnectionModal, setShowConnectionModal] = useState("");
  const [eyeTrackers, setEyeTrackers] = useState([]);

  const buttonStyle = () => ({
    backgroundColor: connectionStatus === "connected" ? "green" : "",
  });

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
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
        console.log(response.data);
        // setConnectionStatus("selection");
        requestEyeTrackers();
      })
      .catch((error) => {
        // setConnectionStatus("error");
        console.error(error);
      });
  }, []);

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
    setIsOpen(false);
  };

  return (
    <div className='w-full flex justify-between items-center'>
      <div className='flex items-center'>
        <Button
          className='bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 mx-1'
          onClick={toggleOpen}
        >
          <MdDensityMedium className='text-xl' />
        </Button>
        {file.size !== 0 && (
          <Button
            label={capitalize(connectionStatus) || "Select Eye Tracker"}
            style={buttonStyle()}
            className='bg-gray-600 hover:bg-gray-500 text-white text-[1rem] px-4 mx-1'
            onClick={handleClick}
          ></Button>
        )}
        {showConnectionModal && (
          <Connection
            status={connectionStatus}
            connectToEyeTracker={connectToEyeTracker}
            updateStatus={updateStatus}
            onClose={onCloseConnection}
          />
        )}
        {isOpen && <Menu onCloseMenu={onCloseMenu} />}
      </div>
      <div className='relative'>
        {showProfile && <Profile onClick={onClickLogout} />}
        <Button
          className='bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 mx-1'
          onClick={toggleProfile}
        >
          <BsFillPersonFill className='text-xl' />
        </Button>
      </div>
    </div>
  );
};
