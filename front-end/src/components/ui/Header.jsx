import React, { useContext } from "react";
import { HeaderMenu } from "../HeaderMenu";
import { Context } from "../../context/Context";
import { dark_primary, light_secondary } from "../../consts";

const Header = () => {
  const { userSettingsApi } = useContext(Context);
  const isDarkTheme = userSettingsApi.theme === "dark";

  return (
    <header
      className={`relative shadow-lg z-30 flex justify-between items-center w-full text-xl h-10`}
      style={{
        backgroundColor: isDarkTheme ? dark_primary : light_secondary,
      }}
    >
      <HeaderMenu />
    </header>
  );
};

export default Header;
