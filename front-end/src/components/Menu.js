import React, { useRef, useState } from "react";
import { MdDensityMedium } from "react-icons/md";
export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        className=' hover:bg-gray-400 text-white font-bold py-2 px-4'
        onClick={toggleOpen}
      >
        <MdDensityMedium className='text-xl' />
      </button>
      {isOpen && (
        <ul
          className='bg-gray-500 text-white text-lg absolute opacity-80'
          ref={dropdownRef}
          style={{
            position: "absolute",
          }}
        >
          <li className='bg-gray-500 py-2 px-4 hover:underline cursor-pointer border border-gray-200'>
            Settings
          </li>
          <li className='bg-gray-500 py-2 px-4 hover:underline cursor-pointer border border-gray-200'>
            Vocabulary
          </li>
        </ul>
      )}
    </div>
  );
};
