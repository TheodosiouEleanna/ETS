import React, { useContext } from "react";
import { Context } from "../context/Context";
import { dark_primary, dark_secondary, light_primary, light_secondary } from "../consts";
import { Button } from "./ui/Button";

const Profile = ({ onClick }) => {
  const { userInfo, userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";

  return (
    <div
      className={`p-2 absolute rounded text-lg top-[2.5rem] right-1 shadow-lg`}
      style={
        isDarkTheme
          ? {
              backgroundColor: dark_secondary,
            }
          : {
              backgroundColor: light_primary,
            }
      }
    >
      {/* <div>User ID: {userInfo.userID}</div> */}
      <div className='w-44 h-12 ' style={isDarkTheme ? { color: light_secondary } : { color: dark_secondary }}>
        Logged in as:<span className='text-base'> {userInfo.username}</span>
      </div>
      <div className='flex w-full justify-end'>
        <Button className={` rounded bg-blue-500 py-1 px-2`} onClick={onClick}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
