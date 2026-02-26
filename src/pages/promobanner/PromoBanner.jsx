import { Save, Trash, Image, ExternalLink, Type, AlignLeft, MousePointerClick, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import PromoBannerService from "../../services/promoBanner.service";

export const PromoBanner = () => {
  const initialForm = {
    name: "",
    title: "",
    description: "",
    url_img: "",
    text_button: "",
    url_button: "",
    active: 1,
  };

  const [form, setForm] = useState(initialForm);
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "url_img") setPreviewImg(value);
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
    setPreviewImg(null);
  };

  // Función auxiliar para cargar un banner en el form
  const loadIntoForm = (banner) => {
    setForm({
      name: banner.name,
      title: banner.title,
      description: banner.description,
      url_img: banner.url_img,
      text_button: banner.text_button,
      url_button: banner.url_button,
      active: banner.active,
    });
    setEditingId(banner.id);
    setPreviewImg(banner.url_img);
  };

  const getBanners = async (autoLoad = false) => {
    try {
      const service = new PromoBannerService();
      const response = await service.getPromoBanner();
      // El endpoint devuelve un objeto único — lo normalizamos a array
      const data = Array.isArray(response) ? response : response ? [response] : [];
      setBanners(data);
      // Al montar por primera vez, auto-cargar el banner en el form
      if (autoLoad && data.length > 0) {
        loadIntoForm(data[0]);
      }
    } catch (error) {
      console.error("Error en getPromoBanner:", error.message);
      setBanners([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const service = new PromoBannerService();
      if (editingId) {
        await service.updatePromoBanner(editingId, form);
        alert("Banner actualizado correctamente");
        getBanners(false);
      }
    } catch (error) {
      console.error("Error al guardar banner:", error);
    }
  };

  const handleEdit = (banner) => {
    loadIntoForm(banner);
  };

  useEffect(() => {
    getBanners(true);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestor de Promo Banners</h2>
      <p className="text-slate-500">
        Administre los banners promocionales que se muestran en su tienda.
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

            <button
              type="submit"
              disabled={!editingId}
              className="flex items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {editingId ? "Actualizar Banner" : "Cargando..."}
            </button>
          </div>
        </div>

        <div className="w-full flex gap-4">
          {/* Form fields */}
          <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Detalles del banner</h2>
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
                  Nombre interno
                </label>
                <div className="relative">
                  <Tag size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Ej. Banner verano 2025"
                    required
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Título del banner
                </label>
                <div className="relative">
                  <Type size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    type="text"
                    placeholder="Ej. ¡Grandes ofertas de temporada!"
                    required
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descripción
                </label>
                <div className="relative">
                  <AlignLeft size={15} className="absolute left-2.5 top-3 text-slate-400" />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ej. Descubrí las mejores promociones del mes..."
                    required
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL de imagen
                </label>
                <div className="relative">
                  <Image size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="url_img"
                    value={form.url_img}
                    onChange={handleChange}
                    type="text"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Texto del botón
                </label>
                <div className="relative">
                  <MousePointerClick size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="text_button"
                    value={form.text_button}
                    onChange={handleChange}
                    type="text"
                    placeholder="Ej. Ver ofertas"
                    required
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL del botón
                </label>
                <div className="relative">
                  <ExternalLink size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="url_button"
                    value={form.url_button}
                    onChange={handleChange}
                    type="text"
                    placeholder="https://ejemplo.com/ofertas"
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div className="w-72 flex-shrink-0 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Vista previa</h2>
            <div className="rounded-lg overflow-hidden border border-slate-100">
              <div className="h-36 bg-slate-100 flex items-center justify-center overflow-hidden">
                {previewImg ? (
                  <img
                    src={previewImg}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewImg(null)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Image size={32} />
                    <span className="text-xs">Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {form.title || "Título del banner"}
                </p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {form.description || "Descripción del banner..."}
                </p>
                {form.text_button && (
                  <span className="mt-2 inline-block px-3 py-1 bg-[#6366f1] text-white text-xs font-semibold rounded-lg">
                    {form.text_button}
                  </span>
                )}
              </div>
            </div>
            {editingId && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                Editando banner #{editingId}
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Listado */}
      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de banners</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Botón</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Imagen</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Array.isArray(banners) && banners.length > 0 ? (
                  banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{banner.id}</td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <Image size={16} />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{banner.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{banner.title}</td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                          <MousePointerClick size={12} />
                          {banner.text_button}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {banner.url_img ? (
                          <img
                            src={banner.url_img}
                            alt={banner.name}
                            className="h-10 w-16 object-cover rounded-lg border border-slate-200"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <span className="text-xs text-slate-400">Sin imagen</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            banner.active === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {banner.active === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(banner)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                          title="Cargar para editar"
                        >
                          <Save size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        No hay banners disponibles
                        <Image size={18} />
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