import { useContext, useState } from "react";
import { MdDensityMedium } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import Settings from "./Settings";
import Profile from "./Profile";
import { Button } from "./Button";
import Menu from "./Menu";
import { Context } from "../context/context";

export const HeaderMenu = () => {
  const { logout } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const onClickLogout = () => {
    logout();
  };

  return (
    <div className='w-full flex justify-between'>
      <div className='relative'>
        <Button
          className='hover:bg-gray-600 text-white  px-4'
          onClick={toggleOpen}
        >
          <MdDensityMedium className='text-xl' />
        </Button>
        {isOpen && <Menu onClick={toggleOpen} />}
      </div>
      {showSettings && <Settings onClick={toggleSettings} />}
      <div className='relative'>
        {showProfile && <Profile onClick={onClickLogout} />}
        <Button
          className='hover:bg-gray-600 text-white  px-4'
          onClick={toggleProfile}
        >
          <BsFillPersonFill className='text-xl' />
        </Button>
      </div>
    </div>
  );
};
