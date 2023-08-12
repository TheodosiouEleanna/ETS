import { useState } from "react";
import { Button } from "./ui/Button";
import ModalWrapper from "./ui/ModalWrapper";
import axios from "axios";
import { eyeTrackers } from "../consts";
import EyeTrackerInfo from "./EyeTrackerInfo";
import { useSnackbar } from "../hooks/useSnackbar";

const Connection = ({
  status,
  error,
  updateStatus,
  connectToEyeTracker,
  onClose,
}) => {
  const [selectedEyeTracker, setSelectedEyeTracker] = useState(
    eyeTrackers[0] || {}
  );
  const { triggerSnackbar } = useSnackbar();

  const handleEyeTrackerChange = (e) => {
    const selected = eyeTrackers.find(
      (eye) => eye.device_name === e.target.value
    );
    setSelectedEyeTracker(selected);
  };

  const handleConnect = () => {
    // Handle connect event here
    connectToEyeTracker();
    console.log(`Connecting to ${selectedEyeTracker}`);
    axios
      .post("http://localhost:5000/connect")
      .then((res) => {
        updateStatus("connected");
        triggerSnackbar({
          message: "Connected successfully!",
          status: "success",
          open: true,
        });
      })
      .catch((err) => {
        console.error(err);
        updateStatus("error");
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
          <h1 className='text-xl text-gray-900'>Searching...</h1>
        )}
        {status === "selection" && (
          <div className='flex flex-col w-full'>
            <h1 className=' text-xl font-bold text-blue-500  mb-8'>
              Found {eyeTrackers.length} eye trackers.
            </h1>
            <div className='flex w-full items-center text-lg'>
              <div className='mr-4'>Select:</div>
              <select
                value={selectedEyeTracker.device_name || ""}
                className='text-gray-800 text-base p-2 w-[26rem] rounded border border-gray-300 '
                onChange={handleEyeTrackerChange}
              >
                {eyeTrackers.map((tracker, index) => (
                  <option
                    className='text-gray-800 p-2 border border-gray-300 '
                    key={index}
                    value={tracker.device_name}
                  >
                    {tracker.device_name}
                  </option>
                ))}
              </select>
              <Button
                label='Connect'
                className='bg-blue-500 w-24 h-10 flex justify-center items-center text-slate-200 mx-8 text-base  active:scale-95 transform transition focus:outline-none  shadow-lg'
                onClick={handleConnect}
                disabled={!selectedEyeTracker}
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
