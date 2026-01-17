import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Products from "../pages/products/Products";
import CreateProduct from "../pages/products/CreateProduct";
import Login from "../pages/login/Login.jsx";
import Forbidden from "../pages/Errors/Forbidden";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/products"
        element={
          <ProtectedRoute permission="product.update">
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/new"
        element={
          <ProtectedRoute permission="product.create">
            <CreateProduct />
          </ProtectedRoute>
        }
      />

      <Route path="/403" element={<Forbidden />} />
    </Routes>
  );
}
