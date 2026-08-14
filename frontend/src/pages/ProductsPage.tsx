import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, Package, Filter } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TableSkeleton } from '../components/ui/Skeleton';
import { ProductForm, ProductFormValues } from '../components/products/ProductForm';
import { productService } from '../services/product.service';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export function ProductsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, category, status, page }],
    queryFn: () =>
      productService.getAll({
        search: search || undefined,
        category: category || undefined,
        status: (status as 'active' | 'inactive') || undefined,
        page,
        limit: 20,
      }),
  });

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado', 'El producto fue agregado al catálogo.');
      setFormOpen(false);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al crear el producto';
      toast.error('Error', msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado');
      setEditProduct(null);
      setFormOpen(false);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al actualizar';
      toast.error('Error', msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado');
      setDeleteTarget(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al eliminar';
      toast.error('Error', msg);
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data: values });
    } else {
      createMutation.mutate(values as Parameters<typeof productService.create>[0]);
    }
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditProduct(null);
  };

  const columns = [
    {
      key: 'sku',
      header: 'SKU',
      render: (p: Product) => (
        <span className="font-mono text-xs text-slate-500">{p.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Producto',
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt={p.name} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Package size={14} className="text-slate-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-slate-800">{p.name}</p>
            <p className="text-xs text-slate-400">{p.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Precio',
      render: (p: Product) => (
        <div>
          <p className="font-medium text-slate-800">{formatCurrency(p.price)}</p>
          <p className="text-xs text-slate-400">Costo: {formatCurrency(p.cost)}</p>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p: Product) => (
        <div>
          <span
            className={
              p.stock === 0
                ? 'font-semibold text-rose-600'
                : p.stock <= p.minStock
                ? 'font-semibold text-amber-600'
                : 'font-medium text-slate-700'
            }
          >
            {p.stock}
          </span>
          <p className="text-xs text-slate-400">Mín: {p.minStock}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p: Product) => (
        <Badge variant={p.status === 'active' ? 'success' : 'neutral'}>
          {p.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    ...(user?.role === 'admin'
      ? [
          {
            key: 'actions',
            header: '',
            render: (p: Product) => (
              <div className="flex items-center gap-1">
                <button
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  title="Editar"
                  onClick={() => openEdit(p)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  title="Eliminar"
                  onClick={() => setDeleteTarget(p)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const isEmpty = !isLoading && (data?.data ?? []).length === 0;

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Administra tu catálogo de productos"
        actions={
          user?.role === 'admin' && (
            <Button leftIcon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
              Nuevo producto
            </Button>
          )
        }
      />

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, SKU o descripción..."
            leftIcon={<Search size={15} />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          <Select
            options={[
              { value: '', label: 'Todas las categorías' },
              ...['Electrónica','Computadoras','Periféricos','Accesorios','Ropa','Calzado','Alimentos','Bebidas','Hogar','Oficina','Otros']
                .map((c) => ({ value: c, label: c })),
            ]}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="w-44"
          />
          <Select
            options={[
              { value: '',         label: 'Todos los estados' },
              { value: 'active',   label: 'Activos' },
              { value: 'inactive', label: 'Inactivos' },
            ]}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-40"
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : isEmpty ? (
        <EmptyState
          icon={<Package size={28} />}
          title="Sin productos"
          description="Agrega tu primer producto al catálogo para comenzar a gestionar tu inventario."
          action={
            user?.role === 'admin'
              ? { label: 'Nuevo producto', onClick: () => setFormOpen(true), icon: <Plus size={14} /> }
              : undefined
          }
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(p) => p.id}
            loading={false}
            emptyMessage="No se encontraron productos"
          />

          {data && data.meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>
                Mostrando {(page - 1) * 20 + 1}–{Math.min(page * 20, data.meta.total)} de {data.meta.total}
              </span>
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

      {/* Form modal */}
      <ProductForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        initialData={editProduct ?? undefined}
        title={editProduct ? 'Editar producto' : 'Nuevo producto'}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar producto"
        message={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
