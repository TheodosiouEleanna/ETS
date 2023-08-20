import React, { useContext } from "react";
import { Context } from "../context/Context";
import { darkBg_secondary, lightBg_secondary } from "../consts";

const Vocabulary = () => {
  const { userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";

  return (
    <div className='flex flex-col  m-2 p-4'>
      <h1
        className='py-1 mb-4 text-xl font-bold text-gray-900 border-b border-gray-300'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        Vocabulary
      </h1>
      <div
        className='mb-8 text-gray-600'
        style={
          isDarkTheme
            ? { color: lightBg_secondary }
            : { color: darkBg_secondary }
        }
      >
        Here is your vocabulary.
      </div>
    </div>
  );
};

export default Vocabulary;
