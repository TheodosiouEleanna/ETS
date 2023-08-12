import React, { useState } from "react";

const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className='relative'
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {show && (
        <div className='absolute z-10 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-700 text-white text-xs rounded-md p-1 shadow-lg'>
          {content}
        </div>
      )}
      {children}
    </div>
  );
};

export default Tooltip;
