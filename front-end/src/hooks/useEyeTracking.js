import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import { createRedPoint, getGazePointCoordinates } from "../utils/eyeTracking";
import { isEmpty } from "lodash";

const useEyeTracking = () => {
  const { selectedEyeTracker, isEyeTrackerConnected, accumulateData } =
    useContext(Context);
  const { address } = selectedEyeTracker;
  const hasSentMessage = useRef(false);
  const socketRef = useRef(null);
  const serverURL = "ws://localhost:5001";
  // console.log("Socket readyState:", socketRef.current?.readyState);

  useEffect(() => {
    if (isEyeTrackerConnected) {
      console.log("I run on open");
      if (!hasSentMessage.current) {
        socketRef.current = new WebSocket(serverURL);
        socketRef.current.onopen = () => {
          // Send a message to the server once the socket is open
          console.log(
            "Why do you run?",
            isEyeTrackerConnected,
            hasSentMessage.current
          );
          socketRef.current.send("startTracking");
        };
        hasSentMessage.current = true;
      }
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

  useEffect(() => {
    if (isEyeTrackerConnected) {
      console.log("I run on message");
      socketRef.current.onmessage = (event) => {
        // console.log(event.data);
        console.log(socketRef.current.readyState);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEyeTrackerConnected]);

  useEffect(() => {
    if (!isEyeTrackerConnected) {
      console.log("I run on stop tracking");
      socketRef.current?.close();
      hasSentMessage.current = false;
    }
  }, [isEyeTrackerConnected]);

  useEffect(() => {
    if (isEyeTrackerConnected) {
      console.log("I run on error or on close");
      socketRef.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      // socketRef.current.onclose = (event) => {
      //   console.log("Closed ");
      //   if (event.wasClean) {
      //     console.log(
      //       `Closed cleanly, code=${event.code}, reason=${event.reason}`
      //     );
      //   } else {
      //     console.error("Connection died");
      //   }
      // };
    }
  }, [isEyeTrackerConnected]);
};

export default useEyeTracking;
