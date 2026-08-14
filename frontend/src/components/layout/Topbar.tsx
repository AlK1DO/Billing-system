import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Izquierda */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {greeting()}, {user?.name?.split(' ')[0]}
          </p>
          <p className="text-xs text-slate-500">Aquí tienes el resumen de tu negocio</p>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-2">
        {/* Búsqueda global (placeholder) */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-40 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none"
          />
        </div>

        {/* Notificaciones */}
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-600" />
        </button>
      </div>
    </header>
  );
}
