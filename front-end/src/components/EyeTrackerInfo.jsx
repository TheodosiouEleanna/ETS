import React, { useContext } from "react";
import { dark_primary, dark_secondary, light_primary, light_secondary } from "../consts";
import { Context } from "../context/Context";
import { getFontColorSecondary } from "../utils/functions";

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
      <p className='mb-2 text-base' style={{ color: getFontColorSecondary(isDarkTheme) }}>
        <span className='font-semibold' style={{ color: getFontColorSecondary(isDarkTheme) }}>
          Model:
        </span>{" "}
        {tracker.model}
      </p>
      <p className='mb-2 text-base' style={{ color: getFontColorSecondary(isDarkTheme) }}>
        <span className='font-semibold' style={{ color: getFontColorSecondary(isDarkTheme) }}>
          Address:
        </span>{" "}
        {tracker.address}
      </p>
      <p className='mb-2 text-base' style={{ color: getFontColorSecondary(isDarkTheme) }}>
        <span className='font-semibold' style={{ color: getFontColorSecondary(isDarkTheme) }}>
          Name:
        </span>{" "}
        {tracker.device_name}
      </p>
      <p className='mb-2 text-base' style={{ color: getFontColorSecondary(isDarkTheme) }}>
        <span className='font-semibold' style={{ color: getFontColorSecondary(isDarkTheme) }}>
          Serial Number:
        </span>{" "}
        {tracker.serial_number}
      </p>
      <p className='mb-2 text-base' style={{ color: getFontColorSecondary(isDarkTheme) }}>
        <span className='font-semibold' style={{ color: getFontColorSecondary(isDarkTheme) }}>
          Firmware version:
        </span>{" "}
        {tracker.firmware_version}
      </p>
    </div>
  );
};

export default EyeTrackerInfo;
