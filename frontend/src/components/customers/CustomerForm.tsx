import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Customer } from '../../types';

const schema = z.object({
  name:           z.string().min(2, 'Mínimo 2 caracteres'),
  documentType:   z.enum(['DNI', 'RUC', 'CE']),
  documentNumber: z.string().min(8, 'Número de documento inválido'),
  phone:          z.string().optional().or(z.literal('')),
  email:          z.string().email('Correo inválido').optional().or(z.literal('')),
  address:        z.string().optional().or(z.literal('')),
});

export type CustomerFormValues = z.infer<typeof schema>;

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => void;
  loading?: boolean;
  initialData?: Partial<Customer>;
  title?: string;
}

export function CustomerForm({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
  title = 'Nuevo cliente',
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      documentType: 'DNI',
      documentNumber: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              name:           initialData.name ?? '',
              documentType:   initialData.documentType ?? 'DNI',
              documentNumber: initialData.documentNumber ?? '',
              phone:          initialData.phone ?? '',
              email:          initialData.email ?? '',
              address:        initialData.address ?? '',
            }
          : { name: '', documentType: 'DNI', documentNumber: '', phone: '', email: '', address: '' }
      );
    }
  }, [open, initialData, reset]);

  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Nombre completo / Razón social"
          placeholder="Juan Pérez García"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo documento"
            options={[
              { value: 'DNI', label: 'DNI' },
              { value: 'RUC', label: 'RUC' },
              { value: 'CE',  label: 'Carné Ext.' },
            ]}
            error={errors.documentType?.message}
            {...register('documentType')}
          />
          <Input
            label="Número de documento"
            placeholder="12345678"
            error={errors.documentNumber?.message}
            {...register('documentNumber')}
          />
        </div>

        <Input
          label="Teléfono"
          type="tel"
          placeholder="+51 999 999 999"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="cliente@correo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Dirección"
          placeholder="Av. Principal 123, Lima"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
