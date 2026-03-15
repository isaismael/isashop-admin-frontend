import {
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Truck,
  DollarSign,
  AlertTriangle,
  BadgePercent,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  CreditCard,
  CircleDollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { useAuth } from "../../hooks/useAuth";

const summaryCards = [
  {
    title: "Ventas del mes",
    value: "$ 4.850.000",
    change: "+12.4%",
    trend: "up",
    icon: CircleDollarSign,
    hint: "vs. mes anterior",
  },
  {
    title: "Pedidos totales",
    value: "1.284",
    change: "+8.1%",
    trend: "up",
    icon: ShoppingCart,
    hint: "112 en proceso",
  },
  {
    title: "Clientes activos",
    value: "892",
    change: "+5.6%",
    trend: "up",
    icon: Users,
    hint: "63 nuevos esta semana",
  },
  {
    title: "Productos activos",
    value: "346",
    change: "-1.9%",
    trend: "down",
    icon: Package,
    hint: "18 sin stock crítico",
  },
];

const salesData = [
  { name: "Ene", ventas: 1200000 },
  { name: "Feb", ventas: 1850000 },
  { name: "Mar", ventas: 1420000 },
  { name: "Abr", ventas: 2240000 },
  { name: "May", ventas: 1980000 },
  { name: "Jun", ventas: 2720000 },
  { name: "Jul", ventas: 3180000 },
];

const categoryData = [
  { name: "Mangas", total: 124 },
  { name: "Remeras", total: 92 },
  { name: "Comics", total: 68 },
  { name: "Figuras", total: 44 },
  { name: "Buzos", total: 36 },
];

const recentOrders = [
  {
    id: "#ISA-1024",
    customer: "María Gómez",
    payment: "Mercado Pago",
    status: "Pagado",
    total: "$ 84.500",
  },
  {
    id: "#ISA-1023",
    customer: "Carlos Ruiz",
    payment: "Mercado Pago",
    status: "Preparando",
    total: "$ 42.300",
  },
  {
    id: "#ISA-1022",
    customer: "Lucía Fernández",
    payment: "Mercado Pago",
    status: "Enviado",
    total: "$ 125.990",
  },
  {
    id: "#ISA-1021",
    customer: "Nicolás Pérez",
    payment: "Mercado Pago",
    status: "Pendiente",
    total: "$ 19.000",
  },
];

const stockAlerts = [
  {
    name: "Nike Air Max 270",
    sku: "NK-AM270-BLK-42",
    stock: 2,
    warehouse: "Depósito Central",
  },
  {
    name: "Buzo Oversize Essentials",
    sku: "BZ-ESS-GRY-L",
    stock: 4,
    warehouse: "Sucursal Norte",
  },
  {
    name: "Gorra New Era Classic",
    sku: "GR-NE-BLK-U",
    stock: 1,
    warehouse: "Depósito Central",
  },
];

const quickStats = [
  {
    label: "Marcas registradas",
    value: "38",
    icon: BadgePercent,
  },
  {
    label: "Almacenes activos",
    value: "4",
    icon: Warehouse,
  },
  {
    label: "Envíos pendientes",
    value: "27",
    icon: Truck,
  },
  {
    label: "Métodos de pago",
    value: "5",
    icon: CreditCard,
  },
];

const topMetrics = [
  {
    title: "Ticket promedio",
    value: "$ 37.774",
    description: "Promedio por pedido confirmado",
  },
  {
    title: "Conversión estimada",
    value: "3.8%",
    description: "Pedidos / visitas del storefront",
  },
  {
    title: "Productos con descuento",
    value: "74",
    description: "Variantes con promoción activa",
  },
];

const statusStyles = {
  Pagado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Preparando: "bg-amber-100 text-amber-700 border-amber-200",
  Enviado: "bg-sky-100 text-sky-700 border-sky-200",
  Pendiente: "bg-rose-100 text-rose-700 border-rose-200",
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
};

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 bg-slate-100 min-h-screen">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Dashboard
          </h2>
          <p className="text-slate-500">
            Visualizá el rendimiento general de tu tienda en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600">
            <Eye size={18} className="mr-2" />
            Ver tienda
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-3xl font-bold text-slate-950">
              Bienvenido, {" "}
              <strong className="text-indigo-600 underline decoration-2 underline-offset-4">
                {user?.email}
              </strong>
            </p>
            <p className="mt-2 text-lg text-slate-500">
              Administrá su tienda y supervisá productos, pedidos, clientes e
              inventario desde un solo lugar.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
              Resumen rápido
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-950">+18.7%</p>
            <p className="text-sm text-slate-500">
              crecimiento en ventas durante los últimos 30 días
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Role: {user?.roles?.join(", ") || "Sin rol"}
          </span>

          {user?.permissions?.map((permission) => (
            <span
              key={permission}
              className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {permission}
            </span>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isUp = card.trend === "up";

          return (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-950">
                    {card.value}
                  </h3>
                </div>
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${isUp
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                    }`}
                >
                  {isUp ? (
                    <ArrowUpRight size={14} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="mr-1" />
                  )}
                  {card.change}
                </span>
                <span className="text-xs text-slate-400">{card.hint}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Resumen de ventas</h2>
              <p className="text-sm text-slate-500">
                Evolución mensual de los pedidos confirmados.
              </p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              +14.2% este trimestre
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => `$${value / 1000000}M`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">Estado general</h2>
            <p className="text-sm text-slate-500">
              Indicadores vinculados a tus tablas principales.
            </p>
          </div>

          <div className="space-y-4">
            {quickStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{item.label}</p>
                      <p className="text-lg font-bold text-slate-950">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-amber-600">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Atención de inventario</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Tenés 3 variantes con stock crítico y 1 almacén con alta rotación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Top categorías</h2>
              <p className="text-sm text-slate-500">
                Productos activos por categoría.
              </p>
            </div>
            <div className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              Catálogo
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <Bar dataKey="total" radius={[0, 10, 10, 0]} fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Pedidos recientes</h2>
              <p className="text-sm text-slate-500">
                Últimos movimientos registrados en order y order_item.
              </p>
            </div>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Ver todos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="px-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Pedido
                  </th>
                  <th className="px-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Cliente
                  </th>
                  <th className="px-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Pago
                  </th>
                  <th className="px-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Estado
                  </th>
                  <th className="px-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="rounded-2xl bg-slate-50">
                    <td className="rounded-l-2xl px-4 py-4 text-sm font-semibold text-slate-950">
                      {order.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{order.customer}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{order.payment}</td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="rounded-r-2xl px-4 py-4 text-right text-sm font-bold text-slate-950">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Alertas de stock</h2>
              <p className="text-sm text-slate-500">
                Variantes detectadas desde stock + product_variation + warehouse.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              3 críticas
            </div>
          </div>

          <div className="space-y-3">
            {stockAlerts.map((item) => (
              <div
                key={item.sku}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2 text-rose-600 shadow-sm">
                    <Boxes size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">SKU: {item.sku}</p>
                    <p className="text-sm text-slate-500">Almacén: {item.warehouse}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    Stock: {item.stock}
                  </span>
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    Reponer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 xl:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">KPIs comerciales</h2>
            <p className="mt-1 text-sm text-slate-500">
              Métricas recomendadas para product, order y customer.
            </p>

            <div className="mt-5 space-y-4">
              {topMetrics.map((metric) => (
                <div
                  key={metric.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{metric.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Panel inteligente</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Próximamente podés conectar métricas reales desde tu backend.
                </p>
              </div>
              <DollarSign className="text-indigo-300" size={22} />
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">Sugerencia</p>
              <p className="mt-1 font-semibold">
                Creá un endpoint /dashboard/summary para centralizar KPIs, gráficos y alertas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
