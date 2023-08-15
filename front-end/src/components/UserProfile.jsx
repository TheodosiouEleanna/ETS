import React, { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../context/Context";
import { useSnackbar } from "../hooks/useSnackbar";

const UserProfile = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useContext(Context);
  const [error, setError] = useState("");
  const { triggerSnackbar } = useSnackbar();

  const handleEnterPress = (event, type) => {
    if (event.key === "Enter") {
      if (isLogin) {
        loginUser();
      } else {
        createUser();
      }
    }
  };

  const createUser = () => {
    axios
      .post("http://localhost:5000/api/create-profile", {
        username,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsLogin(true);
          setUsername("");
          setPassword("");
          setError("");
          triggerSnackbar({
            message: "User created successfully!",
            status: "success",
            open: true,
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError(err.response.data.message);
          triggerSnackbar({
            message: "Failed to create user!",
            status: "error",
            open: true,
          });
        }
      });
  };

  const loginUser = () => {
    axios
      .post("http://localhost:5000/api/login", {
        username,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          setUserInfo({
            isLoggedIn: true,
            userID: res.data.userID,
            username: res.data.username,
          });
        }
      })
      .catch((err) => {
        console.error({ err });
        if (err.response.status === 400) {
          setError(err.response.data.message);
        }
      });
  };

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className='flex flex-col items-center h-screen bg-[#323639]'>
      <div className='my-20'>
        <img src='./logo5.png' alt='' className='h-32' />
      </div>
      <div className='p-8 bg-white rounded shadow-md w-96 flex flex-col justify-between items-center'>
        <h2 className='mb-8 text-3xl text-blue-500 text-center'>
          {isLogin ? "Login" : "Create profile"}
        </h2>
        <input
          className='mb-4 w-full px-3 py-2 border rounded-md'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleEnterPress}
          placeholder='Username'
        />
        <input
          className='mb-4 w-full px-3 py-2 border rounded-md'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleEnterPress}
          placeholder='Password'
        />
        {error && (
          <div className='text-red-700 flex justify-center pb-2'>{error}</div>
        )}
        {isLogin ? (
          <button
            className='w-full px-3 py-2 bg-green-600 text-slate-200 rounded-md hover:bg-green-700'
            onClick={loginUser}
          >
            Login
          </button>
        ) : (
          <button
            className='w-full px-3 py-2 bg-green-600 text-slate-200 rounded-md hover:bg-green-700'
            onClick={createUser}
          >
            Create Profile
          </button>
        )}
        {isLogin ? (
          <div className='my-4'>
            Don't have a profile?
            <button
              className='ml-2 text-gray-800 hover:text-blue-600'
              onClick={toggleLogin}
            >
              Create Profile
            </button>
          </div>
        ) : (
          <div className='my-4'>
            Already have a profile?
            <button
              className='ml-2 text-gray-800 hover:text-blue-600'
              onClick={toggleLogin}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
