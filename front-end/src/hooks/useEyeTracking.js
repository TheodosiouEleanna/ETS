import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import { createRedPoint, getGazePointCoordinates } from "../utils/eyeTracking";
import { isEmpty } from "lodash";

const useEyeTracking = () => {
  const { selectedEyeTracker, isEyeTrackerConnected, accumulateData, shouldSubscribe } = useContext(Context);
  const { address } = selectedEyeTracker;
  const hasSentMessage = useRef(false);
  const socketRef = useRef(null);
  const serverURL = "ws://localhost:5001";

  useEffect(() => {
    console.log("I run");
    socketRef.current = new WebSocket(serverURL);
    if (isEyeTrackerConnected) {
      if (!hasSentMessage.current) {
        socketRef.current.onopen = () => {
          // Send a message to the server once the socket is open
          socketRef.current.send("startTracking", selectedEyeTracker.address);
        };
        hasSentMessage.current = true;
      }

      socketRef.current.onmessage = (event) => {
        console.log(event.data);
        if (!isEmpty(event.data)) {
          try {
            accumulateData(event.data);
            const { pointX, pointY } = getGazePointCoordinates(event.data);
            createRedPoint(pointX, pointY);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      if (!shouldSubscribe) {
        socketRef.current.send("stopTracking");
      }

      socketRef.current.onclose = (event) => {
        console.log("Closed ");
        if (event.wasClean) {
          console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          console.error("Connection died");
        }
      };
    }
    //  else {
    //   socket.close();
    // }
    //  return () => {
    //    if (socketRef.current) {
    //      socketRef.current.close();
    //      socketRef.current = null;
    //    }
    //  };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isEyeTrackerConnected]);
};

export default useEyeTracking;
