import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useEyeTracking = () => {
  const [eyeData, setEyeData] = useState([]);

  useEffect(() => {
    // Replace with your server URL
    const serverURL = "http://localhost:3001";

    // Establish a socket connection
    const socketConnection = io(serverURL);

    // Set up a listener for the 'eyeData' event
    socketConnection.on("eyeData", (data) => {
      setEyeData((prevData) => [...prevData, data]);
    });

    // Handle any cleanup
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return eyeData;
};

export default useEyeTracking;
