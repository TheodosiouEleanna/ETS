import React from "react";
import { HeaderMenu } from "./HeaderMenu";

const Header = () => {
  return (
    <header className='relative shadow-lg z-50 flex items-center bg-[#323639] w-full text-xl text-white h-12'>
      <HeaderMenu />
    </header>
  );
};

export default Header;
