import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import { createRedPoint } from "../utils/eyeTracking";
import { isEmpty, isNaN } from "lodash";

const useEyeTracking = () => {
  const { selectedEyeTracker, isEyeTrackerConnected, accumulateData } =
    useContext(Context);
  const { address } = selectedEyeTracker;
  const hasSentMessage = useRef(false);

  useEffect(() => {
    console.log("I run");
    const serverURL = "ws://localhost:5001";
    const socket = new WebSocket(serverURL);
    if (isEyeTrackerConnected) {
      if (!hasSentMessage.current) {
        socket.onopen = () => {
          // Send a message to the server once the socket is open
          socket.send("startTracking");
        };
        hasSentMessage.current = true;
      }

      socket.onmessage = (event) => {
        console.log(event.data);
        if (!isEmpty(event.data)) {
          let parsedData;

          try {
            parsedData = JSON.parse(event.data);
            accumulateData(event.data);

            const { left_gaze_point_on_display_area } = parsedData;
            const { right_gaze_point_on_display_area } = parsedData;

            if (
              !isNaN(
                left_gaze_point_on_display_area[0] &&
                  !isNaN(left_gaze_point_on_display_area[1]) &&
                  !isNaN(right_gaze_point_on_display_area[0]) &&
                  !isNaN(right_gaze_point_on_display_area[1])
              )
            ) {
              const averageX =
                (left_gaze_point_on_display_area[0] +
                  right_gaze_point_on_display_area[0]) /
                2;
              const averageY =
                (left_gaze_point_on_display_area[1] +
                  right_gaze_point_on_display_area[1]) /
                2;
              createRedPoint(averageX, averageY);
            }
          } catch (error) {
            // console.error("Error parsing JSON:", error);
            // return; // Stop further execution if JSON parsing failed
          }
        }
      };

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
    }
    //  else {
    //   socket.close();
    // }
    // return () => {
    //   // Clean up the socket when the component is destroyed
    //   socket.close();
    // };
  }, [accumulateData, address, isEyeTrackerConnected]);
};

export default useEyeTracking;
