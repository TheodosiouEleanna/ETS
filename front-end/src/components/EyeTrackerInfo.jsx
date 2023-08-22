import React, { useContext } from "react";
import {
  darkBg_primary,
  darkBg_secondary,
  lightBg_primary,
  lightBg_secondary,
} from "../consts";
import { Context } from "../context/Context";

// export interface IEyeTracker {
//   address: string;
//   device_capabilities: string[];
//   device_name: string;
//   firmware_version: string;
//   model: string;
//   runtime_version: string;
//   serial_number: string;
// }

const EyeTrackerInfo = ({ tracker }) => {
  const { userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";
  return (
    <div
      className={`tracker-info mt-8 p-4 w-full rounded text-lg`}
      style={
        isDarkTheme
          ? {
              backgroundColor: darkBg_primary,
            }
          : {
              backgroundColor: lightBg_primary,
            }
      }
    >
      <h2 className='text-xl font-semibold mb-4 text-blue-500'>
        Eye tracker details
      </h2>
      <p
        className='mb-2 text-base'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        <span
          className='font-semibold'
          style={
            isDarkTheme
              ? { color: lightBg_secondary }
              : { color: darkBg_secondary }
          }
        >
          Model:
        </span>{" "}
        {tracker.model}
      </p>
      <p
        className='mb-2 text-base'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        <span
          className='font-semibold'
          style={
            isDarkTheme
              ? { color: lightBg_secondary }
              : { color: darkBg_secondary }
          }
        >
          Address:
        </span>{" "}
        {tracker.address}
      </p>
      <p
        className='mb-2 text-base'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        <span
          className='font-semibold'
          style={
            isDarkTheme
              ? { color: lightBg_secondary }
              : { color: darkBg_secondary }
          }
        >
          Name:
        </span>{" "}
        {tracker.device_name}
      </p>
      <p
        className='mb-2 text-base'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        <span
          className='font-semibold'
          style={
            isDarkTheme
              ? { color: lightBg_secondary }
              : { color: darkBg_secondary }
          }
        >
          Serial Number:
        </span>{" "}
        {tracker.serial_number}
      </p>
      <p
        className='mb-2 text-base'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        <span
          className='font-semibold'
          style={
            isDarkTheme
              ? { color: lightBg_secondary }
              : { color: darkBg_secondary }
          }
        >
          Firmware version:
        </span>{" "}
        {tracker.firmware_version}
      </p>
    </div>
  );
};

export default EyeTrackerInfo;
