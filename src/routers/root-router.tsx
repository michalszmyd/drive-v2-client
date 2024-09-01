import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WelcomePage from "../pages/welcome-page";
import SignInPage from "../pages/sign-in-page";
import ResetPasswordPage from "../pages/reset-password-page";
import ItemsPage from "../pages/items-page";
import DashboardPage from "../pages/dashboard-page";
import MyFolders from "../pages/my-folders";
import FolderPage from "../pages/folder-page";
import FilePage from "../pages/file-page";
import FoldersPage from "../pages/folders-page";
import EditFolderPage from "../pages/edit-folder-page";
import EditFilePage from "../pages/edit-file-page";
import ProfilePage from "../pages/profile-page";
import AdminUsersPage from "../pages/admin/users-page";
import ApplicationsPage from "../pages/applications-page";
import ApplicationsApiDocsPage from "../pages/applications-api-docs-page";
import AdminApplicationsPage from "../pages/admin/applications-page";
import AdminDashboardPage from "../pages/admin/dashboard-page";
import SettingsPage from "../pages/settings-page";
import DeletedFilesPage from "../pages/deleted-files-page";
import AdminDeletedFilesPage from "../pages/admin/deleted-files-page";
import SearchPage from "../pages/search-page";
import EmbedFilePage from "../pages/embed-file-page";
import ApplicationsDashboardPage from "../pages/applications-dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/items",
    element: <ItemsPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/my-folders",
    element: <MyFolders />,
  },
  {
    path: "/folders/:id",
    element: <FolderPage />,
  },
  {
    path: "/folders/:id/edit",
    element: <EditFolderPage />,
  },
  {
    path: "/folders",
    element: <FoldersPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/deleted-files",
    element: <DeletedFilesPage />,
  },
  {
    path: "/files/:id",
    element: <FilePage />,
  },
  {
    path: "/files/:id/edit",
    element: <EditFilePage />,
  },
  {
    path: "/files/embed",
    element: <EmbedFilePage />,
  },
  {
    path: "/applications/dashboard",
    element: <ApplicationsDashboardPage />,
  },
  {
    path: "/applications",
    element: <ApplicationsPage />,
  },
  {
    path: "/applications/api-docs",
    element: <ApplicationsApiDocsPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboardPage />,
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />,
  },
  {
    path: "/admin/applications",
    element: <AdminApplicationsPage />,
  },
  {
    path: "/admin/deleted-files",
    element: <AdminDeletedFilesPage />,
  },
]);

export default function RootRouter() {
  return <RouterProvider router={router} />;
}
