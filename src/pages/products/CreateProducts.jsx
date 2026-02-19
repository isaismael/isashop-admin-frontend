import React, { useEffect, useRef, useState } from "react";
import { Save, Trash, SquarePen, BookmarkPlus, ImagePlus, X, Upload, ChevronDown, ChevronRight, Star, ToggleLeft, ToggleRight } from "lucide-react";

import CategoriesService from "../../services/categories.service";
import BrandService from "../../services/brand.service";
import ProductService from "../../services/product.service";
import ProductVariationService from "../../services/productVariation.service";
import ProductImageService from "../../services/productImage.service";
import ColorsService from "../../services/colors.service";
import SizesService from "../../services/sizes.service";

export const CreateProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  // "product" | "variation" | "image"
  const [mode, setMode] = useState("product");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  // Expanded rows in table (for showing variations dropdown)
  const [expandedProductId, setExpandedProductId] = useState(null);
  // variations per product: { [product_id]: [...] }
  const [variationsMap, setVariationsMap] = useState({});

  // Images para nuevas subidas
  const [images, setImages] = useState([]);
  // Imágenes ya existentes en la variante
  const [existingImages, setExistingImages] = useState([]);
  // ID de imagen existente marcada como principal
  const [mainImageId, setMainImageId] = useState(null);
  // Index de nueva imagen marcada como principal
  const [mainImageIndex, setMainImageIndex] = useState(null);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand_id: "",
    subcategory_id: "",
    active: 1,
  });

  const [variationForm, setVariationForm] = useState({
    name: "",
    sku_variation: "",
    product_id: "",
    color_id: "",
    size_id: "",
    older_price: "",
    current_price: "",
    discount: 0,
    active: 1,
  });

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isEditingVariation, setIsEditingVariation] = useState(false);

  //-> fetch de productos con paginación
  const fetchProducts = async (page, limit) => {
    const productInstance = new ProductService();
    try {
      const response = await productInstance.getProducts(page, limit);
      setProducts(response?.data || response || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error("Error en fetchProducts:", error);
      setProducts([]);
      setPagination(null);
    }
  };

  //fetch de variaciones para un producto específico, guardándolas en un map para evitar refetch innecesarios
  const fetchVariations = async (productId) => {
    const id = Number(productId);
    if (variationsMap[id]) return;
    const variationInstance = new ProductVariationService();
    try {
      const response = await variationInstance.getVariationsByProduct(id);
      setVariationsMap((prev) => ({ ...prev, [id]: response || [] }));
    } catch (error) {
      console.error("Error fetchVariations:", error);
      setVariationsMap((prev) => ({ ...prev, [id]: [] }));
    }
  };

  //-> cargar imagenes existentes para una variante
  const fetchImagesForVariation = async (variationId) => {
    try {
      const imageService = new ProductImageService();
      const all = await imageService.getAllProductImages();
      const filtered = (all || []).filter(
        (img) => Number(img.product_variation_id) === Number(variationId)
      );
      setExistingImages(filtered);
      const main = filtered.find((img) => Number(img.is_main) === 1);
      setMainImageId(main?.id || null);
    } catch (error) {
      console.error("Error cargando imágenes existentes:", error);
      setExistingImages([]);
    }
  };

  //-> toggle product active
  const handleToggleProductActive = async (product) => {
    try {
      const productInstance = new ProductService();
      const newActive = product.active === 1 || product.active === true ? 0 : 1;
      await productInstance.updateProduct(product.id, { active: newActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: newActive } : p))
      );
    } catch (error) {
      console.error("Error toggling product active:", error);
    }
  };

  //-> toggle variation active
  const handleToggleVariationActive = async (product, variation) => {
    try {
      const variationInstance = new ProductVariationService();
      const newActive = variation.active === 1 || variation.active === true ? 0 : 1;
      await variationInstance.updateProductVariation(variation.id, { active: newActive });
      const productId = Number(product.id);
      setVariationsMap((prev) => ({
        ...prev,
        [productId]: (prev[productId] || []).map((v) =>
          v.id === variation.id ? { ...v, active: newActive } : v
        ),
      }));
    } catch (error) {
      console.error("Error toggling variation active:", error);
    }
  };

  //-> toggle row
  const handleToggleExpand = async (product) => {
    const id = Number(product.id);
    if (expandedProductId === id) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(id);
      await fetchVariations(id);
    }
  };

  //-> change product
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //-> change variation
  const handleVariationChange = (e) => {
    const { name, value } = e.target;
    setVariationForm((prev) => ({ ...prev, [name]: value }));
  };

  //-> nueva img
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
    if (mainImageIndex === index) setMainImageIndex(null);
    else if (mainImageIndex > index) setMainImageIndex((prev) => prev - 1);
  };

  //-> eliminar imagen existente
  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    try {
      const imageService = new ProductImageService();
      await imageService.deleteProductImage(imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      if (mainImageId === imageId) setMainImageId(null);
    } catch (error) {
      console.error("Error eliminando imagen:", error);
    }
  };

  //-> image is_main para imágenes existentes
  const handleSetMainExisting = async (imageId) => {
    try {
      const imageService = new ProductImageService();
      if (mainImageId && mainImageId !== imageId) {
        await imageService.updateProductImage(mainImageId, { is_main: 0 });
      }
      await imageService.updateProductImage(imageId, { is_main: 1 });
      setMainImageId(imageId);
      setMainImageIndex(null);
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, is_main: img.id === imageId ? 1 : 0 }))
      );
    } catch (error) {
      console.error("Error actualizando is_main:", error);
    }
  };

  //-> image is_main
  const handleSetMainNew = (index) => {
    if (mainImageIndex === index) {
      setMainImageIndex(null);
    } else {
      setMainImageIndex(index);
      setMainImageId(null);
    }
  };

  //-> submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const productInstance = new ProductService();
      if (isEditingProduct && selectedProduct) {
        await productInstance.updateProduct(selectedProduct.id, form);
      } else {
        await productInstance.createProduct(form);
      }
      setForm({ name: "", description: "", brand_id: "", subcategory_id: "", active: 1 });
      setSelectedProduct(null);
      setIsEditingProduct(false);
      await fetchProducts(page, limit);
    } catch (error) {
      console.error("Error guardando producto:", error);
    } finally {
      setLoading(false);
    }
  };

  //-> edit product
  const handleEditProduct = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      brand_id: product.brand_id || "",
      subcategory_id: product.subcategory_id || "",
      active: product.active ?? 1,
    });
    setSelectedProduct(product);
    setIsEditingProduct(true);
    setMode("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //-> submit variation
  const handleVariationSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!variationForm.product_id) {
      alert("Seleccioná un producto desde la tabla primero.");
      return;
    }
    setLoading(true);
    try {
      const sanitized = Object.fromEntries(
        Object.entries(variationForm).map(([k, v]) => [k, v === "" ? null : v])
      );
      const variationInstance = new ProductVariationService();
      if (isEditingVariation && selectedVariation) {
        await variationInstance.updateProductVariation(selectedVariation.id, sanitized);
      } else {
        await variationInstance.createProductVariation(sanitized);
      }

      const productId = Number(variationForm.product_id);
      setVariationsMap((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      if (expandedProductId === productId) {
        const variationInstance2 = new ProductVariationService();
        try {
          const response = await variationInstance2.getVariationsByProduct(productId);
          setVariationsMap((prev) => ({ ...prev, [productId]: response || [] }));
        } catch (error) {
          console.error("Error re-fetching variations:", error);
          setVariationsMap((prev) => ({ ...prev, [productId]: [] }));
        }
      }

      setVariationForm({
        name: "", sku_variation: "", product_id: "",
        color_id: "", size_id: "", older_price: "", current_price: "", discount: 0, active: 1,
      });
      setSelectedVariation(null);
      setSelectedProduct(null);
      setIsEditingVariation(false);
      setMode("product");
    } catch (error) {
      console.error("Error guardando variante:", error);
    } finally {
      setLoading(false);
    }
  };

  // -> submit image
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!selectedVariation || !selectedProduct) {
      alert("Seleccioná un producto y una variante desde la tabla.");
      return;
    }
    if (images.length === 0) {
      alert("Seleccioná al menos una imagen.");
      return;
    }
    setLoading(true);
    try {
      const imageService = new ProductImageService();

      if (mainImageIndex !== null && mainImageId) {
        await imageService.updateProductImage(mainImageId, { is_main: 0 });
      }

      const uploadPromises = images.map((img, index) => {
        const formData = new FormData();
        formData.append("image", img.file);
        formData.append("product_id", selectedProduct.id);
        formData.append("product_variation_id", selectedVariation.id);
        formData.append("is_main", index === mainImageIndex ? 1 : 0);
        return imageService.createProductImage(formData);
      });
      await Promise.all(uploadPromises);

      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setMainImageIndex(null);

      await fetchImagesForVariation(selectedVariation.id);
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
    } finally {
      setLoading(false);
    }
  };

  //-> variation form
  const handleOpenVariation = (product) => {
    setSelectedProduct(product);
    setVariationForm({
      name: "", sku_variation: "", product_id: Number(product.id),
      color_id: "", size_id: "", older_price: "", current_price: "", discount: 0, active: 1,
    });
    setIsEditingVariation(false);
    setSelectedVariation(null);
    setMode("variation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditVariation = (product, variation) => {
    setSelectedProduct(product);
    setSelectedVariation(variation);
    setVariationForm({
      name: variation.name || "",
      sku_variation: variation.sku_variation || "",
      product_id: Number(product.id),
      color_id: variation.color_id || "",
      size_id: variation.size_id || "",
      older_price: variation.older_price || "",
      current_price: variation.current_price || "",
      discount: variation.discount || 0,
      active: variation.active ?? 1,
    });
    setIsEditingVariation(true);
    setMode("variation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -> image form
  const handleOpenImageForVariation = (product, variation) => {
    setSelectedProduct(product);
    setSelectedVariation(variation);
    setImages([]);
    setMainImageIndex(null);
    setExistingImages([]);
    setMainImageId(null);
    setMode("image");
    fetchImagesForVariation(variation.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -> discard
  const discard = () => {
    setForm({ name: "", description: "", brand_id: "", subcategory_id: "", active: 1 });
    setVariationForm({
      name: "", sku_variation: "", product_id: "",
      color_id: "", size_id: "", older_price: "", current_price: "", discount: 0, active: 1,
    });
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setExistingImages([]);
    setMainImageId(null);
    setMainImageIndex(null);
    setSelectedProduct(null);
    setSelectedVariation(null);
    setIsEditingProduct(false);
    setIsEditingVariation(false);
    setMode("product");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryInstance = new CategoriesService();
      try {
        const response = await categoryInstance.getAllCategories();
        setCategories(response);
      } catch (error) { console.error(error); }
    };
    const fetchBrands = async () => {
      const brandInstance = new BrandService();
      try {
        const response = await brandInstance.getBrands();
        setBrands(response);
      } catch (error) { console.error(error); }
    };
    const fetchColors = async () => {
      const colorsInstance = new ColorsService();
      try {
        // Intentamos traer todos sin paginar; ajustá el método según tu servicio
        const response = await colorsInstance.getColors(1, 999);
        setColors(response?.data || response || []);
      } catch (error) { console.error(error); }
    };
    const fetchSizes = async () => {
      const sizesInstance = new SizesService();
      try {
        const response = await sizesInstance.getSizesPaginated(1, 999);
        setSizes(response?.data || response || []);
      } catch (error) { console.error(error); }
    };
    fetchCategories();
    fetchBrands();
    fetchColors();
    fetchSizes();
  }, []);

  useEffect(() => {
    fetchProducts(page, limit);
  }, [page, limit]);

  useEffect(() => {
    return () => { images.forEach((img) => URL.revokeObjectURL(img.preview)); };
  }, []);

  const isProductMode = mode === "product";
  const isVariationMode = mode === "variation";
  const isImageMode = mode === "image";

  const handleSave = (e) => {
    if (isProductMode) return handleSubmit(e);
    if (isVariationMode) return handleVariationSubmit(e);
    if (isImageMode) return handleImageSubmit(e);
  };

  const isActive = (val) => val === 1 || val === true;

  return (
    <div>
      {/* //-> Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isVariationMode
            ? `Nueva Variante — ${selectedProduct?.name}`
            : isImageMode
              ? `Nueva Imagen — ${selectedVariation?.name || selectedProduct?.name}`
              : "Crear Producto"}
        </h2>
        <p className="text-slate-500">
          {isVariationMode
            ? "Completá los detalles de la variante para el producto seleccionado."
            : isImageMode
              ? "Subí imágenes para la variante seleccionada."
              : "Completá los detalles para incluir su nuevo producto en el mercado."}
        </p>
      </div>

      {/* //-> Tabs y botones */}
      <div className="flex justify-between mt-2 mb-4">
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setMode("product")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${isProductMode
              ? "border-[#6366f1] text-[#6366f1]"
              : "border-transparent text-slate-500 hover:text-[#6366f1]"}`}
          >
            Nuevo Producto
          </button>

          <button
            onClick={() => setMode("variation")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${isVariationMode
              ? "border-[#6366f1] text-[#6366f1]"
              : "border-transparent text-slate-500 hover:text-[#6366f1]"}`}
          >
            Nueva Variante
            {isVariationMode && selectedProduct && (
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                {selectedProduct.name}
              </span>
            )}
          </button>

          <button
            onClick={() => setMode("image")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${isImageMode
              ? "border-[#6366f1] text-[#6366f1]"
              : "border-transparent text-slate-500 hover:text-[#6366f1]"}`}
          >
            Nueva Imagen
            {isImageMode && selectedVariation && (
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                {selectedVariation.name}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={discard}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition"
          >
            <Trash size={18} />
            Descartar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            <Save size={18} />
            {loading
              ? "Guardando..."
              : isProductMode
                ? isEditingProduct ? "Actualizar Producto" : "Crear Producto"
                : isVariationMode
                  ? isEditingVariation ? "Actualizar Variante" : "Crear Variante"
                  : "Subir Imágenes"}
          </button>
        </div>
      </div>

      {/* //-> form del producto*/}
      {isProductMode && (
        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold">Información General</h3>
              <p className="text-sm text-slate-500">Detalles básicos sobre tu producto.</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Producto</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                  <select
                    name="subcategory_id" value={form.subcategory_id} onChange={handleChange}
                    className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Marca</label>
                  <select
                    name="brand_id" value={form.brand_id} onChange={handleChange}
                    className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="">Selecciona una marca</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>

              {/* //-> activo o no */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">Estado del producto</p>
                  <p className="text-xs text-slate-400">
                    {isActive(form.active) ? "El producto es visible en el catálogo." : "El producto está oculto del catálogo."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, active: isActive(prev.active) ? 0 : 1 }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive(form.active)
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                  }`}
                >
                  {isActive(form.active)
                    ? <><ToggleRight size={20} /> Activo</>
                    : <><ToggleLeft size={20} /> Inactivo</>}
                </button>
              </div>
            </div>
          </section>
        </form>
      )}

      {/* //-> form para la variante */}
      {isVariationMode && (
        <form onSubmit={handleVariationSubmit} className="space-y-8 pb-12">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold">Detalle de la Variante</h3>
              <p className="text-sm text-slate-500">
                {selectedProduct
                  ? `Variante para: ${selectedProduct.name}`
                  : "Seleccioná un producto desde la tabla."}
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Producto</label>
                <input
                  type="text"
                  value={selectedProduct ? `#${selectedProduct.id} — ${selectedProduct.name}` : ""}
                  disabled
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* //-> Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Variante</label>
                  <input
                    type="text" name="name" value={variationForm.name}
                    onChange={handleVariationChange} placeholder="Ej. Rojo Talle M"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>

                {/* //-> SKU */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SKU Variante</label>
                  <input
                    type="text" name="sku_variation" value={variationForm.sku_variation}
                    onChange={handleVariationChange} placeholder="Ej. SKU-001-RED-M"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>

                {/* //-> color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <select
                    name="color_id" value={variationForm.color_id}
                    onChange={handleVariationChange}
                    className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="">Sin color</option>
                    {colors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.hex ? `(${c.hex})` : ""}
                      </option>
                    ))}
                  </select>
                  {/* visualizar colors */}
                  {variationForm.color_id && colors.find((c) => String(c.id) === String(variationForm.color_id)) && (
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-5 h-5 rounded-full border border-slate-300"
                        style={{
                          backgroundColor: colors.find((c) => String(c.id) === String(variationForm.color_id))?.hex
                        }}
                      />
                      <span className="text-xs text-slate-500">
                        {colors.find((c) => String(c.id) === String(variationForm.color_id))?.hex}
                      </span>
                    </div>
                  )}
                </div>

                {/* sizes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Talle</label>
                  <select
                    name="size_id" value={variationForm.size_id}
                    onChange={handleVariationChange}
                    className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="">Sin talle</option>
                    {sizes.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Precio Anterior */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Precio Anterior</label>
                  <input
                    type="number" name="older_price" value={variationForm.older_price}
                    onChange={handleVariationChange} placeholder="0.00" step="0.01"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>

                {/* Precio Actual */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Precio Actual *</label>
                  <input
                    type="number" name="current_price" value={variationForm.current_price}
                    onChange={handleVariationChange} placeholder="0.00" step="0.01" required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>

                {/* //-> off */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descuento (%)</label>
                  <input
                    type="number" name="discount" value={variationForm.discount}
                    onChange={handleVariationChange} placeholder="0" min="0" max="100"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              {/* //-> activo o no variante */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">Estado de la variante</p>
                  <p className="text-xs text-slate-400">
                    {isActive(variationForm.active) ? "La variante es visible en el catálogo." : "La variante está oculta del catálogo."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVariationForm((prev) => ({ ...prev, active: isActive(prev.active) ? 0 : 1 }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive(variationForm.active)
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                  }`}
                >
                  {isActive(variationForm.active)
                    ? <><ToggleRight size={20} /> Activo</>
                    : <><ToggleLeft size={20} /> Inactivo</>}
                </button>
              </div>
            </div>
          </section>
        </form>
      )}

      {/* //-> formulario para imagenes */}
      {isImageMode && (
        <form onSubmit={handleImageSubmit} className="space-y-8 pb-12">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold">Imágenes de la Variante</h3>
              <p className="text-sm text-slate-500">
                {selectedVariation
                  ? `Subiendo imágenes para: ${selectedProduct?.name} — ${selectedVariation.name}`
                  : "Seleccioná una variante desde la tabla (▾) para agregar imágenes."}
              </p>
            </div>
            <div className="p-6 space-y-6">

              {/* Producto / Variante */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Producto</label>
                  <input
                    type="text"
                    value={selectedProduct ? `#${selectedProduct.id} — ${selectedProduct.name}` : ""}
                    disabled
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Variante</label>
                  <input
                    type="text"
                    value={selectedVariation ? `#${selectedVariation.id} — ${selectedVariation.name}` : ""}
                    disabled
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-400"
                  />
                </div>
              </div>

              {/* // -> listado de imagenes existentes */}
              {existingImages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Imágenes actuales
                    </label>
                    <span className="flex flex-row items-center justify-center gap-2 text-xs text-slate-400">
                      — Hacé hover y clickeá la <Star size={14}/> para marcar como principal, o la ✕ para eliminar
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {existingImages.map((img) => {
                      const isMain = mainImageId === img.id;
                      return (
                        <div
                          key={img.id}
                          className={`relative group rounded-lg overflow-hidden border-2 aspect-square transition-all duration-200 ${isMain
                            ? "border-yellow-400 ring-2 ring-yellow-200"
                            : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <img
                            src={`${import.meta.env.VITE_API_URL || "http://localhost:3014"}/${img.url.replace(/^api\//, "")}`}
                            alt={`imagen-${img.id}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetMainExisting(img.id)}
                              title={isMain ? "Imagen principal" : "Marcar como principal"}
                              className={`p-1.5 rounded-full transition-all duration-150 ${isMain
                                ? "bg-yellow-400 text-white scale-110"
                                : "bg-white/90 text-slate-500 hover:bg-yellow-400 hover:text-white"
                                }`}
                            >
                              <Star size={14} fill={isMain ? "currentColor" : "none"} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExistingImage(img.id)}
                              title="Eliminar imagen"
                              className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-150"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          {isMain && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-yellow-400 text-white px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shadow">
                              Principal
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* //-> tab add image */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {existingImages.length > 0 ? "Agregar nuevas imágenes" : "Imágenes"}
                  </label>
                  {images.length > 0 && (
                    <span className="flex flex-row items-center justify-center gap-2 text-xs text-slate-400">
                      — Hacé hover y clickeá la <Star size={14}/> para marcar como principal
                    </span>
                  )}
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
                >
                  <Upload size={28} className="text-slate-400" />
                  <p className="text-sm text-slate-500">Hacé click para seleccionar imágenes</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP hasta 5 MB c/u</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                    {images.map((img, index) => {
                      const isMain = mainImageIndex === index;
                      return (
                        <div
                          key={index}
                          className={`relative group rounded-lg overflow-hidden border-2 aspect-square transition-all duration-200 ${isMain
                            ? "border-yellow-400 ring-2 ring-yellow-200"
                            : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <img
                            src={img.preview}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetMainNew(index)}
                              title={isMain ? "Imagen principal" : "Marcar como principal"}
                              className={`p-1.5 rounded-full transition-all duration-150 ${isMain
                                ? "bg-yellow-400 text-white scale-110"
                                : "bg-white/90 text-slate-500 hover:bg-yellow-400 hover:text-white"
                                }`}
                            >
                              <Star size={14} fill={isMain ? "currentColor" : "none"} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-150"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          {isMain && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-yellow-400 text-white px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shadow">
                              Principal
                            </span>
                          )}
                          {!isMain && (
                            <span className="absolute top-1 right-1 text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-semibold opacity-0 group-hover:opacity-100 transition">
                              Nueva
                            </span>
                          )}
                        </div>
                      );
                    })}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 aspect-square cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
                    >
                      <ImagePlus size={20} className="text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </form>
      )}

      {/* //-> product list */}
      <div className="w-full mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de productos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-8"></th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Subcategoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Marca</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Editar</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Variante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {products.length > 0 ? (
                  products.map((product) => (
                    <React.Fragment key={product.id}>
                      {/* //-> producto row */}
                      <tr
                        className={`hover:bg-slate-50 transition ${selectedProduct?.id === product.id && !isProductMode
                          ? "bg-indigo-50 border-l-4 border-indigo-400"
                          : ""
                          }`}
                      >
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleToggleExpand(product)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-400 transition"
                            title="Ver variantes"
                          >
                            {expandedProductId === Number(product.id)
                              ? <ChevronDown size={16} />
                              : <ChevronRight size={16} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm">{product.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{product.subcategory?.name || "—"}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{product.brand?.name || "—"}</td>

                        {/* // -> activar desactivar producto */}
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleToggleProductActive(product)}
                            title={isActive(product.active) ? "Desactivar producto" : "Activar producto"}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActive(product.active)
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {isActive(product.active)
                              ? <><ToggleRight size={16} /> Activo</>
                              : <><ToggleLeft size={16} /> Inactivo</>}
                          </button>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                          >
                            <SquarePen size={18} />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleOpenVariation(product)}
                            title="Agregar variante"
                            className={`p-2 rounded-lg transition ${selectedProduct?.id === product.id && isVariationMode
                              ? "bg-indigo-100 text-indigo-700"
                              : "hover:bg-indigo-50 text-indigo-600"
                              }`}
                          >
                            <BookmarkPlus size={18} />
                          </button>
                        </td>
                      </tr>

                      {/* //-> dropdown variante */}
                      {expandedProductId === Number(product.id) && (
                        <tr key={`variations-${product.id}`}>
                          <td colSpan={8} className="px-0 py-0">
                            <div className="bg-slate-50 border-t border-slate-100">
                              {!variationsMap[Number(product.id)] ? (
                                <p className="px-12 py-4 text-sm text-slate-400">Cargando variantes...</p>
                              ) : variationsMap[Number(product.id)].length === 0 ? (
                                <p className="px-12 py-4 text-sm text-slate-400">
                                  No hay variantes para este producto.{" "}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenVariation(product)}
                                    className="text-indigo-500 underline hover:text-indigo-700"
                                  >
                                    Agregar una
                                  </button>
                                </p>
                              ) : (
                                <table className="w-full text-left">
                                  <thead>
                                    <tr>
                                      <th className="px-12 py-2 text-xs font-bold text-slate-400 uppercase">ID Var.</th>
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">Nombre</th>
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">SKU</th>
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">Precio</th>
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">Estado</th>
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">Imágenes</th>
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">Acción</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white">
                                    {variationsMap[Number(product.id)].map((variation) => (
                                      <tr
                                        key={variation.id}
                                        className={`hover:bg-slate-50 transition ${selectedVariation?.id === variation.id && isImageMode
                                          ? "bg-white border-l-4 border-indigo-400"
                                          : ""
                                          }`}
                                      >
                                        <td className="px-12 py-3 text-sm text-slate-500">#{variation.id}</td>
                                        <td className="px-6 py-3 text-sm font-medium">{variation.name || "—"}</td>
                                        <td className="px-6 py-3 text-sm text-slate-400">{variation.sku_variation || "—"}</td>
                                        <td className="px-6 py-3 text-sm text-slate-600">${variation.current_price}</td>

                                        {/* //-> ver variantes*/}
                                        <td className="px-6 py-3">
                                          <button
                                            type="button"
                                            onClick={() => handleToggleVariationActive(product, variation)}
                                            title={isActive(variation.active) ? "Desactivar variante" : "Activar variante"}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                              isActive(variation.active)
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            }`}
                                          >
                                            {isActive(variation.active)
                                              ? <><ToggleRight size={16} /> Activo</>
                                              : <><ToggleLeft size={16} /> Inactivo</>}
                                          </button>
                                        </td>

                                        <td className="px-6 py-3">
                                          <button
                                            type="button"
                                            onClick={() => handleOpenImageForVariation(product, variation)}
                                            title="Agregar imágenes"
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedVariation?.id === variation.id && isImageMode
                                              ? "bg-indigo-100 text-indigo-700"
                                              : "hover:bg-indigo-50 text-indigo-600"
                                              }`}
                                          >
                                            <ImagePlus size={14} />
                                            Agregar imágenes
                                          </button>
                                        </td>
                                        <td className="px-6 py-3">
                                          <button
                                            type="button"
                                            onClick={() => handleEditVariation(product, variation)}
                                            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                                          >
                                            <SquarePen size={18} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-slate-400">
                      No hay productos creados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* // -> paginacion*/}
          {pagination && (
            <div className="sticky bottom-0 w-full flex justify-between gap-4 mt-6 bg-white border-t border-gray-200 px-6 py-4 z-10">
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
                  Mostrando {products.length} de {pagination.total} productos
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};