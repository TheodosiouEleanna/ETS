import { useContext, useEffect, useRef, useCallback, useState } from "react";
import { Context } from "../context/Context";
import { isEmpty } from "lodash";
import { IContextProps } from "types/AppTypes";
import { useEyeTrackingData } from "context/EyeTrackingContext";

const useEyeTracking = (): void => {
  const {
    userInfo,
    isCalibrating,
    selectedEyeTracker,
    setCalibrationProcess,
    isEyeTrackerConnected,
    shouldSubscribe,
  } = useContext<IContextProps>(Context);
  const { accumulateData } = useEyeTrackingData();
  const { address } = selectedEyeTracker;
  const [shouldOpenConnection, setShouldOpenConnection] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  const initializeWebSocket = useCallback(() => {
    const serverURL = "ws://localhost:5001";

    console.log("Attempting to open WebSocket connection.");
    if (!socketRef.current) {
      socketRef.current = new WebSocket(serverURL);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened.");
        setShouldOpenConnection(false);
        if (isCalibrating) {
          const messageData = {
            action: "startCalibration",
            address,
          };
          socketRef.current?.send(JSON.stringify(messageData));
        }
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed.");
        setShouldOpenConnection(true);
        socketRef.current = null;
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket encountered an error: ", error);
        setShouldOpenConnection(true);
        socketRef.current = null;
      };
    }
  }, [address, isCalibrating]);
  console.log("shouldOpenConnection", shouldOpenConnection);

  useEffect(() => {
    if (shouldOpenConnection) {
      console.log("start socket NOW");

      initializeWebSocket();
      setShouldOpenConnection(false);
    }
  }, [initializeWebSocket, shouldOpenConnection]);

  useEffect(() => {
    if (isEyeTrackerConnected) {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.onmessage = (event) => {
          const { data } = event;
          if (!data.includes("NaN")) {
            const parsedData = JSON.parse(data);
            const { action } = parsedData;

            if (!isEmpty(data)) {
              if (isCalibrating && action === "calibrationResult") {
                setCalibrationProcess?.({
                  ...parsedData,
                  goToNextPoint: parsedData.message.includes("success"),
                });
              } else if (isCalibrating && action === "startCalibration") {
                setCalibrationProcess?.(parsedData);
              } else if (parsedData.action && parsedData.action === "eyeData") {
                try {
                  accumulateData?.(parsedData.payload);
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                }
              }
            }
          }
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEyeTrackerConnected,
    isCalibrating,
    address,
    setCalibrationProcess,
    initializeWebSocket,
  ]);

  useEffect(() => {
    // This will run when the component unmounts
    return () => {
      console.log("Stopping tracking and closing WebSocket.");
      if (socketRef.current) {
        setShouldOpenConnection(true);
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (isCalibrating) {
        const messageData = {
          action: "startCalibration",
          address,
        };
        socketRef.current?.send(JSON.stringify(messageData));
      }
    }
  }, [address, isCalibrating]);

  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (shouldSubscribe) {
        const messageData = {
          action: "startTracking",
          address,
          userID: userInfo.userID,
        };
        socketRef.current.send(JSON.stringify(messageData));
      }
    }
  }, [address, shouldSubscribe, userInfo.userID, shouldOpenConnection]);

  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (!shouldSubscribe) {
        const messageData = {
          action: "stopTracking",
          address,
        };
        socketRef.current.send(JSON.stringify(messageData));
      }
    }
  }, [address, shouldSubscribe]);

  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (!shouldSubscribe && !isEyeTrackerConnected) {
        socketRef.current.close();
        localStorage.removeItem("eyeTracker");
      }
    }
  }, [isEyeTrackerConnected, shouldSubscribe]);
};

export default useEyeTracking;
