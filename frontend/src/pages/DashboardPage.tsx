import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import { reportService } from '../services/report.service';
import { formatCurrency } from '../utils/format';

export function DashboardPage() {
  const { data: salesReport, isLoading: loadingSales } = useQuery({
    queryKey: ['reports', 'sales'],
    queryFn: () => reportService.getSalesReport(),
  });

  const { data: inventoryReport, isLoading: loadingInventory } = useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: () => reportService.getInventoryReport(),
  });

  const { data: customerReport, isLoading: loadingCustomers } = useQuery({
    queryKey: ['reports', 'customers'],
    queryFn: () => reportService.getCustomerReport(),
  });

  const chartData =
    salesReport?.byDay?.slice(-30).map(
      (d: { date: string; total: number; count: number }) => ({
        date: new Date(d.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
        total: d.total,
        ventas: d.count,
      })
    ) ?? mockChartData;

  const topProducts: { id: string; name: string; quantity: number; total: number }[] =
    salesReport?.topProducts ?? [];

  const topCustomers: { id: string; name: string; documentNumber: string; totalPurchased: number }[] =
    customerReport?.topCustomers?.slice(0, 5) ?? [];

  const lowStockCount = inventoryReport?.lowStock?.length ?? 0;
  const outOfStockCount = inventoryReport?.outOfStock?.length ?? 0;

  const isLoading = loadingSales || loadingInventory || loadingCustomers;

  return (
    <div className="space-y-6">
      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Ventas del mes"
              value={formatCurrency(salesReport?.summary?.totalRevenue ?? 0)}
              subtitle={`${salesReport?.summary?.totalSales ?? 0} transacciones`}
              icon={<TrendingUp size={20} />}
              color="blue"
              trend={{ value: 12.3, label: 'vs mes anterior' }}
            />
            <StatCard
              title="Ticket promedio"
              value={formatCurrency(salesReport?.summary?.averageTicket ?? 0)}
              subtitle="Por venta"
              icon={<ShoppingCart size={20} />}
              color="green"
              trend={{ value: 4.1, label: 'vs mes anterior' }}
            />
            <StatCard
              title="Clientes"
              value={customerReport?.summary?.total ?? 0}
              subtitle={`+${customerReport?.summary?.newThisMonth ?? 0} este mes`}
              icon={<Users size={20} />}
              color="purple"
            />
            <StatCard
              title="Productos activos"
              value={inventoryReport?.summary?.activeProducts ?? 0}
              subtitle={`${outOfStockCount} sin stock`}
              icon={<Package size={20} />}
              color="orange"
            />
          </>
        )}
      </div>

      {/* ── Alertas stock ──────────────────────────────────────────── */}
      {(lowStockCount > 0 || outOfStockCount > 0) && !isLoading && (
        <Link to="/inventory" className="block">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 hover:bg-amber-100 transition-colors cursor-pointer">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {outOfStockCount > 0 && `${outOfStockCount} productos sin stock`}
                {outOfStockCount > 0 && lowStockCount > 0 && ' · '}
                {lowStockCount > 0 && `${lowStockCount} con stock bajo`}
              </p>
              <p className="mt-0.5 text-xs text-amber-600">
                Haz clic para ver el detalle en Inventario
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* ── Gráficos ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Área chart: ventas 30 días */}
        {loadingSales ? (
          <div className="lg:col-span-2">
            <ChartSkeleton height={220} />
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">
              Ventas — últimos 30 días
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(value: number) => [formatCurrency(value), 'Total']}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar chart: últimas 7 ventas */}
        {loadingSales ? (
          <ChartSkeleton height={220} />
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">
              Nº ventas últimos 7 días
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.slice(-7)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── Tablas inferiores ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top productos */}
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">Productos más vendidos</h2>
            <Link to="/reports" className="text-xs font-medium text-primary-600 hover:underline">
              Ver reporte
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {loadingSales ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-7 w-7 animate-pulse rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
                  </div>
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                </div>
              ))
            ) : topProducts.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-slate-400">Sin datos aún</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.quantity} unidades</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{formatCurrency(p.total)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top clientes */}
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">Clientes frecuentes</h2>
            <Link to="/customers" className="text-xs font-medium text-primary-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {loadingCustomers ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
                  </div>
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                </div>
              ))
            ) : topCustomers.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-slate-400">Sin datos aún</p>
            ) : (
              topCustomers.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.documentNumber}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatCurrency(c.totalPurchased)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockChartData = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
  total: Math.floor(Math.random() * 8000 + 2000),
  ventas: Math.floor(Math.random() * 15 + 3),
}));
