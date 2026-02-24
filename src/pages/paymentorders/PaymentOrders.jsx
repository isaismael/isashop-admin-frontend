import {
  ShoppingBag,
  Frown,
  Eye,
  X,
  ChevronDown,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Store,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import OrderService from "../../services/order.service";

const orderService = new OrderService();

const STATUS_CONFIG = {
  pagado: {
    label: "Pagado",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle2 size={13} />,
  },
  pendiente: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock size={13} />,
  },
  rechazado: {
    label: "Rechazado",
    color: "bg-red-100 text-red-700",
    icon: <XCircle size={13} />,
  },
  enviado: {
    label: "Enviado",
    color: "bg-blue-100 text-blue-700",
    icon: <Truck size={13} />,
  },
  entregado: {
    label: "Entregado",
    color: "bg-indigo-100 text-indigo-700",
    icon: <Package size={13} />,
  },
  "listo para retirar": {
    label: "Listo para retirar",
    color: "bg-orange-100 text-orange-700",
    icon: <Store size={13} />,
  },
};

// Estados disponibles según el tipo de orden
const DELIVERY_STATUS_OPTIONS = ["pagado", "pendiente", "rechazado", "enviado", "entregado"];
const PICKUP_STATUS_OPTIONS = ["pagado", "pendiente", "rechazado", "listo para retirar", "entregado"];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  return `$${Number(amount || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
  })}`;
};

// ── Modal de detalle de orden ─────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isPickup = order.is_pickup;
  const statusOptions = isPickup ? PICKUP_STATUS_OPTIONS : DELIVERY_STATUS_OPTIONS;

  const handleSave = async () => {
    if (status === order.status) return onClose();
    setSaving(true);
    try {
      await orderService.updateOrder(order.id, { status });
      onStatusChange(order.id, status);
      onClose();
    } catch (err) {
      console.error("Error actualizando estado:", err);
    } finally {
      setSaving(false);
    }
  };

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.pendiente;
  const customer = order.customer;
  const address = order.shipping_adress;
  const pickupAddress = order.pickup_address;
  const items = order.order_items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Orden #{order.id}</h2>
                {/* Badge tipo de entrega */}
                {isPickup ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    <Store size={11} /> Retiro en local
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    <Truck size={11} /> Envío a domicilio
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.order_date)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Cliente */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cliente</p>
            <p className="text-sm font-semibold text-slate-800">
              {customer?.name} {customer?.last_name}
            </p>
            <p className="text-xs text-slate-500">{customer?.email}</p>
          </div>

          {/* Dirección: diferente según pickup o delivery */}
          {isPickup ? (
            pickupAddress && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Store size={12} /> Punto de retiro
                </p>
                <p className="text-sm font-semibold text-slate-800">{pickupAddress.name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} /> {pickupAddress.address}
                </p>
              </div>
            )
          ) : (
            address && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin size={12} /> Dirección de envío
                </p>
                <p className="text-sm text-slate-700">
                  {address.street} {address.street_number}, {address.city},{" "}
                  {address.province?.name || address.province} (CP {address.zip_code})
                </p>
              </div>
            )
          )}

          {/* Items */}
          {items.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Productos ({items.length})
              </p>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.product_variation?.product?.name ?? "Producto"}
                      </p>
                      <p className="text-xs text-slate-400">
                        x{item.quantity} · {formatCurrency(item.unit_price)} c/u
                        {Number(item.discount) > 0 && (
                          <span className="ml-2 text-green-600">
                            − {formatCurrency(item.discount)} descuento
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desglose del total */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal productos</span>
              <span>{formatCurrency(items.reduce((acc, i) => acc + Number(i.unit_price) * i.quantity, 0))}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Envío</span>
              {isPickup ? (
                <span className="text-green-600 font-semibold">Gratis</span>
              ) : (
                <span>
                  {formatCurrency(
                    Number(order.total_amount) -
                    items.reduce((acc, i) => acc + Number(i.unit_price) * i.quantity, 0)
                  )}
                </span>
              )}
            </div>
            <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Método de pago */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Método de pago</span>
            <span className="font-semibold text-slate-700">{order.payment_method?.name ?? "—"}</span>
          </div>

          {/* Cambiar estado */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Estado de la orden
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-[#6366f1] transition"
              >
                <span className="flex items-center gap-2">
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
                <ChevronDown size={16} />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {statusOptions.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setStatus(s); setShowDropdown(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition text-left ${
                          status === s ? "bg-indigo-50 text-indigo-700" : "text-slate-700"
                        }`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {isPickup
                ? "Los estados disponibles son para órdenes de retiro en local."
                : "Los estados disponibles son para órdenes con envío a domicilio."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#6366f1] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
export const PaymentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all"); // "all" | "pickup" | "delivery"
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (p, l) => {
    setLoading(true);
    try {
      const response = await orderService.getOrders(p, l);
      setOrders(response?.data || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error("Error en getOrders:", error.message);
      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, limit);
  }, [page, limit]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const allStatuses = [...new Set([...DELIVERY_STATUS_OPTIONS, ...PICKUP_STATUS_OPTIONS])];

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchType =
      filterType === "all" ||
      (filterType === "pickup" && o.is_pickup) ||
      (filterType === "delivery" && !o.is_pickup);
    return matchStatus && matchType;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestión de órdenes</h2>
      <p className="text-slate-500">
        Visualizá y administrá todos los pedidos realizados por los clientes.
      </p>

      {/* Filtros tipo de entrega */}
      <div className="flex gap-2 mt-5 mb-3">
        {[
          { key: "all", label: "Todos", icon: null },
          { key: "delivery", label: "Envíos", icon: <Truck size={13} /> },
          { key: "pickup", label: "Retiros", icon: <Store size={13} /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === key
                ? "bg-[#6366f1] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filterStatus === "all"
              ? "bg-[#6366f1] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Todos los estados
        </button>
        {allStatuses.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === s
                  ? "bg-[#6366f1] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cfg.icon}
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
        <h2 className="text-lg font-semibold mb-6">Listado de órdenes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                {["ID", "Cliente", "Tipo", "Fecha", "Total", "Estado", "Acción"].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400 text-sm">
                    Cargando órdenes...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        #{order.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0 text-xs font-bold">
                            {order.customer?.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {order.customer?.name} {order.customer?.last_name}
                            </p>
                            <p className="text-xs text-slate-400">{order.customer?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Columna tipo de entrega */}
                      <td className="px-6 py-4">
                        {order.is_pickup ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            <Store size={11} /> Retiro
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            <Truck size={11} /> Envío
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(order.order_date)}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {formatCurrency(order.total_amount)}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      No hay órdenes disponibles
                      <Frown size={18} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
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
              Mostrando {filtered.length} de {pagination.total} órdenes
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};