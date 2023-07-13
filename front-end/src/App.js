import { useContext } from "react";
import FileUpload from "./components/FileUpload";
import FileViewer from "./components/FileViewer";
import { Menu } from "./components/Menu";
import { Context } from "./context/context";
import Footer from "./components/Footer";

const App = () => {
  const { file, loading } = useContext(Context);

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
    <div className='h-full overflow-hidden flex flex-col items-center justify-center'>
      <header className='relative z-10 flex items-center bg-gray-600 w-full text-xl text-white h-16'>
        <Menu />
      </header>
      <main className='h-full w-full flex justify-center items-center flex-col text-xl font-bold text-gray-800 bg-gray-100'>
        {file.size === 0 && !loading && (
          <div className='App'>
            <FileUpload />
          </div>
        )}
        {loading && <div> Loading Pdf Document...</div>}
        {file.size === 0 && !loading && <div>No PDF uploaded</div>}
        {file.size !== 0 && <FileViewer />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
