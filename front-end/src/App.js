import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import FileViewer from "./components/FileViewer";
import { Menu } from "./components/Menu";
import { Button } from "./components/Button";

const App = () => {
  const [zoom, setZoom] = useState(1);

  const onGetFileClick = () => {};

  //   useEffect(() => {
  //     const clickListener = (event) => {
  //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //         setIsOpen(false);
  //       }
  //     };

  //     document.addEventListener("click", clickListener);

  //     return () => {
  //       document.removeEventListener("click", clickListener);
  //     };
  //   }, []);

  return (
    <div className='flex flex-col h-screen'>
      <header className=' bg-gray-600 w-full text-xl text-white'>
        <Menu />
      </header>
      <main className='p-4 bg-gray-200 '>
        <div className='App'>
          <FileUpload />
        </div>
        <Button
          label='Load File'
          onClick={onGetFileClick}
          className='bg-gray-500 hover:bg-gray-400 text-white font-bold py-3 mx-2 px-4 rounded'
        />
        <FileViewer />
      </main>
      <footer className='border border-gray-400 p-4 bg-gray-200'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Zoom Level
        </label>
        <input
          type='range'
          min='50'
          max='200'
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
          className='slider bg-blue-500'
        />
        <p className='text-gray-600 mt-2'>{zoom}%</p>
      </footer>
    </div>
  );
};

export default App;
