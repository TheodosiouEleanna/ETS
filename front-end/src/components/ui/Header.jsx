import React from "react";
import { HeaderMenu } from "../HeaderMenu";

const Header = () => {
  return (
    <header className='relative shadow-lg z-50 flex justify-between items-center bg-[#323639] w-full text-xl h-14'>
      <HeaderMenu />
    </header>
  );
};

export default Header;
