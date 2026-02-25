import { Save, Trash, SquarePen, Frown, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import CategoryBubblesService from "../../services/categoryBubbles.service";

export const CategoryBubbles = () => {
  const initialForm = {
    name: "",
    url_img: "",
    title: "",
    url_category: "",
    active: 1,
  };

  const [form, setForm] = useState(initialForm);
  const [categoryBubbles, setCategoryBubbles] = useState([]);
  const [editingId, setEditingId] = useState(null);

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

  const discardCategoryBubble = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getCategoryBubbles = async () => {
    try {
      const service = new CategoryBubblesService();
      const response = await service.getAllCategoryBubbles();
      setCategoryBubbles(response || []);
    } catch (error) {
      console.error("Error en getCategoryBubbles:", error.message);
      setCategoryBubbles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const service = new CategoryBubblesService();
      if (editingId) {
        await service.updateCategoryBubble(editingId, form);
        alert("Category bubble actualizada correctamente");
      }
      discardCategoryBubble();
      getCategoryBubbles();
    } catch (error) {
      console.error("Error al guardar category bubble:", error);
    }
  };

  const handleEdit = (bubble) => {
    setForm({
      name: bubble.name,
      url_img: bubble.url_img,
      title: bubble.title,
      url_category: bubble.url_category || "",
      active: bubble.active,
    });
    setEditingId(bubble.id);
  };

  useEffect(() => {
    getCategoryBubbles();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestor de category bubbles</h2>
      <p className="text-slate-500">
        Administre las categorías que se muestran como burbujas en la tienda.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={discardCategoryBubble}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition"
            >
              <Trash size={18} />
              Descartar
            </button>

            <button
              type="submit"
              disabled={!editingId}
              className="flex items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Actualizar Category Bubble
            </button>
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-6">
                Detalles de la category bubble
              </h2>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nombre
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ej. Electrónica, Ropa, etc."
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Título
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ej. Explora Electrónica"
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL de imagen
                </label>
                <input
                  name="url_img"
                  value={form.url_img}
                  onChange={handleChange}
                  type="text"
                  placeholder="https://..."
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL de categoría
                </label>
                <input
                  name="url_category"
                  value={form.url_category}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ej. /categoria/mangas"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>
            </div>

            {form.url_img && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 mb-1.5">Vista previa</p>
                <img
                  src={form.url_img}
                  alt="preview"
                  className="h-20 w-20 rounded-full object-cover border border-slate-200"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>
        </div>
      </form>

      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de category bubbles</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Imagen</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">URL Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Array.isArray(categoryBubbles) && categoryBubbles.length > 0 ? (
                  categoryBubbles.map((bubble) => (
                    <tr key={bubble.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{bubble.id}</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <Layers size={16} />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{bubble.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">{bubble.title}</td>

                      <td className="px-6 py-4">
                        <img
                          src={bubble.url_img}
                          alt={bubble.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 max-w-[180px] truncate">
                        {bubble.url_category ? (
                          <span title={bubble.url_category}>{bubble.url_category}</span>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bubble.active === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {bubble.active === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(bubble)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        >
                          <SquarePen size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        No hay category bubbles disponibles
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