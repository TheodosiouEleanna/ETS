import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import { createRedPoint, getGazePointCoordinates } from "../utils/eyeTracking";
import { isEmpty } from "lodash";
import { IContextProps } from "types/AppTypes";

const useEyeTracking = (): void => {
  const {
    isCalibrating,
    accumulateData,
    selectedEyeTracker,
    isEyeTrackerConnected,
    shouldSubscribe,
  } = useContext<IContextProps>(Context);
  const { address } = selectedEyeTracker;
  const hasSentMessage = useRef<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const serverURL = "ws://localhost:5001";

  useEffect(() => {
    if (isEyeTrackerConnected) {
      if (!socketRef.current) {
        console.log("Attempting to open WebSocket connection.");
        socketRef.current = new WebSocket(serverURL);

        socketRef.current.onopen = () => {
          console.log("WebSocket connection opened.");
          if (isCalibrating && !hasSentMessage.current) {
            const messageData = {
              action: "startCalibration",
              address,
            };
            socketRef.current?.send(JSON.stringify(messageData));
            hasSentMessage.current = true;
          }
        };

        socketRef.current.onclose = () => {
          console.log("WebSocket connection closed.");
          hasSentMessage.current = false;
        };

        socketRef.current.onerror = (error) => {
          console.error("WebSocket encountered an error: ", error);
        };

        socketRef.current.onmessage = (event) => {
          console.log(socketRef.current?.readyState);
          if (!isEmpty(event.data)) {
            try {
              accumulateData?.(event.data);
              const { pointX, pointY } = getGazePointCoordinates(event.data);
              createRedPoint(pointX, pointY);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        };
      }
      return () => {
        console.log("Stopping tracking and closing WebSocket.");
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEyeTrackerConnected, isCalibrating]);

  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (shouldSubscribe) {
        const messageData = {
          action: "startTracking",
          address,
        };
        socketRef.current.send(JSON.stringify(messageData));
      }
    }
  }, [address, shouldSubscribe]);
};

export default useEyeTracking;
