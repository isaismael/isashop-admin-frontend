import { useEffect, useState } from "react";
import { Plus, Save, SquarePen, Frown } from "lucide-react";
import SizesService from "../../services/sizes.service";

const sizesService = new SizesService();

export const Sizes = () => {
  const [sizes, setSizes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    active: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const fetchSizes = async (page, limit) => {
    try {
      setLoading(true);
      const response = await sizesService.getSizesPaginated(page, limit);
      setSizes(response?.data || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error(error);
      setSizes([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes(page, limit);
  }, [page, limit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await sizesService.updateSize(form.id, form);
      } else {
        await sizesService.createSize(form);
      }
      resetForm();
      fetchSizes(page, limit);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (size) => {
    setForm({
      id: size.id,
      name: size.name,
      active: size.active,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({ id: null, name: "", active: true });
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} />
          {isEditing ? "Editar Talle" : "Crear Nuevo Talle"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 items-end">
          {/* Nombre */}
          <div className="col-span-2">
            <label className="block text-sm mb-1">Nombre del Talle</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ej: XL, 42, Talle Único"
            />
          </div>

          {/* Activo */}
          <div className="col-span-1 flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={form.active}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600"
            />
            <label htmlFor="active" className="text-sm">Activo</label>
          </div>

          {/* Botones */}
          <div className="col-span-1 flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <Save size={18} />
              {isEditing ? "Actualizar" : "Guardar"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition text-sm font-medium"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/*//-> listado */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Listado de Talles</h2>

        {loading ? (
          <p className="text-slate-400 text-sm">Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Nombre</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sizes) && sizes.length > 0 ? (
                sizes.map((size) => (
                  <tr key={size.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 text-slate-500">#{size.id}</td>
                    <td className="py-3 px-2 font-medium text-slate-800">{size.name}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          size.active
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {size.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleEdit(size)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        title="Editar"
                      >
                        <SquarePen size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      No hay talles disponibles
                      <Frown size={18} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {pagination && (
          <div className="sticky bottom-0 w-full flex justify-between gap-4 mt-6 bg-white border-t border-gray-200 pt-4 z-10">
            <div className="flex flex-row gap-3 items-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition"
              >
                Anterior
              </button>

              <span className="text-gray-500 font-semibold">
                Página {pagination.page} de {pagination.totalPages}
              </span>

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition"
              >
                Siguiente
              </button>
            </div>

            <div className="flex items-center">
              <span className="text-gray-500 font-semibold">
                Mostrando {sizes.length} de {pagination.total} talles
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};