import React, { useContext } from "react";
import { Context } from "./context/Context";
import UserProfile from "./components/UserProfile";
import MainContent from "./components/MainContent";
import Footer from "./components/ui/Footer";
import Header from "./components/ui/Header";
import useEyeTracking from "./hooks/useEyeTracking";

const App: React.FC = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("App must be used within a ContextProvider");
  }

  const { userInfo } = context;
  const { isLoggedIn } = userInfo;

  useEyeTracking();

  return (
    <>
      {!isLoggedIn && <UserProfile />}
      {isLoggedIn && (
        <div className='h-full overflow-hidden'>
          <Header />
          <MainContent />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
