import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { GazeData } from "types/AppTypes";

interface EyeTrackingContextProps {
  eyeData: GazeData[];
  accumulateData: (newData: GazeData) => void;
}

const EyeTrackingContext = createContext<EyeTrackingContextProps | undefined>(
  undefined
);

interface EyeTrackingProviderProps {
  children: ReactNode;
}

export const EyeTrackingProvider: React.FC<EyeTrackingProviderProps> = ({
  children,
}) => {
  const [eyeData, setEyeData] = useState<GazeData[]>([]);

  const accumulateData = (newData: GazeData) => {
    setEyeData((prevData) => [...prevData, newData]);
  };

  useEffect(() => {
    if (eyeData.length > 2100) {
      setEyeData((prevData) => prevData.slice(1500));
    }
  }, [eyeData]);

  return (
    <EyeTrackingContext.Provider value={{ eyeData, accumulateData }}>
      {children}
    </EyeTrackingContext.Provider>
  );
};

export const useEyeTrackingData = (): EyeTrackingContextProps => {
  const context = useContext(EyeTrackingContext);
  if (!context) {
    throw new Error(
      "useEyeTrackingData must be used within an EyeTrackingProvider"
    );
  }
  return context;
};
