import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Search, X, ChevronDown, ChevronUp, Calendar, StickyNote } from "lucide-react";
import CustomerService from "../../services/customer.service";

export const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const fetchCustomers = async (p, l) => {
    setLoading(true);
    const customerService = new CustomerService();
    try {
      const response = await customerService.getCustomers(p, l);
      setCustomers(response?.data || response || []);
      setPagination(response?.pagination || null);
    } catch (error) {
      console.error("Error en fetchCustomers:", error);
      setCustomers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page, limit);
  }, [page, limit]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    const fullName = `${c.name || ""} ${c.last_name || ""}`.toLowerCase();
    return (
      fullName.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      String(c.phone || "").includes(q) ||
      String(c.id).includes(q)
    );
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField] ?? "";
    const valB = b[sortField] ?? "";
    const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <span className="inline-block w-3 ml-1 text-slate-300">↕</span>;
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="inline-block ml-1 text-indigo-500" />
    ) : (
      <ChevronDown size={14} className="inline-block ml-1 text-indigo-500" />
    );
  };

  const getInitials = (name = "", lastName = "") =>
    `${name[0] || ""}${lastName[0] || ""}`.toUpperCase() || "?";

  const avatarColors = [
    "bg-indigo-100 text-indigo-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-sky-100 text-sky-600",
  ];

  const getAvatarColor = (id) => avatarColors[Number(id) % avatarColors.length];

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Si ya es un objeto Date
    if (dateStr instanceof Date) return dateStr;
    // Intentar parseo directo
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    // Formato "YYYY-MM-DD HH:mm:ss" sin T (MySQL)
    const mysql = dateStr.toString().replace(" ", "T");
    const d2 = new Date(mysql);
    if (!isNaN(d2.getTime())) return d2;
    return null;
  };

  const formatDate = (dateStr) => {
    const d = parseDate(dateStr);
    if (!d) return "—";
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    const d = parseDate(dateStr);
    if (!d) return "—";
    return d.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <p className="text-slate-500">Gestioná y visualizá todos los clientes registrados.</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total clientes", value: pagination?.total ?? customers.length, icon: <User size={18} />,     color: "text-indigo-600 bg-indigo-50"   },
          { label: "Página actual",  value: pagination ? `${pagination.page} / ${pagination.totalPages}` : "1 / 1", icon: <MapPin size={18} />, color: "text-purple-600 bg-purple-50"   },
          { label: "Mostrando",      value: customers.length,                      icon: <Mail size={18} />,     color: "text-emerald-600 bg-emerald-50" },
          { label: "Por página",     value: limit,                                 icon: <StickyNote size={18} />,    color: "text-amber-600 bg-amber-50"     },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className="text-lg font-bold text-slate-700">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm">

        {/* Card header + search */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold">Listado de clientes</h3>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-8"></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer select-none hover:text-indigo-600 transition" onClick={() => handleSort("id")}>
                  ID <SortIcon field="id" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer select-none hover:text-indigo-600 transition" onClick={() => handleSort("name")}>
                  Nombre <SortIcon field="name" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer select-none hover:text-indigo-600 transition" onClick={() => handleSort("email")}>
                  Email <SortIcon field="email" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Teléfono
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Dirección
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer select-none hover:text-indigo-600 transition" onClick={() => handleSort("createdAt")}>
                  Registro <SortIcon field="createdAt" />
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                      <span className="text-sm">Cargando clientes...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedCustomers.length > 0 ? (
                sortedCustomers.map((customer) => {
                  const isExpanded = expandedCustomerId === customer.id;
                  return (
                    <React.Fragment key={customer.id}>
                      <tr
                        className={`hover:bg-slate-50 transition cursor-pointer ${
                          isExpanded ? "bg-indigo-50 border-l-4 border-indigo-400" : ""
                        }`}
                        onClick={() => setExpandedCustomerId(isExpanded ? null : customer.id)}
                      >
                        <td className="px-4 py-4">
                          <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-400 transition">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">{customer.id}</td>

                        {/* Avatar + full name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(customer.id)}`}>
                              {getInitials(customer.name, customer.last_name)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {customer.name || "—"} {customer.last_name || ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {customer.email ? (
                            <a
                              href={`mailto:${customer.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-indigo-600 transition"
                            >
                              {customer.email}
                            </a>
                          ) : "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {customer.phone || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500 max-w-[180px] truncate" title={customer.address || ""}>
                          {customer.address || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-300" />
                            {formatDate(customer.createdAt)}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr key={`detail-${customer.id}`}>
                          <td colSpan={7} className="px-0 py-0">
                            <div className="bg-slate-50 border-t border-slate-100 px-12 py-5">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-4">
                                Detalle del cliente
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                  { label: "ID",          value: customer.id,                         icon: <User size={14} />     },
                                  { label: "Nombre",      value: customer.name || "—",                icon: <User size={14} />     },
                                  { label: "Apellido",    value: customer.last_name || "—",           icon: <User size={14} />     },
                                  { label: "Email",       value: customer.email || "—",               icon: <Mail size={14} />     },
                                  { label: "Teléfono",    value: customer.phone || "—",               icon: <Phone size={14} />    },
                                  { label: "Dirección",   value: customer.address || "—",             icon: <MapPin size={14} />   },
                                  { label: "Creado el",   value: formatDateTime(customer.createdAt), icon: <Calendar size={14} /> },
                                  { label: "Actualizado", value: formatDateTime(customer.updatedAt),  icon: <Calendar size={14} /> },
                                ].map((item) => (
                                  <div key={item.label} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                      {item.icon}
                                      <span>{item.label}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 break-all">
                                      {item.value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    {search ? `Sin resultados para "${search}"` : "No hay clientes registrados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="sticky bottom-0 w-full flex justify-between gap-4 bg-white border-t border-gray-200 px-6 py-4 z-10">
            <div className="flex flex-row gap-3 items-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition"
              >
                Anterior
              </button>

              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-2 text-slate-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-9 h-9 rounded text-sm font-semibold transition ${
                          page === item
                            ? "bg-[#6366f1] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

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
                Mostrando {customers.length} de {pagination.total} clientes
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};