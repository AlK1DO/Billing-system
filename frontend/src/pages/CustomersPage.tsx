import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TableSkeleton } from '../components/ui/Skeleton';
import { CustomerForm, CustomerFormValues } from '../components/customers/CustomerForm';
import { customerService } from '../services/customer.service';
import { Customer } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export function CustomersPage() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', { search, page }],
    queryFn: () => customerService.getAll({ search: search || undefined, page, limit: 20 }),
  });

  const createMutation = useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente creado', 'El cliente fue agregado a tu cartera.');
      setFormOpen(false);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al crear el cliente';
      toast.error('Error', msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente actualizado');
      setEditCustomer(null);
      setFormOpen(false);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al actualizar';
      toast.error('Error', msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente eliminado');
      setDeleteTarget(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al eliminar';
      toast.error('Error', msg);
    },
  });

  const handleSubmit = (values: CustomerFormValues) => {
    if (editCustomer) {
      updateMutation.mutate({ id: editCustomer.id, data: values });
    } else {
      createMutation.mutate(values as Parameters<typeof customerService.create>[0]);
    }
  };

  const openEdit = (c: Customer) => {
    setEditCustomer(c);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditCustomer(null);
  };

  const columns = [
    {
      key: 'name',
      header: 'Cliente',
      render: (c: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800">{c.name}</p>
            <p className="text-xs text-slate-400">{c.email || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'document',
      header: 'Documento',
      render: (c: Customer) => (
        <div className="flex items-center gap-2">
          <Badge variant="neutral">{c.documentType}</Badge>
          <span className="text-slate-700">{c.documentNumber}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Teléfono',
      render: (c: Customer) => <span className="text-slate-600">{c.phone || '—'}</span>,
    },
    {
      key: 'totalPurchased',
      header: 'Total comprado',
      render: (c: Customer) => (
        <span className="font-medium text-slate-800">{formatCurrency(c.totalPurchased)}</span>
      ),
    },
    {
      key: 'lastPurchaseAt',
      header: 'Última compra',
      render: (c: Customer) => (
        <span className="text-xs text-slate-500">
          {c.lastPurchaseAt ? formatDate(c.lastPurchaseAt) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (c: Customer) => (
        <div className="flex items-center gap-1">
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Editar"
            onClick={() => openEdit(c)}
          >
            <Pencil size={14} />
          </button>
          {user?.role === 'admin' && (
            <button
              className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
              title="Eliminar"
              onClick={() => setDeleteTarget(c)}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const isEmpty = !isLoading && (data?.data ?? []).length === 0;

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Gestiona tu cartera de clientes"
        actions={
          <Button leftIcon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
            Nuevo cliente
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Buscar por nombre, documento o correo..."
          leftIcon={<Search size={15} />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : isEmpty ? (
        <EmptyState
          icon={<Users size={28} />}
          title="Sin clientes"
          description="Agrega tu primer cliente para comenzar a registrar ventas."
          action={{ label: 'Nuevo cliente', onClick: () => setFormOpen(true), icon: <Plus size={14} /> }}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(c) => c.id}
            loading={false}
            emptyMessage="No se encontraron clientes"
          />

          {data && data.meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{data.meta.total} clientes en total</span>
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

      <CustomerForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        initialData={editCustomer ?? undefined}
        title={editCustomer ? 'Editar cliente' : 'Nuevo cliente'}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar cliente"
        message={`¿Eliminar a "${deleteTarget?.name}"? Se perderá su historial asociado.`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
