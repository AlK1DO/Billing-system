import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Eye, Printer, ShoppingCart, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { saleService } from '../services/sale.service';
import { Sale } from '../types';
import { formatCurrency, formatDateTime } from '../utils/format';
import { printReceipt } from '../utils/pdf';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  completed: { label: 'Completada', variant: 'success' },
  pending:   { label: 'Pendiente',  variant: 'warning' },
  cancelled: { label: 'Cancelada',  variant: 'danger' },
};

export function SalesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [detailSale, setDetailSale] = useState<Sale | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Sale | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['sales', { status, page }],
    queryFn: () =>
      saleService.getAll({
        status: status || undefined,
        page,
        limit: 20,
      }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => saleService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Venta cancelada', 'El stock fue restaurado automáticamente.');
      setCancelTarget(null);
      setDetailSale(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al cancelar la venta';
      toast.error('Error', msg);
    },
  });

  const filtered = search
    ? (data?.data ?? []).filter(
        (s) =>
          s.customerName.toLowerCase().includes(search.toLowerCase()) ||
          s.receiptNumber.toLowerCase().includes(search.toLowerCase())
      )
    : (data?.data ?? []);

  const isEmpty = !isLoading && filtered.length === 0;

  const columns = [
    {
      key: 'receiptNumber',
      header: 'Comprobante',
      render: (s: Sale) => (
        <span className="font-mono text-xs font-semibold text-primary-600">{s.receiptNumber}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Cliente',
      render: (s: Sale) => (
        <div>
          <p className="font-medium text-slate-800">{s.customerName}</p>
          <p className="text-xs text-slate-400">{s.customerDocument}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Ítems',
      render: (s: Sale) => (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {s.items.length}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (s: Sale) => (
        <span className="font-semibold text-slate-800">{formatCurrency(s.total)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (s: Sale) => {
        const cfg = statusConfig[s.status] ?? { label: s.status, variant: 'neutral' as const };
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (s: Sale) => (
        <span className="text-xs text-slate-500">{formatDateTime(s.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (s: Sale) => (
        <div className="flex items-center gap-1">
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Ver detalle"
            onClick={() => setDetailSale(s)}
          >
            <Eye size={14} />
          </button>
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Imprimir comprobante"
            onClick={() => printReceipt(s, 'Mi Empresa')}
          >
            <Printer size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ventas"
        subtitle="Historial de transacciones"
        actions={
          <Link to="/sales/new">
            <Button leftIcon={<Plus size={16} />}>Nueva venta</Button>
          </Link>
        }
      />

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Buscar por cliente o comprobante..."
            leftIcon={<Search size={15} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: '',          label: 'Todos los estados' },
            { value: 'completed', label: 'Completadas' },
            { value: 'pending',   label: 'Pendientes' },
            { value: 'cancelled', label: 'Canceladas' },
          ]}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="w-44"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : isEmpty ? (
        <EmptyState
          icon={<ShoppingCart size={28} />}
          title="Sin ventas"
          description="Registra tu primera venta para comenzar."
          action={
            <Link to="/sales/new">
              <Button size="sm" leftIcon={<Plus size={14} />}>Nueva venta</Button>
            </Link>
          }
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(s) => s.id}
            loading={false}
            emptyMessage="No se encontraron ventas"
          />

          {data && data.meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{data.meta.total} ventas en total</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={!data.meta.hasPrevPage} onClick={() => setPage((p) => p - 1)}>
                  Anterior
                </Button>
                <Button variant="secondary" size="sm" disabled={!data.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal detalle de venta */}
      <Modal
        open={!!detailSale}
        onClose={() => setDetailSale(null)}
        title={`Venta ${detailSale?.receiptNumber ?? ''}`}
        size="lg"
      >
        {detailSale && (
          <div className="space-y-5">
            {/* Info general */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Cliente', detailSale.customerName],
                ['Documento', detailSale.customerDocument],
                ['Vendedor', detailSale.sellerName],
                ['Fecha', formatDateTime(detailSale.createdAt)],
              ].map(([label, val]) => (
                <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800 truncate">{val}</p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="overflow-hidden rounded-lg border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Producto</th>
                    <th className="px-3 py-2 text-center">Cant.</th>
                    <th className="px-3 py-2 text-right">Precio</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detailSale.items.map((item) => (
                    <tr key={item.productId} className="border-t border-slate-50">
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-slate-800">{item.productName}</p>
                        <p className="text-xs text-slate-400">{item.productSku}</p>
                      </td>
                      <td className="px-3 py-2.5 text-center text-slate-600">{item.quantity}</td>
                      <td className="px-3 py-2.5 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-slate-800">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex flex-col items-end gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div className="flex w-52 justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(detailSale.subtotal)}</span>
              </div>
              <div className="flex w-52 justify-between text-slate-600">
                <span>IGV (18%)</span>
                <span>{formatCurrency(detailSale.igv)}</span>
              </div>
              <div className="flex w-52 justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(detailSale.total)}</span>
              </div>
            </div>

            {detailSale.notes && (
              <p className="text-xs text-slate-500"><strong>Notas:</strong> {detailSale.notes}</p>
            )}

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => setDetailSale(null)}>
                Cerrar
              </Button>
              <Button leftIcon={<Printer size={15} />} onClick={() => printReceipt(detailSale, 'Mi Empresa')}>
                Imprimir comprobante
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
