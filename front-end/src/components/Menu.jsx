import React, { useRef } from "react";

const Menu = ({ onClick }) => {
  const dropdownRef = useRef(null);
  return (
    <ul
      className=' w-52 flex flex-col justify-center rounded bg-gray-200 text-white text-lg absolute top-10 left-0 opacity-80'
      ref={dropdownRef}
    >
      <li
        className='w-full rounded-t text-gray-800 p-2 hover:bg-gray-300 cursor-pointer'
        onClick={onClick}
      >
        Settings
      </li>
      <div className='bg-gray-900 w-full h-px'></div>
      <li className='w-full rounded-b text-gray-800 p-2 hover:bg-gray-300 cursor-pointer '>
        Vocabulary
      </li>
      <div className='bg-gray-900 w-full h-px'></div>
      <li className='w-full text-gray-800 p-2 hover:bg-gray-300 cursor-pointer '>
        My documents
      </li>
    </ul>
  );
};

export default Menu;
