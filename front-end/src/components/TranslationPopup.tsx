import Button from "components/ui/Button";
import { Context } from "context/Context";
import React, { useContext } from "react";
import { RiCloseFill } from "react-icons/ri";
import { IContextProps } from "types/AppTypes";
import {
  getBgPrimary,
  getBgSecondary,
  getFontColorPrimary,
} from "utils/functions";

interface TranslationPopupProps {
  text: string;
  offset: number;
  translation: string;
  setShouldTranslate: React.Dispatch<React.SetStateAction<boolean>>;
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
  text,
  offset,
  translation,
  setShouldTranslate,
}) => {
  const { userSettingsApi } = useContext<IContextProps>(Context);
  const left = offset - 40;

  const onClose = () => {
    setShouldTranslate(false);
  };

  const isDarkTheme = userSettingsApi.theme === "dark";
  return (
    <>
      <div
        className={`absolute -top-3 transform -translate-y-1/2 w-4 h-4 border border-[${getBgPrimary(
          isDarkTheme
        )}] opacity-80 rotate-45 shadow-xl`}
        style={{
          left: left,
          backgroundColor: getBgSecondary(isDarkTheme),
        }}
      ></div>
      <div
        className={`flex flex-col z-10 absolute top-[-90px] left-[${left}px] w-36 h-20 rounded-lg animate-fadeIn shadow-xl`}
        style={{
          left: left - 30,
          backgroundColor: getBgSecondary(isDarkTheme),
          color: getFontColorPrimary(isDarkTheme),
        }}
      >
        <Button className=' absolute right-0 top-0' onClick={onClose}>
          <RiCloseFill className='text-xl' />
        </Button>

        <div className='text-sm w-full pl-3 py-1 font-bold bg-blue-400 rounded-t-lg'>
          {text}:
        </div>
        <div className='text-sm pl-3 py-1'>{translation}</div>
      </div>
    </>
  );
};

export default TranslationPopup;
