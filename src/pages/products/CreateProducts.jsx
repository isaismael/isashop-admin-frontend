import { useEffect, useState } from "react";
import { Save, Trash } from "lucide-react";
import CategoriesService from "../../services/categories.service";
import BrandService from "../../services/brand.service";

export const CreateProducts = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    brand: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto a crear:", form);
    // 👉 acá después vas a hacer el POST a tu backend
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryInstance = new CategoriesService();
      try {
        const response = await categoryInstance.getAllCategories();
        setCategories(response);

        if (response.length > 0) {
          setForm((prev) => ({ ...prev, category: response[0].name }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
    // -> gell brands
    const fetBrands = async () => {
      const brandInstance = new BrandService();
      try {
        const response = await brandInstance.getAllBrands();
        setBrands(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetBrands();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Crear Producto</h2>

        <div>
          <p className="text-slate-500">
            Completá los detalles para incluir su nuevo producto en el mercado.
          </p>

          <div className="flex flex-row justify-end items-center gap-3">
            <button className="flex flex-row justify-center items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition">
              <Trash size={18} />
              Descartar
            </button>
            <button className="flex flex-row justify-center items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">
              <Save size={18} />
              Crear Producto
            </button>
          </div>
        </div>
      </div>

      {/* btn cargar product o discard */}

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        {/* Sección 1 */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold">Información General</h3>
            <p className="text-sm text-slate-500">
              Detalles básicos sobre tu producto.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del Producto
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Remera de Dragon Ball Z"
                className="w-full rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary px-3 py-2"
              />
            </div>

            {/* Categoría y Marca */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoría
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary px-3 py-2"
                >
                  {categories?.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Marca
                </label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary px-3 py-2"
                >
                  {brands?.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describí las características y beneficios del producto..."
                className="w-full rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Crear Producto
          </button>
        </div>
      </form>
    </div>
  );
};
