import { Save, Trash, SquarePen, Frown, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import PaymentMethodsService from "../../services/paymentmethods.service";

export const PaymentMethods = () => {
  const initialForm = {
    name: "",
    active: 1,
  };

  const [form, setForm] = useState(initialForm);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
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

  const discardPaymentMethod = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getPaymentMethods = async (page, limit) => {
    try {
      const service = new PaymentMethodsService();
      const response = await service.getPaymentMethods(page, limit);
      setPaymentMethods(response?.data || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error("Error en getPaymentMethods:", error.message);
      setPaymentMethods([]);
      setPagination(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const service = new PaymentMethodsService();
      if (editingId) {
        await service.updatePaymentMethod(editingId, form);
        alert("Método de pago actualizado correctamente");
      } else {
        await service.createPaymentMethod(form);
        alert("Método de pago creado correctamente");
      }
      discardPaymentMethod();
      getPaymentMethods(page, limit);
    } catch (error) {
      console.error("Error al guardar método de pago:", error);
    }
  };

  const handleEdit = (method) => {
    setForm({
      name: method.name,
      active: method.active,
    });
    setEditingId(method.id);
  };

  useEffect(() => {
    getPaymentMethods(page, limit);
  }, [page, limit]);

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestor de métodos de pago</h2>
      <p className="text-slate-500">
        Administre los métodos de pago disponibles para los clientes al momento de realizar sus compras.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={discardPaymentMethod}
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
              {editingId ? "Actualizar Método" : "Crear Método"}
            </button>
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-6">
                Detalles del método de pago
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nombre del método de pago
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ej. Tarjeta de crédito, Transferencia, etc."
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de métodos de pago</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Array.isArray(paymentMethods) && paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <tr
                      key={method.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {method.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <CreditCard size={16} />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            {method.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            method.active === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {method.active === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(method)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        >
                          <SquarePen size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        No hay métodos de pago disponibles
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
              Mostrando {paymentMethods.length} de {pagination.total} métodos de pago
            </span>
          </div>
        </div>
      )}
    </div>
  );
};