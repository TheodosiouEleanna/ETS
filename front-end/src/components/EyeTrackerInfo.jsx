import React from "react";

function EyeTrackerInfo({ tracker }) {
  return (
    <div className='tracker-info mt-8 p-4 w-full border rounded bg-gray-100 text-lg'>
      <h2 className='text-xl font-semibold mb-4 text-blue-500'>
        Eye tracker details
      </h2>
      <p className='mb-2 text-base'>
        <span className='font-semibold text-gray-800'>Model:</span>{" "}
        {tracker.model}
      </p>
      <p className='mb-2 text-base'>
        <span className='font-semibold text-gray-800'>Address:</span>{" "}
        {tracker.address}
      </p>
      <p className='mb-2 text-base'>
        <span className='font-semibold text-gray-800'>Name:</span>{" "}
        {tracker.device_name || "It's OK if this is empty"}
      </p>
      <p className='mb-2 text-base'>
        <span className='font-semibold text-gray-800'>Serial Number:</span>{" "}
        {tracker.serial_number}
      </p>
    </div>
  );
}

export default EyeTrackerInfo;
