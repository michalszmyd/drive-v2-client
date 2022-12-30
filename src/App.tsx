import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import CurrentUserContext from './contexts/current-user-context';
import CurrentUserHelper from './helpers/current-user-helper';
import UserModel from './models/user-model';
import RootRouter from './routers/root-router';

function App() {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    CurrentUserHelper.get().then((user) => {
      if (user) {
        setCurrentUser(new UserModel({id: user.id}));
      }
      setIsLoading(false);
    })
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
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
