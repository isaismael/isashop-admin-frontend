import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/admin/AdminLayout';
import { Login } from './pages/login/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Products } from './pages/products/Products';
import { Collection } from './pages/collection/Collection';
import { CreateProducts } from './pages/products/CreateProducts';
import { Brands } from './pages/brands/Brands';
import { Categories } from './pages/categories/categories';
import { Colors } from './pages/colors/Colors';
import { Sizes } from './pages/sizes/Sizes';
// -> warehouse
import { Warehouse } from './pages/warehouse/Warehouse';
import { Stock } from './pages/stock/Stock';
// -> shipping
import { ShippingCost } from './pages/shippingcost/ShippingCost';
import { Province } from './pages/province/Province';
// -> pickupaddresses
import { PickupAddresses } from './pages/pickupaddresses/PickupAddresses';
// -> orders
import { PaymentOrders } from './pages/paymentorders/PaymentOrders';
import { PaymentMethods } from './pages/paymentmethods/PaymentMethods';
// -> users
// -> store front
import { Banner } from './pages/banner/Banner';
import { CategoryBubbles } from './pages/categorybubbles/CategoryBubbles';
import { ProductGrid } from './pages/productgird/ProductGrid';
import { PromoBanner } from './pages/promobanner/PromoBanner';
// -> customer
import { Customer } from './pages/customer/Customer';
// -> admin

import { Admin } from './pages/admin/Admin';

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
            <Route path="products/collections" element={<Collection />} />
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
            {/* Shipping */}
            <Route path="shipping/shippingcost" element={<ShippingCost />} />
            <Route path="shipping/provinces" element={<Province />} />
            <Route path="shipping/pickupaddress" element={<PickupAddresses />} />
            {/* Orders */}
            <Route path="orders/paymentorders" element={<PaymentOrders />} />
            <Route path="orders/paymentmethods" element={<PaymentMethods />} />
            {/* Users */}
            {/* Store Front */}
            <Route path="storefront/banner" element={<Banner />} />
            <Route path="storefront/categorybubbles" element={<CategoryBubbles />} />
            <Route path="storefront/productgrid" element={<ProductGrid />} />
            <Route path="storefront/promobanner" element={<PromoBanner />} />
            {/* Customer */}
            <Route path="customer" element={<Customer />} />
            {/* Agrega más rutas aquí */}
            <Route path="administrador" element={<Admin />} />
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