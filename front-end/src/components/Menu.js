import React, { useRef, useState } from "react";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOpen = () => {
    console.log("click", isOpen);

    setIsOpen((prev) => !prev);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className='bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-white'
        onClick={toggleOpen}
      >
        Menu
      </button>
      {isOpen && (
        <ul
          className='bg-gray-500  text-white font-bold absolute'
          ref={dropdownRef}
          style={{
            position: "absolute",
          }}
        >
          <li className='hover:bg-gray-400 py-2 px-4 border border-white'>
            Settings
          </li>
          <li className='hover:bg-gray-400 py-2 px-4 border border-white'>
            Vocabulary
          </li>
        </ul>
      )}
    </div>
  );
};
