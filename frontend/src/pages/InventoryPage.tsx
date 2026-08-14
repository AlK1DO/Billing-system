import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, TrendingUp, TrendingDown, RefreshCcw, Settings2, Plus } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, StatCardSkeleton } from '../components/ui/Skeleton';
import { reportService } from '../services/report.service';
import { inventoryService, CreateMovementPayload } from '../services/inventory.service';
import { InventoryMovement, Product } from '../types';
import { formatDateTime } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import api from '../services/api';

const movementConfig: Record<string, { label: string; color: 'success' | 'info' | 'warning' | 'neutral'; icon: React.ReactNode }> = {
  entry:      { label: 'Entrada',    color: 'success', icon: <TrendingUp size={12} /> },
  sale:       { label: 'Venta',      color: 'info',    icon: <TrendingDown size={12} /> },
  return:     { label: 'Devolución', color: 'warning', icon: <RefreshCcw size={12} /> },
  adjustment: { label: 'Ajuste',     color: 'neutral', icon: <Settings2 size={12} /> },
};

const adjustSchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  type:      z.enum(['entry', 'return', 'adjustment']),
  quantity:  z.coerce.number().int().positive('No puede ser 0'),
  reason:    z.string().optional(),
});
type AdjustForm = z.infer<typeof adjustSchema>;

export function InventoryPage() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [adjustOpen, setAdjustOpen] = useState(false);

  const { data: inventoryReport, isLoading: loadingReport } = useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: () => reportService.getInventoryReport(),
  });

  const { data: movements, isLoading: loadingMovements } = useQuery({
    queryKey: ['inventory-movements', { typeFilter, page }],
    queryFn: () =>
      inventoryService.getMovements({ type: typeFilter || undefined, page, limit: 20 }),
  });

  // Productos para el select del formulario
  const { data: productsData } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => api.get('/products?limit=100').then((r) => r.data.data as Product[]),
    enabled: adjustOpen,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustForm>({
    resolver: zodResolver(adjustSchema),
    defaultValues: { productId: '', type: 'entry', quantity: 1, reason: '' },
  });

  const adjustMutation = useMutation({
    mutationFn: (data: AdjustForm) =>
      inventoryService.createMovement(data as CreateMovementPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'inventory'] });
      toast.success('Movimiento registrado', 'El stock fue actualizado correctamente.');
      setAdjustOpen(false);
      reset();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al registrar movimiento';
      toast.error('Error', msg);
    },
  });

  const columns = [
    {
      key: 'product',
      header: 'Producto',
      render: (m: InventoryMovement) => (
        <div className="flex items-center gap-2">
          <Package size={14} className="shrink-0 text-slate-400" />
          <div>
            <p className="font-medium text-slate-800">{m.productName}</p>
            <p className="text-xs text-slate-400 font-mono">{m.productSku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (m: InventoryMovement) => {
        const cfg = movementConfig[m.type] ?? { label: m.type, color: 'neutral' as const, icon: null };
        return (
          <Badge variant={cfg.color}>
            <span className="mr-1 inline-flex items-center">{cfg.icon}</span>
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: 'quantity',
      header: 'Cantidad',
      render: (m: InventoryMovement) => (
        <span
          className={
            m.quantity > 0
              ? 'font-semibold text-emerald-600'
              : 'font-semibold text-rose-600'
          }
        >
          {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (m: InventoryMovement) => (
        <span className="text-sm text-slate-600">
          {m.previousStock}
          <span className="mx-1.5 text-slate-300">→</span>
          <strong className="text-slate-900">{m.currentStock}</strong>
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Motivo',
      render: (m: InventoryMovement) => (
        <span className="text-xs text-slate-500">{m.reason || '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (m: InventoryMovement) => (
        <span className="text-xs text-slate-400">{formatDateTime(m.createdAt)}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Inventario"
        subtitle="Control de stock y movimientos"
        actions={
          user?.role === 'admin' && (
            <Button leftIcon={<Plus size={16} />} onClick={() => setAdjustOpen(true)}>
              Registrar movimiento
            </Button>
          )
        }
      />

      {/* KPI cards de alertas */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loadingReport ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Productos activos</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{inventoryReport?.summary?.activeProducts ?? 0}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valor del stock</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                S/ {((inventoryReport?.summary?.totalValue ?? 0) / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Stock bajo</p>
              <p className="mt-2 text-2xl font-bold text-amber-800">{inventoryReport?.lowStock?.length ?? 0}</p>
              <p className="mt-0.5 text-xs text-amber-600">productos por reponer</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Sin stock</p>
              <p className="mt-2 text-2xl font-bold text-rose-800">{inventoryReport?.outOfStock?.length ?? 0}</p>
              <p className="mt-0.5 text-xs text-rose-600">productos agotados</p>
            </div>
          </>
        )}
      </div>

      {/* Productos con stock crítico */}
      {(inventoryReport?.lowStock?.length > 0 || inventoryReport?.outOfStock?.length > 0) && (
        <div className="mb-6 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-semibold text-slate-800">Productos que requieren atención</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[...inventoryReport.outOfStock, ...inventoryReport.lowStock]
              .slice(0, 5)
              .map((p: Product) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <Package size={14} className="text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">SKU: {p.sku}</p>
                  </div>
                  <Badge variant={p.stock === 0 ? 'danger' : 'warning'}>
                    Stock: {p.stock} / mín. {p.minStock}
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filtro y tabla de movimientos */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Movimientos recientes</h2>
        <Select
          options={[
            { value: '',           label: 'Todos los tipos' },
            { value: 'entry',      label: 'Entradas' },
            { value: 'sale',       label: 'Ventas' },
            { value: 'return',     label: 'Devoluciones' },
            { value: 'adjustment', label: 'Ajustes' },
          ]}
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="w-40"
        />
      </div>

      {loadingMovements ? (
        <TableSkeleton rows={8} cols={6} />
      ) : (
        <>
          <Table
            columns={columns}
            data={movements?.data ?? []}
            keyExtractor={(m) => m.id}
            loading={false}
            emptyMessage="No hay movimientos registrados"
          />
          {movements && movements.meta.totalPages > 1 && (
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" size="sm" disabled={!movements.meta.hasPrevPage} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
              <Button variant="secondary" size="sm" disabled={!movements.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
            </div>
          )}
        </>
      )}

      {/* Modal ajuste de stock */}
      <Modal open={adjustOpen} onClose={() => { setAdjustOpen(false); reset(); }} title="Registrar movimiento de inventario">
        <form onSubmit={handleSubmit((d) => adjustMutation.mutate(d))} className="space-y-4" noValidate>
          <Select
            label="Producto"
            placeholder="Seleccionar producto"
            options={(productsData ?? []).map((p) => ({ value: p.id, label: `${p.name} (Stock: ${p.stock})` }))}
            error={errors.productId?.message}
            {...register('productId')}
          />
          <Select
            label="Tipo de movimiento"
            options={[
              { value: 'entry',      label: 'Entrada de stock' },
              { value: 'return',     label: 'Devolución' },
              { value: 'adjustment', label: 'Ajuste manual' },
            ]}
            error={errors.type?.message}
            {...register('type')}
          />
          <Input
            label="Cantidad (negativo para reducir)"
            type="number"
            placeholder="10"
            error={errors.quantity?.message}
            {...register('quantity')}
          />
          <Input
            label="Motivo (opcional)"
            placeholder="Ej: Compra a proveedor, corrección de conteo..."
            error={errors.reason?.message}
            {...register('reason')}
          />
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="secondary" onClick={() => { setAdjustOpen(false); reset(); }}>
              Cancelar
            </Button>
            <Button type="submit" loading={adjustMutation.isPending}>
              Registrar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
