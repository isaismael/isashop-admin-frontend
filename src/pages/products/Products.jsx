import { PermissionGuard } from "../../components/PermissionGuard";
import { Link } from "react-router-dom";

export const Products = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        
        <PermissionGuard permission="product.create">
          <Link
            to="/admin/products/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crear Producto
          </Link>
        </PermissionGuard>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>Lista de productos aquí...</p>
      </div>
    </div>
  );
};