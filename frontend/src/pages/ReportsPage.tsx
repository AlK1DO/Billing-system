import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';
import { Download } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChartSkeleton, StatCardSkeleton } from '../components/ui/Skeleton';
import { reportService } from '../services/report.service';
import { formatCurrency, formatDate } from '../utils/format';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

type Tab = 'sales' | 'inventory' | 'customers';

export function ReportsPage() {
  const [tab, setTab] = useState<Tab>('sales');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: salesData, isLoading: loadingSales } = useQuery({
    queryKey: ['reports', 'sales', from, to],
    queryFn: () => reportService.getSalesReport({ from: from || undefined, to: to || undefined }),
    enabled: tab === 'sales',
  });

  const { data: inventoryData, isLoading: loadingInventory } = useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: () => reportService.getInventoryReport(),
    enabled: tab === 'inventory',
  });

  const { data: customerData, isLoading: loadingCustomers } = useQuery({
    queryKey: ['reports', 'customers'],
    queryFn: () => reportService.getCustomerReport(),
    enabled: tab === 'customers',
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'sales',     label: 'Ventas' },
    { key: 'inventory', label: 'Inventario' },
    { key: 'customers', label: 'Clientes' },
  ];

  const downloadCsv = (data: unknown[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0] as object);
    const rows = [
      keys.join(','),
      ...data.map((row) => keys.map((k) => JSON.stringify((row as Record<string, unknown>)[k] ?? '')).join(',')),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Reportes" subtitle="Análisis y estadísticas de tu negocio" />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Ventas ── */}
      {tab === 'sales' && (
        <div className="space-y-6">
          {/* Filtros de rango */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
            <Input
              label="Desde"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Input
              label="Hasta"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Button variant="secondary" size="sm" onClick={() => { setFrom(''); setTo(''); }}>
              Limpiar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download size={14} />}
              onClick={() => salesData?.byDay && downloadCsv(salesData.byDay, 'ventas-por-dia')}
            >
              Exportar CSV
            </Button>
          </div>

          {/* KPIs */}
          {loadingSales ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: 'Total ventas',      value: salesData?.summary?.totalSales ?? 0 },
                { label: 'Ingresos totales',  value: formatCurrency(salesData?.summary?.totalRevenue ?? 0) },
                { label: 'Ticket promedio',   value: formatCurrency(salesData?.summary?.averageTicket ?? 0) },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Gráfico ventas por día */}
          {loadingSales ? <ChartSkeleton height={260} /> : (
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">Ingresos por día</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={salesData?.byDay ?? []}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), 'Ingresos']} />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#salesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Grid: por vendedor + top productos */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Por vendedor */}
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">Ventas por vendedor</h3>
              {loadingSales ? <div className="h-48 animate-pulse rounded-lg bg-slate-100" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={salesData?.bySeller ?? []} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={80} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), 'Total']} />
                    <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top productos */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-3">
                <h3 className="text-sm font-semibold text-slate-800">Top 10 productos</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {(salesData?.topProducts ?? []).slice(0, 8).map((p: { id: string; name: string; quantity: number; total: number }, i: number) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.quantity} unidades</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(p.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Inventario ── */}
      {tab === 'inventory' && (
        <div className="space-y-6">
          {loadingInventory ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: 'Total productos',  value: inventoryData?.summary?.totalProducts ?? 0, sub: '' },
                  { label: 'Activos',          value: inventoryData?.summary?.activeProducts ?? 0, sub: '' },
                  { label: 'Valor del stock',  value: formatCurrency(inventoryData?.summary?.totalValue ?? 0), sub: 'precio venta' },
                  { label: 'Costo del stock',  value: formatCurrency(inventoryData?.summary?.totalCostValue ?? 0), sub: 'precio costo' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{s.value}</p>
                    {s.sub && <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Pie + tabla por categoría */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold text-slate-800">Productos por categoría</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={inventoryData?.byCategory ?? []} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {(inventoryData?.byCategory ?? []).map((_: unknown, i: number) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Productos con stock crítico */}
                <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-3">
                    <h3 className="text-sm font-semibold text-slate-800">Stock crítico</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[...(inventoryData?.outOfStock ?? []), ...(inventoryData?.lowStock ?? [])].slice(0, 8).map((p: { id: string; name: string; sku: string; stock: number; minStock: number }) => (
                      <div key={p.id} className="flex items-center gap-3 px-5 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{p.sku}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.stock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {p.stock} / {p.minStock}
                        </span>
                      </div>
                    ))}
                    {(inventoryData?.outOfStock?.length ?? 0) + (inventoryData?.lowStock?.length ?? 0) === 0 && (
                      <p className="px-5 py-8 text-center text-sm text-slate-400">✓ Sin alertas de stock</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Clientes ── */}
      {tab === 'customers' && (
        <div className="space-y-6">
          {loadingCustomers ? (
            <div className="grid grid-cols-2 gap-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { label: 'Total clientes', value: customerData?.summary?.total ?? 0 },
                  { label: 'Nuevos este mes', value: customerData?.summary?.newThisMonth ?? 0 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h3 className="text-sm font-semibold text-slate-800">Top 10 clientes por consumo</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    onClick={() => customerData?.topCustomers && downloadCsv(customerData.topCustomers, 'top-clientes')}
                  >
                    CSV
                  </Button>
                </div>
                <div className="divide-y divide-slate-50">
                  {(customerData?.topCustomers ?? []).map((c: { id: string; name: string; documentNumber: string; totalPurchased: number; lastPurchaseAt?: string }, i: number) => (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                        {i + 1}
                      </span>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600 text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">
                          {c.documentNumber}
                          {c.lastPurchaseAt && ` · Última compra: ${formatDate(c.lastPurchaseAt)}`}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-700">{formatCurrency(c.totalPurchased)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
