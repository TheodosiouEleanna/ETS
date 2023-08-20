import React, { useContext } from "react";
import { HeaderMenu } from "../HeaderMenu";
import { Context } from "../../context/Context";
import {
  darkBg_primary,
  darkBg_secondary,
  lightBg_secondary,
} from "../../consts";

const Header = () => {
  const { userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";

  return (
    <header
      className={`relative shadow-lg z-30 flex justify-between items-center w-full text-xl h-14`}
      style={{
        backgroundColor: isDarkTheme ? darkBg_primary : lightBg_secondary,
      }}
    >
      <HeaderMenu />
    </header>
  );
};

export default Header;
