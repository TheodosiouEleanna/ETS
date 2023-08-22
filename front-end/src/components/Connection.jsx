import { useContext, useState } from "react";
import { Button } from "./ui/Button";
import ModalWrapper from "./ui/ModalWrapper";
import axios from "axios";
import {
  darkBg_primary,
  darkBg_secondary,
  lightBg_primary,
  lightBg_secondary,
} from "../consts";
import EyeTrackerInfo from "./EyeTrackerInfo";
import { useSnackbar } from "../hooks/useSnackbar";
import { Context } from "../context/Context";

const Connection = ({
  status,
  error,
  setConnectionStatus,
  eyeTrackers,
  onClose,
}) => {
  const {
    userSettingsApi,
    selectedEyeTracker,
    setSelectedEyeTracker,
    setIsEyeTrackerConnected,
  } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";

  const { triggerSnackbar } = useSnackbar();

  const handleEyeTrackerChange = (e) => {
    const selected = eyeTrackers.find(
      (eye) => eye.device_name === e.target.value
    );
    console.log({ selected });
    setSelectedEyeTracker(selected);
  };

  const handleConnect = () => {
    console.log(`Connecting to ${selectedEyeTracker.device_name}`);
    axios
      .post("http://localhost:5000/api/connect", {
        address: selectedEyeTracker.address,
      })
      .then((response) => {
        setConnectionStatus("connected");
        setIsEyeTrackerConnected(true);
        triggerSnackbar({
          message: JSON.parse(response.data.message),
          status: "success",
          open: true,
        });
        console.log(JSON.parse(response.data.message));
      })
      .catch((err) => {
        console.error(err);
        setConnectionStatus("error");
        triggerSnackbar({
          message: "Connection failed!",
          status: "error",
          open: true,
        });
      });
  };

  return (
    <ModalWrapper
      className='w-[700px] h-[28rem] px-12 py-12'
      shouldShowConfirm={false}
      onClose={onClose}
    >
      <div className='flex flex-col w-full h-full'>
        {status === "searching" && (
          <h1
            className='text-xl'
            style={
              isDarkTheme
                ? { color: lightBg_secondary }
                : { color: darkBg_secondary }
            }
          >
            Searching...
          </h1>
        )}
        {status === "connected" && (
          <h1
            className='text-xl'
            style={
              isDarkTheme
                ? { color: lightBg_secondary }
                : { color: darkBg_secondary }
            }
          >
            Connected !
          </h1>
        )}
        {status === "selection" && (
          <div className='flex flex-col w-full'>
            <h1 className=' text-xl font-bold text-blue-500  mb-8'>
              Found {eyeTrackers.length} eye trackers.
            </h1>
            <div className='flex w-full items-center text-lg'>
              <div
                className='mr-4'
                style={
                  isDarkTheme
                    ? {
                        color: lightBg_secondary,
                      }
                    : {
                        color: darkBg_primary,
                      }
                }
              >
                Select:
              </div>
              <select
                style={
                  isDarkTheme
                    ? {
                        backgroundColor: darkBg_secondary,
                        color: lightBg_secondary,
                      }
                    : {
                        backgroundColor: lightBg_primary,
                        color: darkBg_primary,
                      }
                }
                value={selectedEyeTracker?.device_name || ""}
                className='text-gray-800 text-base p-2 w-[26rem] rounded border border-gray-300'
                onChange={handleEyeTrackerChange}
              >
                {[{ device_name: "" }, ...eyeTrackers].map((tracker, index) => (
                  <option
                    style={
                      isDarkTheme
                        ? {
                            color: lightBg_secondary,
                          }
                        : {
                            color: darkBg_primary,
                          }
                    }
                    className='text-gray-800 p-2 border border-gray-300 '
                    key={index}
                    // value={`${tracker.device_name}/${tracker.address}`}
                  >
                    {`${tracker.device_name}`}
                  </option>
                ))}
              </select>
              <Button
                label='Connect'
                className={`bg-blue-500 w-24 h-10 flex justify-center items-center mx-8 text-base  active:scale-95 transform transition focus:outline-none  shadow-lg`}
                onClick={handleConnect}
                disabled={!selectedEyeTracker?.device_name}
              />
            </div>
            {selectedEyeTracker && (
              <EyeTrackerInfo tracker={selectedEyeTracker} />
            )}
          </div>
        )}
        {status === "error" && <div className='text-red-800'> {error} </div>}
      </div>
    </ModalWrapper>
  );
};

export default Connection;
