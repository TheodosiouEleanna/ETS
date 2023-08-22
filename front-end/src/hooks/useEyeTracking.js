import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Context } from "../context/Context";

const useEyeTracking = () => {
  const [eyeData, setEyeData] = useState([]);
  const { selectedEyeTracker, isEyeTrackerConnected } = useContext(Context);
  const { address } = selectedEyeTracker;

  useEffect(() => {
    console.log("I run");
    const serverURL = "http://localhost:5001";
    if (isEyeTrackerConnected) {
      // Replace with your server URL
      // Todo: Add this to app settings

      // Establish a socket connection
      const socketConnection = io(serverURL, {
        transports: ["websocket"],
      });
      socketConnection.emit("startTracking", address);

      // Set up a listener for the 'eyeData' event
      // socketConnection.on("eyeData", (data) => {
      //   setEyeData((prevData) => [...prevData, data]);
      // });

      // Handle any cleanup
      return () => {
        socketConnection.disconnect();
      };
    }
  }, [address, isEyeTrackerConnected]);

  return eyeData;
};

export default useEyeTracking;
