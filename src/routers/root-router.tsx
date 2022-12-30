import React from 'react';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import WelcomePage from '../pages/welcome-page';
import SignInPage from '../pages/sign-in-page';
import ResetPasswordPage from '../pages/reset-password-page';
import DashboardPage from '../pages/dashboard-page';

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
  }
]);

export default function RootRouter() {
  return (
    <RouterProvider router={router} />
  )
}
