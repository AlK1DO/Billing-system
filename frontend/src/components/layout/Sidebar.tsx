import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  BarChart3,
  Settings,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',   to: '/dashboard',  icon: <LayoutDashboard size={18} /> },
  { label: 'Productos',   to: '/products',   icon: <Package size={18} /> },
  { label: 'Clientes',    to: '/customers',  icon: <Users size={18} /> },
  { label: 'Ventas',      to: '/sales',      icon: <ShoppingCart size={18} /> },
  { label: 'Inventario',  to: '/inventory',  icon: <Warehouse size={18} /> },
  { label: 'Reportes',    to: '/reports',    icon: <BarChart3 size={18} /> },
  { label: 'Configuración', to: '/config',   icon: <Settings size={18} />, adminOnly: true },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        // Base: ancho fijo en desktop, drawer en mobile
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 transition-transform duration-200 lg:relative lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-sm font-bold text-white">TL</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">TechLedger</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Gestión Empresarial</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:text-white lg:hidden"
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Rol activo ────────────────────────────────────────────── */}
      <div className="mx-4 mb-4 rounded-lg bg-slate-800 px-3 py-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-500">Rol activo</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-100">
            {user?.role === 'admin' ? 'Administrador' : 'Vendedor'}
          </p>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            Activo
          </span>
        </div>
      </div>

      {/* ── Navegación ────────────────────────────────────────────── */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Usuario ───────────────────────────────────────────────── */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-100">{user?.name}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
