import React, { useContext } from "react";
import { Context } from "../context/Context";

const Profile = ({ onClick }) => {
  const { userInfo } = useContext(Context);

  return (
    <div className=' p-2 absolute rounded bg-slate-200 text-white text-lg top-[2.7rem] right-1'>
      {/* <div>User ID: {userInfo.userID}</div> */}
      <div className='w-44 h-12 text-gray-800 '>
        Logged in as:<span className='text-base'> {userInfo.username}</span>
      </div>
      <div className='flex w-full justify-end'>
        <button
          className=' rounded bg-blue-500 hover:bg-gray-400 text-white  py-1 px-2'
          onClick={onClick}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
