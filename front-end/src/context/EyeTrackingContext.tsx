import React, { createContext, useState, useContext, ReactNode } from "react";

interface EyeTrackingContextProps {
  eyeData: string[];
  accumulateData: (newData: string) => void;
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
  const [eyeData, setEyeData] = useState<string[]>([]);
  console.log({ eyeData });

  const accumulateData = (newData: string) => {
    setEyeData((prevData) => [...prevData, newData]);
  };

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
