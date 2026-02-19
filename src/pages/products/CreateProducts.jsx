import React, { useEffect, useRef, useState } from "react";
import { Save, Trash, SquarePen, BookmarkPlus, ImagePlus, X, Upload, ChevronDown, ChevronRight } from "lucide-react";

import CategoriesService from "../../services/categories.service";
import BrandService from "../../services/brand.service";
import ProductService from "../../services/product.service";
import ProductVariationService from "../../services/productVariation.service";
import ProductImageService from "../../services/productImage.service";

export const CreateProducts = () => {
  const [products, setProducts] = useState([]);
  const [page] = useState(1);
  const [limit] = useState(10);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  // "product" | "variation" | "image"
  const [mode, setMode] = useState("product");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  // Expanded rows in table (for showing variations dropdown)
  const [expandedProductId, setExpandedProductId] = useState(null);
  // variations per product: { [product_id]: [...] }
  const [variationsMap, setVariationsMap] = useState({});

  // Images for the image tab
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand_id: "",
    subcategory_id: "",
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
  });

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isEditingVariation, setIsEditingVariation] = useState(false);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    const productInstance = new ProductService();
    try {
      const response = await productInstance.getProducts(page, limit);
      setProducts(response.data || response);
    } catch (error) {
      console.error("Error en fetchProducts:", error);
    }
  };

  // =========================
  // FETCH VARIATIONS FOR A PRODUCT
  // =========================
  const fetchVariations = async (productId) => {
    const id = Number(productId); // ✅ siempre número
    if (variationsMap[id]) return; // already fetched
    const variationInstance = new ProductVariationService();
    try {
      const response = await variationInstance.getVariationsByProduct(id);
      setVariationsMap((prev) => ({ ...prev, [id]: response || [] }));
    } catch (error) {
      console.error("Error fetchVariations:", error);
      setVariationsMap((prev) => ({ ...prev, [id]: [] }));
    }
  };

  // =========================
  // TOGGLE ROW EXPAND
  // =========================
  const handleToggleExpand = async (product) => {
    const id = Number(product.id); // ✅ siempre número
    if (expandedProductId === id) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(id);
      await fetchVariations(id);
    }
  };

  // =========================
  // HANDLE CHANGE PRODUCT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // HANDLE CHANGE VARIATION
  // =========================
  const handleVariationChange = (e) => {
    const { name, value } = e.target;
    setVariationForm((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // IMAGE HANDLERS
  // =========================
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
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================
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

      setForm({ name: "", description: "", brand_id: "", subcategory_id: "" });
      setSelectedProduct(null);
      setIsEditingProduct(false);

      await fetchProducts();
    } catch (error) {
      console.error("Error guardando producto:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEditProduct = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      brand_id: product.brand_id || "",
      subcategory_id: product.subcategory_id || "",
    });

    setSelectedProduct(product);
    setIsEditingProduct(true);
    setMode("product");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // SUBMIT VARIATION
  // =========================
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
        await variationInstance.updateProductVariation(
          selectedVariation.id,
          sanitized
        );
      } else {
        await variationInstance.createProductVariation(sanitized);
      }

      // ✅ FIX: forzar número para evitar type mismatch string vs number
      const productId = Number(variationForm.product_id);

      // Invalidar cache de variantes de ese producto
      setVariationsMap((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      // ✅ FIX: comparar ambos como número
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

      // Reset
      setVariationForm({
        name: "",
        sku_variation: "",
        product_id: "",
        color_id: "",
        size_id: "",
        older_price: "",
        current_price: "",
        discount: 0,
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

  // =========================
  // SUBMIT IMAGES
  // =========================
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
      const uploadPromises = images.map((img) => {
        const formData = new FormData();
        formData.append("image", img.file);
        formData.append("product_id", selectedProduct.id);
        formData.append("product_variation_id", selectedVariation.id);
        return imageService.createProductImage(formData);
      });
      await Promise.all(uploadPromises);

      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setSelectedVariation(null);
      setSelectedProduct(null);
      setMode("product");
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN VARIATION FORM
  // =========================
  const handleOpenVariation = (product) => {
    setSelectedProduct(product);
    setVariationForm({
      name: "", sku_variation: "", product_id: Number(product.id), // ✅ número
      color_id: "", size_id: "", older_price: "", current_price: "", discount: 0,
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
      product_id: Number(product.id), // ✅ número
      color_id: variation.color_id || "",
      size_id: variation.size_id || "",
      older_price: variation.older_price || "",
      current_price: variation.current_price || "",
      discount: variation.discount || 0,
    });

    setIsEditingVariation(true);
    setMode("variation");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // OPEN IMAGE FORM FROM VARIATION ROW
  // =========================
  const handleOpenImageForVariation = (product, variation) => {
    setSelectedProduct(product);
    setSelectedVariation(variation);
    setImages([]);
    setMode("image");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // DISCARD
  // =========================
  const discard = () => {
    setForm({ name: "", description: "", brand_id: "", subcategory_id: "" });
    setVariationForm({
      name: "", sku_variation: "", product_id: "",
      color_id: "", size_id: "", older_price: "", current_price: "", discount: 0,
    });

    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);

    setSelectedProduct(null);
    setSelectedVariation(null);
    setIsEditingProduct(false);
    setIsEditingVariation(false);
    setMode("product");
  };

  // =========================
  // EFFECTS
  // =========================
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

    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, []);

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

  return (
    <div>
      {/* header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isVariationMode ? `Nueva Variante — ${selectedProduct?.name}`
            : isImageMode ? `Nueva Imagen — ${selectedVariation?.name || selectedProduct?.name}`
              : "Crear Producto"}
        </h2>
        <p className="text-slate-500">
          {isVariationMode ? "Completá los detalles de la variante para el producto seleccionado."
            : isImageMode ? `Subí imágenes para la variante seleccionada.`
              : "Completá los detalles para incluir su nuevo producto en el mercado."}
        </p>
      </div>

      {/* tabs y botones */}
      <div className="flex justify-between mt-2 mb-4">
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setMode("product")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${isProductMode ? "border-[#6366f1] text-[#6366f1]" : "border-transparent text-slate-500 hover:text-[#6366f1]"
              }`}
          >
            Nuevo Producto
          </button>

          <button
            onClick={() => setMode("variation")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${isVariationMode ? "border-[#6366f1] text-[#6366f1]" : "border-transparent text-slate-500 hover:text-[#6366f1]"
              }`}
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
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${isImageMode ? "border-[#6366f1] text-[#6366f1]" : "border-transparent text-slate-500 hover:text-[#6366f1]"
              }`}
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
                ? (isEditingProduct ? "Actualizar Producto" : "Crear Producto")
                : isVariationMode
                  ? (isEditingVariation ? "Actualizar Variante" : "Crear Variante")
                  : "Subir Imágenes"
            }
          </button>
        </div>
      </div>

      {/* form producto */}
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
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                  <select name="subcategory_id" value={form.subcategory_id} onChange={handleChange}
                    className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2">
                    <option value="">Selecciona una categoría</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Marca</label>
                  <select name="brand_id" value={form.brand_id} onChange={handleChange}
                    className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2">
                    <option value="">Selecciona una marca</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
            </div>
          </section>
        </form>
      )}

      {/* form variante */}
      {isVariationMode && (
        <form onSubmit={handleVariationSubmit} className="space-y-8 pb-12">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold">Detalle de la Variante</h3>
              <p className="text-sm text-slate-500">
                {selectedProduct ? `Variante para: ${selectedProduct.name}` : "Seleccioná un producto desde la tabla."}
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Producto</label>
                <input type="text"
                  value={selectedProduct ? `#${selectedProduct.id} — ${selectedProduct.name}` : ""}
                  disabled className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Nombre de la Variante", name: "name", type: "text", placeholder: "Ej. Rojo Talle M" },
                  { label: "SKU Variante", name: "sku_variation", type: "text", placeholder: "Ej. SKU-001-RED-M" },
                  { label: "Color ID", name: "color_id", type: "number", placeholder: "ID del color" },
                  { label: "Size ID", name: "size_id", type: "number", placeholder: "ID del talle" },
                  { label: "Precio Anterior", name: "older_price", type: "number", placeholder: "0.00", step: "0.01" },
                  { label: "Precio Actual *", name: "current_price", type: "number", placeholder: "0.00", step: "0.01", required: true },
                  { label: "Descuento (%)", name: "discount", type: "number", placeholder: "0", min: "0", max: "100" },
                ].map(({ label, name, ...rest }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
                    <input name={name} value={variationForm[name]} onChange={handleVariationChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2" {...rest} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </form>
      )}

      {/* form imagen */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Producto</label>
                  <input type="text"
                    value={selectedProduct ? `#${selectedProduct.id} — ${selectedProduct.name}` : ""}
                    disabled className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Variante</label>
                  <input type="text"
                    value={selectedVariation ? `#${selectedVariation.id} — ${selectedVariation.name}` : ""}
                    disabled className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Imágenes</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
                >
                  <Upload size={28} className="text-slate-400" />
                  <p className="text-sm text-slate-500">Hacé click para seleccionar imágenes</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP hasta 5 MB c/u</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />

                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                        <img src={img.preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <div onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 aspect-square cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
                      <ImagePlus size={20} className="text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </form>
      )}

      {/* PRODUCT LIST + EXPAND */}
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Editar</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Variante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {products.length > 0 ? (
                  products.map((product) => (
                    <React.Fragment key={product.id}>
                      {/* PRODUCT ROW */}
                      <tr
                        className={`hover:bg-slate-50 transition ${selectedProduct?.id === product.id && !isProductMode ? "bg-indigo-50 border-l-4 border-indigo-400" : ""
                          }`}
                      >
                        {/* Expand toggle */}
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

                      {/* VARIATIONS DROPDOWN ROW */}
                      {expandedProductId === Number(product.id) && (
                        <tr key={`variations-${product.id}`}>
                          <td colSpan={7} className="px-0 py-0">
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
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">Imágenes</th>
                                      <th className="px-6 py-2 text-xs font-bold text-slate-400 uppercase">Acción</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {variationsMap[Number(product.id)].map((variation) => (
                                      <tr
                                        key={variation.id}
                                        className={`hover:bg-white transition ${selectedVariation?.id === variation.id && isImageMode
                                          ? "bg-white border-l-4 border-indigo-400"
                                          : ""
                                          }`}
                                      >
                                        <td className="px-12 py-3 text-sm text-slate-500">#{variation.id}</td>
                                        <td className="px-6 py-3 text-sm font-medium">{variation.name || "—"}</td>
                                        <td className="px-6 py-3 text-sm text-slate-400">{variation.sku_variation || "—"}</td>
                                        <td className="px-6 py-3 text-sm text-slate-600">
                                          ${variation.current_price}
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
                    <td colSpan={7} className="text-center py-6 text-slate-400">
                      No hay productos creados
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