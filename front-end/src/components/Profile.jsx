import { useContext } from "react";
import { Context } from "../context/Context";
import { dark_secondary, light_primary } from "../consts";
import { Button } from "./ui/Button";
import { getFontColorSecondary } from "../utils/functions";
import ReactDOM from "react-dom";

const Profile = ({ onClick }) => {
  const { userInfo, userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";

  const profileContent = (
    <div
      className={`p-2 absolute rounded text-lg top-[2.5rem] right-0 shadow-lg`}
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
      <div className='w-44 h-12 ' style={{ color: getFontColorSecondary(isDarkTheme) }}>
        Logged in as:<span className='text-base'> {userInfo.username}</span>
      </div>
      <div className='flex w-full justify-end'>
        <Button className={` rounded bg-blue-500 py-1 px-2`} onClick={onClick}>
          Logout
        </Button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(profileContent, document.getElementById("modal-root"));
};

export default Profile;
