import { Save, Trash, SquarePen, Frown, LayoutGrid, Link, ToggleLeft } from "lucide-react";
import { useState, useEffect } from "react";
import ProductGridService from "../../services/productGrid.service";

export const ProductGrid = () => {
  const initialForm = {
    name: "",
    description: "",
    url_collection: "",
    active: 1,
  };

  const [form, setForm] = useState(initialForm);
  const [productGrids, setProductGrids] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setForm((prev) => ({
      ...prev,
      active: prev.active === 1 ? 0 : 1,
    }));
  };

  const discardForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getProductGrids = async () => {
    setLoading(true);
    try {
      const service = new ProductGridService();
      const response = await service.getAllProductGrids();
      setProductGrids(response?.data || response || []);
    } catch (error) {
      console.error("Error en getProductGrids:", error.message);
      setProductGrids([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const service = new ProductGridService();
      if (editingId) {
        await service.updateProductGrid(editingId, form);
        alert("Grilla actualizada correctamente");
      }
      discardForm();
      getProductGrids();
    } catch (error) {
      console.error("Error al guardar grilla:", error);
    }
  };

  const handleEdit = (grid) => {
    setForm({
      name: grid.name,
      description: grid.description,
      url_collection: grid.url_collection,
      active: grid.active,
    });
    setEditingId(grid.id);
  };

  useEffect(() => {
    getProductGrids();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestor de grillas de productos</h2>
      <p className="text-slate-500">
        Administre las grillas de productos y sus colecciones para la visualización en tienda.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 mt-4">
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={discardForm}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition"
            >
              <Trash size={18} />
              Descartar
            </button>

            {editingId && (
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                <Save size={18} />
                Actualizar Grilla
              </button>
            )}
          </div>
        </div>

        {editingId && (
          <div className="w-full flex gap-3 mb-4">
            <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Detalles de la grilla</h2>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500">
                    {form.active === 1 ? "Activo" : "Inactivo"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.active === 1}
                      onChange={handleToggle}
                    />
                    <div className="w-11 h-6 rounded-full transition-colors bg-[#e2e8f0] peer-checked:bg-[#6366f1] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre de la grilla
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Ej. Grilla Principal, Destacados, etc."
                    required
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Descripción
                  </label>
                  <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    type="text"
                    placeholder="Ej. Productos de temporada, Ofertas, etc."
                    required
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    ID de colección
                  </label>
                  <input
                    name="url_collection"
                    value={form.url_collection}
                    onChange={handleChange}
                    type="number"
                    placeholder="Ej. 1"
                    required
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de grillas de productos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    URL Colección
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        Cargando grillas...
                      </div>
                    </td>
                  </tr>
                ) : Array.isArray(productGrids) && productGrids.length > 0 ? (
                  productGrids.map((grid) => (
                    <tr key={grid.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {grid.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <LayoutGrid size={16} />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            {grid.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                        {grid.description}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Link size={13} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{grid.collection_id}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            grid.active === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {grid.active === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(grid)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        >
                          <SquarePen size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        No hay grillas disponibles
                        <Frown size={18} />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};