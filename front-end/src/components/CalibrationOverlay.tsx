import { Context } from "context/Context";
import React, { useState, useEffect, FunctionComponent, useContext } from "react";
import { CalibrationPoint, IContextProps } from "types/AppTypes";
import { getBgPrimary, getBgPrimaryReverse } from "utils/functions";

const calibrationPoints: CalibrationPoint[] = [
  { x: 10, y: 10 },
  { x: 90, y: 10 },
  { x: 50, y: 50 },
  { x: 10, y: 90 },
  { x: 90, y: 90 },
];

const timeFrame = 3000;

const CalibrationOverlay: FunctionComponent = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { setIsCalibrating, userSettingsApi } = useContext<IContextProps>(Context);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [key, setKey] = useState(Math.random());
  const isDarkTheme = userSettingsApi.theme === "dark";

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowInitialScreen(false);
    }, timeFrame);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!showInitialScreen) {
      if (currentIndex < calibrationPoints.length) {
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setKey(Math.random());
        }, timeFrame);

        return () => clearTimeout(timer);
      } else {
        setIsCalibrating?.(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, showInitialScreen]);

  return (
    <div
      className='fixed inset-0 z-50 pointer-events-none opacity-95'
      style={{ backgroundColor: getBgPrimary(isDarkTheme) }}
    >
      {showInitialScreen && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-lg text-white'>Stare at the dots until they disappear.</span>
        </div>
      )}

      {!showInitialScreen && currentIndex < calibrationPoints.length && (
        <div
          key={key}
          className='absolute rounded-full w-6 h-6'
          style={{
            top: `${calibrationPoints[currentIndex].y}%`,
            left: `${calibrationPoints[currentIndex].x}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: getBgPrimaryReverse(isDarkTheme),
            animation: "explode 3s forwards",
          }}
        ></div>
      )}
    </div>
  );
};

export default CalibrationOverlay;
