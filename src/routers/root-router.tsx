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
import EditFolderPage from "../pages/edit-folder-page";
import EditFilePage from "../pages/edit-file-page";
import ProfilePage from "../pages/profile-page";
import AdminUsersPage from "../pages/admin/users-page";

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
    path: "/profile",
    element: <ProfilePage />
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
    path: "/folders/:id/edit",
    element: <EditFolderPage />
  },
  {
    path: "/folders",
    element: <FoldersPage />
  },
  {
    path: "/files/:id",
    element: <FilePage />
  },
  {
    path: "/files/:id/edit",
    element: <EditFilePage />
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />
  }
]);

export default function RootRouter() {
  return (
    <RouterProvider router={router} />
  )
}
