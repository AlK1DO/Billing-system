import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Product } from '../../types';

const schema = z.object({
  name:        z.string().min(2, 'Mínimo 2 caracteres'),
  sku:         z.string().min(1, 'El SKU es requerido'),
  description: z.string().optional().default(''),
  category:    z.string().min(1, 'La categoría es requerida'),
  price:       z.coerce.number().positive('Debe ser mayor a 0'),
  cost:        z.coerce.number().nonnegative('No puede ser negativo'),
  stock:       z.coerce.number().int().nonnegative('No puede ser negativo'),
  minStock:    z.coerce.number().int().nonnegative().default(5),
  imageUrl:    z.string().url('URL inválida').optional().or(z.literal('')),
  status:      z.enum(['active', 'inactive']),
});

export type ProductFormValues = z.infer<typeof schema>;

const CATEGORIES = [
  'Electrónica', 'Computadoras', 'Periféricos', 'Accesorios',
  'Ropa', 'Calzado', 'Alimentos', 'Bebidas',
  'Hogar', 'Oficina', 'Otros',
];

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
  loading?: boolean;
  initialData?: Partial<Product>;
  title?: string;
}

export function ProductForm({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
  title = 'Nuevo producto',
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      category: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 5,
      imageUrl: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              name:        initialData.name ?? '',
              sku:         initialData.sku ?? '',
              description: initialData.description ?? '',
              category:    initialData.category ?? '',
              price:       initialData.price ?? 0,
              cost:        initialData.cost ?? 0,
              stock:       initialData.stock ?? 0,
              minStock:    initialData.minStock ?? 5,
              imageUrl:    initialData.imageUrl ?? '',
              status:      initialData.status ?? 'active',
            }
          : {
              name: '', sku: '', description: '', category: '',
              price: 0, cost: 0, stock: 0, minStock: 5, imageUrl: '', status: 'active',
            }
      );
    }
  }, [open, initialData, reset]);

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nombre del producto"
            placeholder="Laptop Dell XPS 15"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="SKU / Código"
            placeholder="LAP-DELL-001"
            error={errors.sku?.message}
            {...register('sku')}
          />
        </div>

        <Textarea
          label="Descripción"
          placeholder="Descripción del producto (opcional)"
          error={errors.description?.message}
          {...register('description')}
        />

        <Select
          label="Categoría"
          placeholder="Seleccionar categoría"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.category?.message}
          {...register('category')}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Input
            label="Precio (S/)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input
            label="Costo (S/)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.cost?.message}
            {...register('cost')}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock')}
          />
          <Input
            label="Stock mínimo"
            type="number"
            min="0"
            placeholder="5"
            error={errors.minStock?.message}
            {...register('minStock')}
          />
        </div>

        <Input
          label="URL de imagen (opcional)"
          placeholder="https://..."
          error={errors.imageUrl?.message}
          {...register('imageUrl')}
        />

        <Select
          label="Estado"
          options={[
            { value: 'active',   label: 'Activo' },
            { value: 'inactive', label: 'Inactivo' },
          ]}
          error={errors.status?.message}
          {...register('status')}
        />

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
