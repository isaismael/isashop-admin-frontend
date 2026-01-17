// src/routes/routes.jsx
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login/Login";
import Products from "../pages/products/Products";
import CreateProduct from "../pages/products/CreateProduct";
import Forbidden from "../pages/Errors/Forbidden";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/403",
    element: <Forbidden />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "products",
        element: (
          <ProtectedRoute permission="product.update">
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/new",
        element: (
          <ProtectedRoute permission="product.create">
            <CreateProduct />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
