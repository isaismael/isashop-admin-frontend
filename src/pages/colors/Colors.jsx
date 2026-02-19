import { useEffect, useState } from "react";
import { Plus, Save, SquarePen } from "lucide-react";
import ColorsService from "../../services/colors.service";

const colorsService = new ColorsService();

export const Colors = () => {
  const [colors, setColors] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    hex: "#6366f1",
    active: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const fetchColors = async (page, limit) => {
    try {
      setLoading(true);
      const response = await colorsService.getColors(page, limit);
      setColors(response?.data || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error(error);
      setColors([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors(page, limit);
  }, [page, limit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await colorsService.updateColor(form.id, form);
      } else {
        await colorsService.createColor(form);
      }

      resetForm();
      fetchColors(page, limit);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (color) => {
    setForm({
      id: color.id,
      name: color.name,
      hex: color.hex,
      active: color.active,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      hex: "#6366f1",
      active: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} />
          {isEditing ? "Editar Color" : "Crear Nuevo Color"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-4 gap-4 items-end"
        >
          {/* Nombre */}
          <div className="col-span-1">
            <label className="block text-sm mb-1">Nombre del Color</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ej: Azul Medianoche"
            />
          </div>

          {/* Hex */}
          <div className="col-span-1">
            <label className="block text-sm mb-1">Valor Hexadecimal</label>
            <input
              type="text"
              name="hex"
              value={form.hex}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Color Picker */}
          <div className="col-span-1">
            <input
              type="color"
              value={form.hex}
              onChange={(e) => setForm({ ...form, hex: e.target.value })}
              className="w-16 h-10 border rounded-lg cursor-pointer"
            />
          </div>

          {/* Botón */}
          <div className="col-span-1">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <Save size={18} />
              {isEditing ? "Actualizar" : "Guardar"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <label>Activo</label>
          </div>
        </form>
      </div>

      {/*//-> litado */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Listado de Colores</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-2">ID</th>
                <th>Nombre</th>
                <th>Muestra</th>
                <th>Hex</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(colors) && colors.length > 0 ? (
                colors.map((color) => (
                  <tr key={color.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">#{color.id}</td>
                    <td>{color.name}</td>

                    {/* Muestra */}
                    <td>
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                    </td>

                    <td>{color.hex}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          color.active
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {color.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="flex gap-3">
                      <button
                        onClick={() => handleEdit(color)}
                        className="flex items-center gap-2 px-3 py-3 text-indigo-600 hover:text-indigo-800"
                      >
                        <SquarePen size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No hay colores disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {pagination && (
        <div className="sticky bottom-0 w-full flex justify-between gap-4 bg-white border border-gray-200 px-6 py-4 z-10">
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
              Mostrando {colors.length} de {pagination.total} colores
            </span>
          </div>
        </div>
      )}
    </div>
  );
};