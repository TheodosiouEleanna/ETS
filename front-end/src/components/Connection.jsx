import { useContext, useState } from "react";
import { Button } from "./Button";
import ModalWrapper from "./ModalWrapper";
import axios from "axios";
import { Context } from "../context/context";

const Connection = ({ status, updateStatus, connectToEyeTracker, onClose }) => {
  const { showConnectionModal } = useContext(Context);
  const [selectedEyeTracker, setSelectedEyeTracker] = useState("");
  const eyeTrackers = ["", "Eye Tracker 1", "Eye Tracker 2"]; // Replace with actual eye tracker names
  console.log({ showConnectionModal, status });
  const handleEyeTrackerChange = (e) => {
    setSelectedEyeTracker(e.target.value);
  };

  const handleConnect = () => {
    // Handle connect event here
    connectToEyeTracker();
    console.log(`Connecting to ${selectedEyeTracker}`);
    axios
      .post("http://localhost:5000/connect")
      .then((res) => {
        updateStatus("connected");
      })
      .catch((err) => {
        console.error(err);
        updateStatus("error");
      });
  };

  return (
    <ModalWrapper className='w-[700px] h-64' onClose={onClose}>
      <div className='flex justify-center w-full'>
        {status === "searching" && (
          <h1 className='text-xl font-bold text-gray-900'>Searching...</h1>
        )}
        {status === "selection" && (
          <div className='flex flex-col w-full justify-center items-center '>
            <h1 className=' text-xl font-bold text-gray-900 mb-8'>
              Select an Eye Tracker
            </h1>
            <div className='flex w-full justify-evenly'>
              <select
                value={selectedEyeTracker}
                className='text-gray-900 p-2 w-[26rem] rounded border border-gray-300 '
                onChange={handleEyeTrackerChange}
              >
                {eyeTrackers.map((tracker, index) => (
                  <option
                    className='text-gray-900 p-2 border border-gray-300 '
                    key={index}
                    value={tracker}
                  >
                    {tracker}
                  </option>
                ))}
              </select>
              <Button
                label='Connect'
                className='bg-blue-500 w-24 flex justify-center items-center'
                onClick={handleConnect}
                disabled={!selectedEyeTracker}
              />
            </div>
          </div>
        )}

        {status === "error" && <div className='text-gray-900'> Error </div>}
      </div>
    </ModalWrapper>
  );
};

export default Connection;
