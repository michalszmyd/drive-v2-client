import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import CurrentUserContext from "./contexts/current-user-context";
import CurrentUserHelper from "./helpers/current-user-helper";
import UserModel from "./models/user-model";
import RootRouter from "./routers/root-router";
import UsersService from "./services/users-service";
import Loading from "./components/shared/loading";
import PageWrapper from "./components/guest/pages/page-wrapper";

function App() {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    CurrentUserHelper.get().then(async (user) => {
      if (user) {
        try {
          const fetchedCurrentUser = await UsersService.me();

          setCurrentUser(fetchedCurrentUser);
        } catch {
          CurrentUserHelper.destroy();
        }
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RootRouter />
    </CurrentUserContext.Provider>
  );
}

export default App;
