// import React, { useState, useEffect } from "react";

// const CalibrationOverlay = ({ calibrationPoints, onCalibrationEnd }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (currentIndex < calibrationPoints.length) {
//       const timer = setTimeout(() => {
//         setCurrentIndex(currentIndex + 1);
//       }, calibrationPoints[currentIndex].timeframe);

//       return () => clearTimeout(timer);
//     } else {
//       onCalibrationEnd();
//     }
//   }, [currentIndex]);

//   return (
//     <div className='fixed inset-0 z-50 pointer-events-none'>
//       {currentIndex < calibrationPoints.length && (
//         <div
//           className='absolute bg-red-500 rounded-full w-6 h-6'
//           style={{
//             top: `${calibrationPoints[currentIndex].y}%`,
//             left: `${calibrationPoints[currentIndex].x}%`,
//             transform: "translate(-50%, -50%)",
//           }}
//         ></div>
//       )}
//     </div>
//   );
// };

// export default CalibrationOverlay;
