import { useState, useEffect } from "react";
import { ArrowLeft, Search, PackageCheck, Package, Loader2, ShoppingBag } from "lucide-react";
import CollectionService from "../../services/collection.service";
import ProductService from "../../services/product.service";

export const CollectionProducts = ({ collection, onBack }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [collectionProductIds, setCollectionProductIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // product_id being saved

  const fetchData = async () => {
    setLoading(true);
    try {
      const collectionService = new CollectionService();
      const productService = new ProductService();

      // Traer todos los productos (página 1, límite alto)
      const productsRes = await productService.getProducts(1, 200);
      const products = productsRes?.products || productsRes?.data || productsRes || [];

      // Traer productos ya en la colección
      const colWithProducts = await collectionService.getCollectionWithProducts(collection.id);
      const colProducts = colWithProducts?.products || colWithProducts?.data?.products || [];

      setAllProducts(products);
      setCollectionProductIds(new Set(colProducts.map((p) => p.id)));
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collection.id]);

  const handleToggle = async (productId) => {
    setSaving(productId);
    const service = new CollectionService();
    try {
      if (collectionProductIds.has(productId)) {
        await service.removeProductFromCollection(collection.id, productId);
        setCollectionProductIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await service.addProductToCollection(collection.id, productId);
        setCollectionProductIds((prev) => new Set([...prev, productId]));
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert(error.message);
    } finally {
      setSaving(null);
    }
  };

  const filtered = allProducts.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCount = collectionProductIds.size;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Productos de la colección</h2>
          <p className="text-slate-500">
            <span className="font-semibold text-indigo-600">{collection.name}</span>
            {" · "}
            {selectedCount} producto{selectedCount !== 1 ? "s" : ""} asignado{selectedCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
        {/* Search */}
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
          />
        </div>

        {/* Product list */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 size={20} className="animate-spin" />
            Cargando productos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <ShoppingBag size={32} className="opacity-40" />
            <span>No se encontraron productos</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">
                    
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const isChecked = collectionProductIds.has(product.id);
                  const isSaving = saving === product.id;

                  return (
                    <tr
                      key={product.id}
                      onClick={() => !isSaving && handleToggle(product.id)}
                      className={`cursor-pointer transition hover:bg-slate-50 ${
                        isChecked ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        {isSaving ? (
                          <Loader2
                            size={18}
                            className="animate-spin text-indigo-500"
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggle(product.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 accent-indigo-500 cursor-pointer"
                          />
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isChecked
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isChecked ? (
                              <PackageCheck size={16} />
                            ) : (
                              <Package size={16} />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3 text-sm text-slate-500">
                        #{product.id}
                      </td>

                      {/* Badge */}
                      <td className="px-4 py-3">
                        {isChecked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            En colección
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                            Sin asignar
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};