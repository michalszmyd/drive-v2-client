import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "../pages/activities-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
]);

export default function MainRouter() {
  return <RouterProvider router={router} />;
}
