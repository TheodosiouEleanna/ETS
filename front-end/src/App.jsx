import { useContext } from "react";
import { Context } from "./context/Context";
import UserProfile from "./components/UserProfile";
import MainContent from "./components/MainContent";
import Footer from "./components/ui/Footer";
import Header from "./components/ui/Header";
import { useSnackbar } from "./hooks/useSnackbar";
import Snackbar from "./components/ui/Snackbar";
import useEyeTracking from "./hooks/useEyeTracking";

const App = () => {
  const { userInfo } = useContext(Context);
  const { isLoggedIn } = userInfo;
  const { snackbarData } = useSnackbar();
  const data = useEyeTracking();

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
      {snackbarData.open && (
        <Snackbar message={snackbarData.message} status={snackbarData.status} />
      )}
    </>
  );
};

export default App;
