import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, Building2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const schema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    companyName: z.string().min(2, 'Nombre de empresa requerido'),
    email: z.string().email('Correo inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError('');
    try {
      await registerUser(values);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Error al crear la cuenta';
      setError(msg);
    }
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-slate-900">Crear cuenta</h2>
      <p className="mb-8 text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:underline">
          Iniciar sesión
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Tu nombre"
          placeholder="Juan Pérez"
          leftIcon={<User size={15} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Nombre de empresa"
          placeholder="Mi Empresa S.A.C."
          leftIcon={<Building2 size={15} />}
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@empresa.com"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={15} />}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={15} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {error && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Crear cuenta
        </Button>
      </form>
    </div>
  );
}
