import React, { useRef } from "react";

const Menu = ({ onItemClick }) => {
  const dropdownRef = useRef(null);
  return (
    <ul
      className=' w-52 flex flex-col justify-center rounded bg-slate-200 text-white text-lg absolute top-12 left-0'
      ref={dropdownRef}
    >
      <li
        className='w-full rounded-t text-gray-800 p-2 hover:bg-gray-300 cursor-pointer'
        onClick={() => onItemClick("settings")}
      >
        Settings
      </li>
      <div className='bg-gray-300 w-full h-px'></div>
      <li
        className='w-full rounded-b text-gray-800 p-2 hover:bg-gray-300 cursor-pointer '
        onClick={() => onItemClick("vocabulary")}
      >
        Vocabulary
      </li>
      <div className='bg-gray-300 w-full h-px'></div>
      <li
        className='w-full text-gray-800 p-2 hover:bg-gray-300 cursor-pointer '
        onClick={() => onItemClick("documents")}
      >
        My documents
      </li>
    </ul>
  );
};

export default Menu;
