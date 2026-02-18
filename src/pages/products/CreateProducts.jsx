import { useEffect, useState } from "react";
// -> services
import CategoriesService from "../../services/categories.service";
import BrandService from "../../services/brand.service";
import ProductService from "../../services/product.service";
// ->
import { Save, Trash } from "lucide-react";

export const CreateProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    brand_id: "",
    subcategory_id: "",
  });

  const fetchProducts = async (page, limit) => {
    const productInstance = new ProductService();
    try {
      const response = await productInstance.getProducts(page, limit);
      setProducts(response.data);
    } catch (error) {
      console.error("Error en fetchProducts: ", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productInstance = new ProductService();

    try {
      await productInstance.createProduct(form);

      console.log("Producto creado:", form);

      setForm({
        name: "",
        description: "",
        brand_id: "",
        subcategory_id: "",
      });
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  };

  const discardProduct = () => {
    setForm({
      name: "",
      description: "",
      brand_id: "",
      subcategory_id: "",
    });
  };

  const createVariation = async (variationData) => {
    const variationInstance = new ProductVariationService();
    try {
      const response = await variationInstance.createVariation(variationData);
      console.log("Variación creada:", response);
    } catch (error) {
      console.error("Error creando variación:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryInstance = new CategoriesService();
      try {
        const response = await categoryInstance.getAllCategories();
        setCategories(response);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBrands = async () => {
      const brandInstance = new BrandService();
      try {
        const response = await brandInstance.getBrands();
        setBrands(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchProducts(page, limit);
  }, [page, limit]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Crear Producto</h2>

        <div>
          <p className="text-slate-500">
            Completá los detalles para incluir su nuevo producto en el mercado.
          </p>

          <div className="flex flex-row justify-end items-center gap-3">
            <button
              className="flex flex-row justify-center items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition"
              onClick={discardProduct}
            >
              <Trash size={18} />
              Descartar
            </button>
            <button
              onClick={handleSubmit}
              className="flex flex-row justify-center items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
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
                  name="subcategory_id"
                  value={form.subcategory_id}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
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
                  name="brand_id"
                  value={form.brand_id}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option value="">Selecciona una marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
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
      </form>
      {/* listado de products creado */}
      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200">
            <h3 className="text-lg font-semibold mb-6">Listado de productos</h3>
          </div>
          <div className="overflow-x-auto">
            <div className="rounded-lg overflow-x-auto text-sm">
              <div className="space-y-4">
                {products.length > 0 && (
                  <div className="mt-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-row justify-between items-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm mb-4"
                      >
                        <h4 className="text-md font-semibold">
                          {product.id}
                        </h4>
                        <h4 className="text-md font-semibold">
                          {product.name}
                        </h4>
                        <h4 className="text-md font-semibold">
                          {product.subcategory.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {product.brand.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
