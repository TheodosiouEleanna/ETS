import React, { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../context/context";

const UserProfile = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useContext(Context);

  const createUser = () => {
    axios
      .post("http://localhost:5000/create-profile", {
        username,
        password,
      })
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  };

  const loginUser = () => {
    axios
      .post("http://localhost:5000/login", {
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
        console.error(err);
      });
  };

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-800'>
      <div className='p-8 bg-white rounded shadow-md w-96'>
        <h2 className='mb-8 text-3xl text-blue-600 text-center'>
          {isLogin ? "Login" : "Create profile"}
        </h2>
        <input
          className='mb-4 w-full px-3 py-2 border rounded-md'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
        />
        <input
          className='mb-4 w-full px-3 py-2 border rounded-md'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
        />
        {isLogin ? (
          <button
            className='w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
            onClick={loginUser}
          >
            Login
          </button>
        ) : (
          <button
            className='w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
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
