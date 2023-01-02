import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import WelcomePage from '../pages/welcome-page';
import SignInPage from '../pages/sign-in-page';
import ResetPasswordPage from '../pages/reset-password-page';
import DashboardPage from '../pages/dashboard-page';
import MyFolders from '../pages/my-folders';
import FolderPage from '../pages/folder-page';
import FilePage from "../pages/file-page";
import FoldersPage from "../pages/folders-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />
  },
  {
    path: "/dashboard",
    element: <DashboardPage />
  },
  {
    path: "/my-folders",
    element: <MyFolders />
  },
  {
    path: "/folders/:id",
    element: <FolderPage />
  },
  {
    path: "/folders",
    element: <FoldersPage />
  },
  {
    path: "/files/:id",
    element: <FilePage />
  }
]);

export default function RootRouter() {
  return (
    <RouterProvider router={router} />
  )
}
