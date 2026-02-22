import { Save, Trash, SquarePen, Frown, CircleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import StockService from "../../services/stock.service";
import WarehouseService from "../../services/warehouse.service";

export const Stock = () => {
  const initialForm = {
    warehouse_id: "",
    product_variation_id: "",
    quantity: 0,
    committed_quantity: 0,
    damage_quantity: 0,
    ordered_quantity: 0,
    safety_stock: 0,
  };

  const [form, setForm] = useState(initialForm);
  const [stocks, setStocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const discardStock = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getStocks = async (page, limit) => {
    try {
      const stockService = new StockService();
      const response = await stockService.getStocks(page, limit);
      setStocks(response?.data || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error("Error en getStocks:", error.message);
      setStocks([]);
      setPagination(null);
    }
  };

  const getWarehouses = async () => {
    try {
      const warehouseService = new WarehouseService();
      const response = await warehouseService.getAllWarehouse();
      setWarehouses(response || []);
    } catch (error) {
      console.error("Error en getWarehouses:", error.message);
      setWarehouses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const stockService = new StockService();
      if (editingId) {
        await stockService.updateStock(editingId, form);
        alert("Stock actualizado correctamente");
      } else {
        await stockService.createStock(form);
        alert("Stock creado correctamente");
      }
      discardStock();
      getStocks(page, limit);
    } catch (error) {
      console.error("Error al guardar stock:", error);
    }
  };

  const handleEdit = (stock) => {
    setForm({
      warehouse_id: stock.warehouse_id,
      product_variation_id: stock.product_variation_id,
      quantity: stock.quantity,
      committed_quantity: stock.committed_quantity,
      damage_quantity: stock.damage_quantity,
      ordered_quantity: stock.ordered_quantity,
      safety_stock: stock.safety_stock,
    });
    setEditingId(stock.id);
  };

  useEffect(() => {
    getStocks(page, limit);
    getWarehouses();
  }, [page, limit]);

  const getWarehouseName = (id) => {
    const wh = warehouses.find((w) => w.id === id);
    return wh ? wh.name : `#${id}`;
  };

  const availableQty = (stock) =>
    stock.quantity - stock.committed_quantity - stock.damage_quantity;

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestor de stock</h2>
      <p className="text-slate-500">
        Controle las cantidades disponibles, comprometidas y dañadas por depósito y variación de producto.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={discardStock}
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
              {editingId ? "Actualizar Stock" : "Crear Stock"}
            </button>
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Detalles del stock</h2>

            {/* Fila 1: Depósito y Variación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Depósito
                </label>
                <select
                  name="warehouse_id"
                  value={form.warehouse_id}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                >
                  <option value="">Seleccionar depósito...</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} — {wh.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  ID Variación de producto
                </label>
                <input
                  name="product_variation_id"
                  value={form.product_variation_id}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  placeholder="Ej. 12"
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>
            </div>

            {/* Fila 2: Cantidades */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cantidad
                </label>
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Comprometida
                </label>
                <input
                  name="committed_quantity"
                  value={form.committed_quantity}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Dañada
                </label>
                <input
                  name="damage_quantity"
                  value={form.damage_quantity}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ordenada
                </label>
                <input
                  name="ordered_quantity"
                  value={form.ordered_quantity}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Stock mínimo
                </label>
                <input
                  name="safety_stock"
                  value={form.safety_stock}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de stock</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dep.</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Variación</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Disponible</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comprometida</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dañada</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ordenada</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mínimo</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Array.isArray(stocks) && stocks.length > 0 ? (
                  stocks.map((stock) => {
                    const available = availableQty(stock);
                    const isLow = available <= stock.safety_stock;
                    return (
                      <tr key={stock.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-4 text-sm text-slate-700 font-medium">{stock.id}</td>

                        {/* Depósito */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
                            #{stock.warehouse_id}
                          </span>
                        </td>

                        {/* Variación */}
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {stock.product_variation?.name || `#${stock.product_variation_id}`}
                            </p>
                            <p className="text-xs text-slate-400">
                              {stock.product_variation?.sku_variation}
                            </p>
                          </div>
                        </td>

                        {/* Disponible */}
                        <td className="px-4 py-4">
                          <span
                            className={`flex justify-center items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isLow
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {available}
                            {isLow && <CircleAlert size={13} />}
                          </span>
                        </td>

                        {/* Comprometida */}
                        <td className="px-4 py-4 text-sm text-slate-500 text-center">
                          {stock.committed_quantity}
                        </td>

                        {/* Dañada */}
                        <td className="px-4 py-4 text-sm text-slate-500 text-center">
                          {stock.damage_quantity > 0 ? (
                            <span className="text-orange-500 font-medium">{stock.damage_quantity}</span>
                          ) : (
                            stock.damage_quantity
                          )}
                        </td>

                        {/* Ordenada */}
                        <td className="px-4 py-4 text-sm text-slate-500 text-center">
                          {stock.ordered_quantity}
                        </td>

                        {/* Mínimo */}
                        <td className="px-4 py-4 text-sm text-slate-500 text-center">
                          {stock.safety_stock}
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleEdit(stock)}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                          >
                            <SquarePen size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        No hay stock disponible
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

      {pagination && (
        <div className="sticky bottom-0 w-full flex justify-between gap-4 mt-6 bg-white border border-gray-200 px-6 py-4 z-10">
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
              Mostrando {stocks.length} de {pagination.total} registros
            </span>
          </div>
        </div>
      )}
    </div>
  );
};