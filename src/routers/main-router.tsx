import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DashboardPage from "../pages/dashboard-page";


const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
]);

export default function MainRouter() {
  return (
    <RouterProvider router={router} />
  )
}
