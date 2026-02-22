import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/admin/AdminLayout';
import { Login } from './pages/login/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Products } from './pages/products/Products';
import { CreateProducts } from './pages/products/CreateProducts';
import { Brands } from './pages/brands/Brands';
import { Categories } from './pages/categories/categories';
import { Colors } from './pages/colors/Colors';
import { Sizes } from './pages/sizes/Sizes';
// -> warehouse
import { Warehouse } from './pages/warehouse/Warehouse';
import { Stock } from './pages/stock/Stock';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Rutas y path */}
            <Route path="" element={<Dashboard />} />
            {/* Products */}
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<CreateProducts />} />
            <Route path="products/listproducts" element={<Products />} />
            {/* Brands */}
            <Route path="products/brands" element={<Brands />} />
            {/* Categories */}
            <Route path="products/category" element={<Categories />} />
            <Route path="products/colors" element={<Colors />} />
            <Route path="products/sizes" element={<Sizes />} />
            {/* Warehouse */}
            <Route path="warehouse/warehouse" element={<Warehouse />} />
            <Route path="warehouse/stock" element={<Stock />} />
            {/* Agrega más rutas aquí */}
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;