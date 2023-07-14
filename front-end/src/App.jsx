import { useContext, useEffect } from "react";
import { Context } from "./context/context";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";
import MainContent from "./components/MainContent";
import Header from "./components/Header";

const App = () => {
  const { userInfo } = useContext(Context);
  const { isLoggedIn } = userInfo;

  return (
    <>
      {!isLoggedIn && <UserProfile />}
      {isLoggedIn && (
        <div className='h-full overflow-hidden flex flex-col items-center justify-center'>
          <Header />
          <MainContent />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
