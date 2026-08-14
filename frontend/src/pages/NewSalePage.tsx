import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { customerService } from '../services/customer.service';
import { productService } from '../services/product.service';
import { saleService } from '../services/sale.service';
import { formatCurrency } from '../utils/format';
import { Product, Customer } from '../types';
import { useToast } from '../components/ui/Toast';

interface SaleLineItem {
  product: Product;
  quantity: number;
}

const IGV = 0.18;

export function NewSalePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [items, setItems] = useState<SaleLineItem[]>([]);
  const [notes, setNotes] = useState('');

  const { data: customers } = useQuery({
    queryKey: ['customers-search', customerSearch],
    queryFn: () => customerService.getAll({ search: customerSearch, limit: 6 }),
    enabled: customerSearch.length > 1,
  });

  const { data: products } = useQuery({
    queryKey: ['products-search', productSearch],
    queryFn: () => productService.getAll({ search: productSearch, limit: 6, status: 'active' }),
    enabled: productSearch.length > 1,
  });

  const mutation = useMutation({
    mutationFn: saleService.create,
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Venta registrada', `Comprobante ${sale.receiptNumber} generado.`);
      navigate('/sales');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al registrar la venta';
      toast.error('Error', msg);
    },
  });

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setProductSearch('');
    setShowProductList(false);
  };

  const updateQty = (productId: string, qty: number) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;
    if (qty < 1 || qty > item.product.stock) return;
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.product.id !== productId));

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const igv = subtotal * IGV;
  const total = subtotal + igv;

  const handleSubmit = () => {
    if (!selectedCustomer) { toast.warning('Cliente requerido', 'Selecciona un cliente para continuar.'); return; }
    if (items.length === 0) { toast.warning('Sin productos', 'Agrega al menos un producto a la venta.'); return; }

    mutation.mutate({
      customerId: selectedCustomer.id,
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      notes: notes || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nueva venta"
        subtitle="Registra una nueva transacción"
        actions={
          <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/sales')}>
            Volver
          </Button>
        }
      />

      <div className="space-y-4">
        {/* ── Cliente ── */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            1. Seleccionar cliente
          </h3>

          {selectedCustomer ? (
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{selectedCustomer.name}</p>
                  <p className="text-xs text-slate-500">
                    {selectedCustomer.documentType}: {selectedCustomer.documentNumber}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                Cambiar
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Input
                placeholder="Buscar cliente por nombre o documento..."
                leftIcon={<Search size={15} />}
                value={customerSearch}
                onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerList(true); }}
                onFocus={() => setShowCustomerList(true)}
              />
              {showCustomerList && customers && customers.data.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-lg">
                  {customers.data.map((c) => (
                    <button
                      key={c.id}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                      onMouseDown={() => { setSelectedCustomer(c); setCustomerSearch(''); setShowCustomerList(false); }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.documentType}: {c.documentNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Productos ── */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            2. Agregar productos
          </h3>

          <div className="relative mb-4">
            <Input
              placeholder="Buscar producto por nombre o SKU..."
              leftIcon={<Search size={15} />}
              value={productSearch}
              onChange={(e) => { setProductSearch(e.target.value); setShowProductList(true); }}
              onFocus={() => setShowProductList(true)}
            />
            {showProductList && products && products.data.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-lg">
                {products.data.map((p) => (
                  <button
                    key={p.id}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                    onMouseDown={() => addItem(p)}
                    disabled={p.stock === 0}
                  >
                    <div>
                      <p className={`text-sm font-medium ${p.stock === 0 ? 'text-slate-400' : 'text-slate-800'}`}>
                        {p.name}
                        {p.stock === 0 && <span className="ml-2 text-xs text-rose-400">(sin stock)</span>}
                      </p>
                      <p className="text-xs text-slate-400">SKU: {p.sku} · Stock: {p.stock}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(p.price)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShoppingCart size={32} className="mb-3 text-slate-200" />
              <p className="text-sm text-slate-400">Busca y agrega productos a la venta</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {/* Header */}
              <div className="mb-1 grid grid-cols-[1fr_80px_80px_32px] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <span>Producto</span>
                <span className="text-center">Cant.</span>
                <span className="text-right">Subtotal</span>
                <span />
              </div>
              {items.map((item) => (
                <div key={item.product.id} className="grid grid-cols-[1fr_80px_80px_32px] items-center gap-2 py-3 px-1">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.product.name}</p>
                    <p className="text-xs text-slate-400">{formatCurrency(item.product.price)} / u</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(e) => updateQty(item.product.id, parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  <p className="text-right text-sm font-semibold text-slate-800">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                  <button
                    className="flex items-center justify-center rounded p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    onClick={() => removeItem(item.product.id)}
                    title="Quitar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Resumen y notas ── */}
        {items.length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">3. Confirmar venta</h3>

            {/* Totales */}
            <div className="mb-4 rounded-lg bg-slate-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} ítems)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IGV (18%)</span>
                <span>{formatCurrency(igv)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total a cobrar</span>
                <span className="text-primary-700">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Notas */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Notas / observaciones <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 placeholder:text-slate-400"
                placeholder="Observaciones de la venta..."
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              loading={mutation.isPending}
              onClick={handleSubmit}
              leftIcon={<ShoppingCart size={16} />}
            >
              Registrar venta · {formatCurrency(total)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
