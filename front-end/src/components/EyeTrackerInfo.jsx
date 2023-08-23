import React, { useContext } from "react";
import { dark_primary, dark_secondary, light_primary, light_secondary } from "../consts";
import { Context } from "../context/Context";

// export dark_primary IEyeTracker {
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
              backgroundColor: dark_primary,
            }
          : {
              backgroundColor: light_primary,
            }
      }
    >
      <h2 className='text-xl font-semibold mb-4 text-blue-500'>Eye tracker details</h2>
      <p className='mb-2 text-base' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
        <span className='font-semibold' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
          Model:
        </span>{" "}
        {tracker.model}
      </p>
      <p className='mb-2 text-base' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
        <span className='font-semibold' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
          Address:
        </span>{" "}
        {tracker.address}
      </p>
      <p className='mb-2 text-base' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
        <span className='font-semibold' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
          Name:
        </span>{" "}
        {tracker.device_name}
      </p>
      <p className='mb-2 text-base' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
        <span className='font-semibold' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
          Serial Number:
        </span>{" "}
        {tracker.serial_number}
      </p>
      <p className='mb-2 text-base' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
        <span className='font-semibold' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
          Firmware version:
        </span>{" "}
        {tracker.firmware_version}
      </p>
    </div>
  );
};

export default EyeTrackerInfo;
