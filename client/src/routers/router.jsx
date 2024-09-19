import App from "../App";
import Home from "../pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Shop from "../pages/Shop";
import About from "../components/About";
import SingleBook from "../components/SingleBook";
import DashboardLayout from "../Dashboard/DashboardLayout";
import Dashboard from "../Dashboard/Dashboard";
import UploadBook from "../Dashboard/UploadBook";
import ManageBook from "../Dashboard/ManageBook";
import EditBook from "../Dashboard/EditBook";
import SignUp from "../components/SignUp";
import PrivateRoute from "../Private Route/PrivateRoute";
import Login from "../components/Login";
import Logout from "../Logout";
import Cart from "../pages/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/book/:id",
        element: <SingleBook />,
        loader: ({ params }) =>
          fetch(
            `${import.meta.env.VITE_API_URL}/book/${params.id}` ||
              "http://localhost:5000/book/${params.id}"
          ),
      },
    ],
  },
  {
    path: "/admin/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/dashboard/upload",
        element: <UploadBook />,
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/upload-book` || "http://localhost:5000/upload-book"),
      },
      {
        path: "/admin/dashboard/manage",
        element: <ManageBook />,
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/all-books` || "http://localhost:5000/all-books"),
      },
      {
        path: "/admin/dashboard/edit-book/:id",
        element: <EditBook />,
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/book/${params.id}` || "http://localhost:5000/book/${params.id}"),
      },
    ],
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export default router;
