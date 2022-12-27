import React from 'react';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import WelcomePage from '../pages/welcome-page';
import SignInPage from '../pages/sign-in-page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />
  }
]);

export default function RootRouter() {
  return (
    <RouterProvider router={router} />
  )
}
