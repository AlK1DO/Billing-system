import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Users, Settings, Plus, UserX, UserCheck } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import api from '../services/api';

type Section = 'company' | 'users' | 'system';

const companySchema = z.object({
  name:    z.string().min(2, 'Mínimo 2 caracteres'),
  ruc:     z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  phone:   z.string().optional().or(z.literal('')),
  email:   z.string().email('Correo inválido').optional().or(z.literal('')),
});
type CompanyForm = z.infer<typeof companySchema>;

const newUserSchema = z.object({
  name:     z.string().min(2, 'Mínimo 2 caracteres'),
  email:    z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role:     z.enum(['admin', 'seller']),
});
type NewUserForm = z.infer<typeof newUserSchema>;

export function ConfigPage() {
  const [section, setSection] = useState<Section>('company');
  const [editCompany, setEditCompany] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string; isActive: boolean } | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  // Company data
  const { data: company, isLoading: loadingCompany } = useQuery({
    queryKey: ['config', 'company'],
    queryFn: async () => {
      const { data } = await api.get('/config/company');
      return data.data;
    },
  });

  // Users
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['config', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/config/users');
      return data.data as { id: string; name: string; email: string; role: string; isActive: boolean }[];
    },
    enabled: section === 'users',
  });

  // Company form
  const companyForm = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: CompanyForm) => api.put('/config/company', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', 'company'] });
      toast.success('Empresa actualizada');
      setEditCompany(false);
    },
    onError: () => toast.error('Error', 'No se pudo actualizar la empresa'),
  });

  // New user form
  const userForm = useForm<NewUserForm>({
    resolver: zodResolver(newUserSchema),
    defaultValues: { name: '', email: '', password: '', role: 'seller' },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: NewUserForm) => {
      // Reutilizamos el endpoint de registro pero con la misma empresa
      const { data: res } = await api.post('/config/users', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', 'users'] });
      toast.success('Usuario creado', 'El nuevo usuario puede iniciar sesión con sus credenciales.');
      setNewUserOpen(false);
      userForm.reset();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al crear usuario';
      toast.error('Error', msg);
    },
  });

  const toggleUserMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const endpoint = isActive ? `/config/users/${id}/deactivate` : `/config/users/${id}/activate`;
      const { data } = await api.patch(endpoint);
      return data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['config', 'users'] });
      toast.success(vars.isActive ? 'Usuario desactivado' : 'Usuario reactivado');
      setDeactivateTarget(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al actualizar usuario';
      toast.error('Error', msg);
    },
  });

  const openEditCompany = () => {
    companyForm.reset({
      name:    company?.name ?? '',
      ruc:     company?.ruc ?? '',
      address: company?.address ?? '',
      phone:   company?.phone ?? '',
      email:   company?.email ?? '',
    });
    setEditCompany(true);
  };

  const navItems = [
    { key: 'company' as Section, label: 'Empresa',  icon: <Building2 size={16} /> },
    { key: 'users'   as Section, label: 'Usuarios', icon: <Users size={16} /> },
    { key: 'system'  as Section, label: 'Sistema',  icon: <Settings size={16} /> },
  ];

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Ajustes de empresa, usuarios y sistema" />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Nav lateral */}
        <aside className="w-full lg:w-52 shrink-0">
          <nav className="space-y-0.5 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  section === item.key
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <div className="flex-1 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">

          {/* ── Empresa ── */}
          {section === 'company' && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">Información de empresa</h2>
                <Button size="sm" variant="secondary" onClick={openEditCompany}>
                  Editar
                </Button>
              </div>
              {loadingCompany ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : (
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ['Nombre de empresa', company?.name ?? '—'],
                    ['RUC', company?.ruc ?? '—'],
                    ['Dirección', company?.address ?? '—'],
                    ['Teléfono', company?.phone ?? '—'],
                    ['Correo', company?.email ?? '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          {/* ── Usuarios ── */}
          {section === 'users' && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">Usuarios del sistema</h2>
                <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setNewUserOpen(true)}>
                  Nuevo usuario
                </Button>
              </div>

              {loadingUsers ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {(users ?? []).map((u) => (
                    <div key={u.id} className="flex items-center gap-3 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                      <Badge variant={u.role === 'admin' ? 'info' : 'neutral'}>
                        {u.role === 'admin' ? 'Admin' : 'Vendedor'}
                      </Badge>
                      <Badge variant={u.isActive ? 'success' : 'danger'}>
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      {u.isActive ? (
                        <button
                          className="rounded p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                          title="Desactivar usuario"
                          onClick={() => setDeactivateTarget({ id: u.id, name: u.name, isActive: true })}
                        >
                          <UserX size={14} />
                        </button>
                      ) : (
                        <button
                          className="rounded p-1.5 text-slate-300 hover:text-emerald-500 transition-colors"
                          title="Reactivar usuario"
                          onClick={() => setDeactivateTarget({ id: u.id, name: u.name, isActive: false })}
                        >
                          <UserCheck size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Sistema ── */}
          {section === 'system' && (
            <div>
              <h2 className="mb-5 text-base font-semibold text-slate-800">Configuración del sistema</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Moneda', 'Soles peruanos (S/ PEN)'],
                  ['IGV', '18%'],
                  ['Zona horaria', 'America/Lima (UTC-5)'],
                  ['Idioma', 'Español (Perú)'],
                  ['Versión', 'TechLedger v1.0.0'],
                  ['Entorno', 'Producción'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal editar empresa */}
      <Modal open={editCompany} onClose={() => setEditCompany(false)} title="Editar empresa">
        <form onSubmit={companyForm.handleSubmit((d) => updateCompanyMutation.mutate(d))} className="space-y-4" noValidate>
          <Input label="Nombre de empresa" error={companyForm.formState.errors.name?.message} {...companyForm.register('name')} />
          <Input label="RUC" placeholder="20123456789" error={companyForm.formState.errors.ruc?.message} {...companyForm.register('ruc')} />
          <Input label="Dirección" placeholder="Av. Principal 123, Lima" error={companyForm.formState.errors.address?.message} {...companyForm.register('address')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Teléfono" placeholder="+51 1 234 5678" error={companyForm.formState.errors.phone?.message} {...companyForm.register('phone')} />
            <Input label="Correo" type="email" placeholder="empresa@correo.com" error={companyForm.formState.errors.email?.message} {...companyForm.register('email')} />
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="secondary" onClick={() => setEditCompany(false)}>Cancelar</Button>
            <Button type="submit" loading={updateCompanyMutation.isPending}>Guardar cambios</Button>
          </div>
        </form>
      </Modal>

      {/* Modal nuevo usuario */}
      <Modal open={newUserOpen} onClose={() => { setNewUserOpen(false); userForm.reset(); }} title="Nuevo usuario">
        <form onSubmit={userForm.handleSubmit((d) => createUserMutation.mutate(d))} className="space-y-4" noValidate>
          <Input label="Nombre completo" placeholder="Juan Pérez" error={userForm.formState.errors.name?.message} {...userForm.register('name')} />
          <Input label="Correo electrónico" type="email" placeholder="juan@empresa.com" error={userForm.formState.errors.email?.message} {...userForm.register('email')} />
          <Input label="Contraseña temporal" type="password" placeholder="••••••••" error={userForm.formState.errors.password?.message} {...userForm.register('password')} />
          <Select
            label="Rol"
            options={[{ value: 'seller', label: 'Vendedor' }, { value: 'admin', label: 'Administrador' }]}
            error={userForm.formState.errors.role?.message}
            {...userForm.register('role')}
          />
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="secondary" onClick={() => { setNewUserOpen(false); userForm.reset(); }}>Cancelar</Button>
            <Button type="submit" loading={createUserMutation.isPending}>Crear usuario</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm desactivar / reactivar */}
      <ConfirmDialog
        open={!!deactivateTarget}
        title={deactivateTarget?.isActive ? 'Desactivar usuario' : 'Reactivar usuario'}
        message={
          deactivateTarget?.isActive
            ? `¿Desactivar a "${deactivateTarget?.name}"? No podrá iniciar sesión hasta que sea reactivado.`
            : `¿Reactivar a "${deactivateTarget?.name}"? Podrá volver a iniciar sesión.`
        }
        confirmLabel={deactivateTarget?.isActive ? 'Desactivar' : 'Reactivar'}
        variant={deactivateTarget?.isActive ? 'warning' : 'warning'}
        loading={toggleUserMutation.isPending}
        onConfirm={() => {
          if (deactivateTarget) {
            toggleUserMutation.mutate({ id: deactivateTarget.id, isActive: deactivateTarget.isActive });
          }
        }}
        onCancel={() => setDeactivateTarget(null)}
      />
    </div>
  );
}
