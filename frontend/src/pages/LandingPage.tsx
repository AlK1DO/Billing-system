import { Link } from 'react-router-dom';
import { TrendingUp, Package, Users, BarChart3, Shield, Zap, CheckCircle2 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-xs font-bold text-white">TL</span>
            </div>
            <span className="text-lg font-bold text-slate-900">TechLedger</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-medium text-primary-700">
          <Zap size={12} />
          Sistema de gestión para PYMES
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900">
          Gestiona tu negocio<br />
          <span className="text-primary-600">de forma sencilla</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-slate-500">
          Controla ventas, productos, clientes e inventario desde una sola plataforma.
          Sin complicaciones, sin papeles.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700"
          >
            Comenzar ahora
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 px-8 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ver demo
          </Link>
        </div>

        {/* Features rápidas */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          {[
            'Gestión de productos',
            'Control de inventario',
            'Reportes en tiempo real',
            'Gestión de ventas',
          ].map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features grid ───────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold text-slate-900">
            Todo lo que necesitas
          </h2>
          <p className="mb-14 text-center text-slate-500">
            Una plataforma completa para administrar tu empresa.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Empieza a gestionar tu negocio hoy
          </h2>
          <p className="mb-8 text-slate-400">
            Crea tu cuenta en segundos. Sin tarjeta de crédito.
          </p>
          <Link
            to="/register"
            className="inline-flex rounded-xl bg-primary-600 px-10 py-4 text-sm font-semibold text-white hover:bg-primary-500"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TechLedger — Sistema de Gestión Empresarial
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Dashboard en tiempo real',
    description: 'Visualiza el estado de tu negocio con métricas clave, gráficos de ventas y alertas de inventario.',
    icon: <BarChart3 size={22} className="text-primary-600" />,
    iconBg: 'bg-primary-50',
  },
  {
    title: 'Gestión de productos',
    description: 'CRUD completo con SKU, categorías, precio, costo, stock mínimo y control de estado.',
    icon: <Package size={22} className="text-emerald-600" />,
    iconBg: 'bg-emerald-50',
  },
  {
    title: 'Ventas e inventario',
    description: 'Registra ventas, genera comprobantes y actualiza el stock automáticamente en cada transacción.',
    icon: <TrendingUp size={22} className="text-amber-600" />,
    iconBg: 'bg-amber-50',
  },
  {
    title: 'Gestión de clientes',
    description: 'Historial de compras, total acumulado y datos de contacto para cada cliente.',
    icon: <Users size={22} className="text-violet-600" />,
    iconBg: 'bg-violet-50',
  },
  {
    title: 'Reportes detallados',
    description: 'Ventas por día, por vendedor, productos más vendidos y análisis de inventario.',
    icon: <BarChart3 size={22} className="text-rose-600" />,
    iconBg: 'bg-rose-50',
  },
  {
    title: 'Roles y permisos',
    description: 'Administradores y vendedores con accesos diferenciados para cada módulo.',
    icon: <Shield size={22} className="text-cyan-600" />,
    iconBg: 'bg-cyan-50',
  },
];
