import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";

const useEyeTracking = () => {
  const [eyeData, setEyeData] = useState([]);
  const { selectedEyeTracker, isEyeTrackerConnected } = useContext(Context);
  const { address } = selectedEyeTracker;

  useEffect(() => {
    console.log("I run");
    const serverURL = "ws://localhost:5001";
    const socket = new WebSocket(serverURL);
    if (isEyeTrackerConnected) {
      socket.onopen = () => {
        // Send a message to the server once the socket is open
        socket.send("startTracking");
      };

      // socket.onmessage = (event) => {
      //   // Handle data received from the server
      //   const data = JSON.parse(event.data);
      //   console.log({ data });
      // };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(
            `Closed cleanly, code=${event.code}, reason=${event.reason}`
          );
        } else {
          console.error("Connection died");
        }
      };
    } else {
      socket.close();
    }
    return () => {
      // Clean up the socket when the component is destroyed
      socket.close();
    };
  }, [address, isEyeTrackerConnected]);

  return eyeData;
};

export default useEyeTracking;
