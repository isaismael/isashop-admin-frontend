import { Save, Trash, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import BannerService from "../../services/banner.service";

export const Banner = () => {
  const initialForm = {
    title: "",
    subtitle: "",
    description: "",
    url: "",
    button_text: "",
    button_url: "",
    active: 1,
  };

  const [form, setForm] = useState(initialForm);
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

  const discardChanges = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getBanner = async () => {
    try {
      const bannerService = new BannerService();
      const response = await bannerService.getBanner();

      if (response) {
        setForm({
          title: response.title || "",
          subtitle: response.subtitle || "",
          description: response.description || "",
          url: response.url || "",
          button_text: response.button_text || "",
          button_url: response.button_url || "",
          active: response.active,
        });
        setEditingId(response.id);
      }
    } catch (error) {
      console.error("Error en getBanner:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bannerService = new BannerService();

      if (editingId) {
        await bannerService.updateBanner(editingId, form);
        alert("Banner actualizado correctamente");
      }

      getBanner();
    } catch (error) {
      console.error("Error al guardar banner:", error);
    }
  };

  useEffect(() => {
    getBanner();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestor de Banner</h2>
      <p className="text-slate-500">
        Administre el banner principal que se muestra en la página de inicio.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={discardChanges}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition"
            >
              <Trash size={18} />
              Descartar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              <Save size={18} />
              Actualizar Banner
            </button>
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-6">
                Detalles del banner
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
                  Título
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subtítulo
                </label>
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL de Imagen - Calidad estándar 1280x549 px
                </label>
                <input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              {form.url && (
                <div className="md:col-span-2">
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={form.url}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Texto del botón
                </label>
                <input
                  name="button_text"
                  value={form.button_text}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL del botón
                </label>
                <input
                  name="button_url"
                  value={form.button_url}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
};