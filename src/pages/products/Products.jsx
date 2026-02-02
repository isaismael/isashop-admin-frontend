// import { PermissionGuard } from "../../components/PermissionGuard";

import { Search } from "lucide-react";

// <PermissionGuard permission="product.create">
//   <Link
//     to="/admin/products/create"
//     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//   >
//     Crear Producto
//   </Link>
// </PermissionGuard>
export const Products = () => {
  return (
    <div className="">

      <div className="mb-4">
        <h2 className="text-2xl font-bold">Listado de Productos</h2>
        <p className="text-slate-500">Controlá el listado de tus productos y crea variantes para cada uno.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 md:items-center">
        {/* Buscador - input search */}
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Buscar por Nombre, SKU o ID"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                 transition"
          />
        </div>
        {/* Filtros - select options */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select
            className="bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                 transition min-w-[160px]"
          >
            <option value="">Categoría: Todas</option>
          </select>
          <select
            className="bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                 transition min-w-[160px]"
          >
            <option value="">Marca: Todas</option>
          </select>
        </div>
      </div>

      {/* Tabal para listado de productos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            {/* Body de la tabla */}
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors">

              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};