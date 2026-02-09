import { Save, Trash } from "lucide-react";
import { useState } from "react";
import BrandService from "../../services/brand.service";

export const Brands = () => {
  const initialForm = {
    name: "",
    description: "",
    active: 1,
  };

  const [form, setForm] = useState(initialForm);

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

  const discardBrand = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const brandService = new BrandService();
      await brandService.createBrand(form);

      discardBrand();
      alert("Marca creada correctamente");
    } catch (error) {
      console.error("Error al crear marca:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Gestor de marcas</h2>
        <p className="text-slate-500">
          Defina información clave de la marca y recursos visualmente
          enriquecidos para lograr una exhibición atractiva.
        </p>

        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={discardBrand}
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
            Crear Marca
          </button>
        </div>
      </div>

      <div className="w-full flex gap-3">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-6">Detalles de la marca</h2>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-500">
                {form.active === 1 ? "Activa" : "Inactiva"}
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre de la marca
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Ej. Nike, Apple, Samsung, etc."
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
            />
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción y palabras claves sobre la marca..."
              className="w-full rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de marcas</h2>
        </div>
      </div>
    </form>
  );
};
