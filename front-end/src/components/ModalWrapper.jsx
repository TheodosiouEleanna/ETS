import { Button } from "./Button";
import { RiCloseFill } from "react-icons/ri";

const ModalWrapper = ({ children, style, className, onClose }) => {
  const onCloseClick = () => {
    onClose();
  };

  return (
    <div className='fixed inset-0 w-full flex items-center justify-center z-40'>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div
        style={style}
        className={`${className} z-50 rounded w-[500px] p-6 m-4 bg-slate-200`}
      >
        <div className='w-full flex justify-end'>
          <Button
            className='text-red-800 hover:text-red-700'
            onClick={onCloseClick}
          >
            <RiCloseFill className='text-4xl' />
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
