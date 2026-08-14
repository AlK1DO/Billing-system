import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-slate-900 px-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
            <span className="text-xl font-bold text-white">TL</span>
          </div>
          <span className="text-2xl font-bold text-white">TechLedger</span>
        </div>

        <h1 className="mb-4 text-center text-3xl font-bold text-white">
          Gestiona tu negocio de forma sencilla
        </h1>
        <p className="mb-10 text-center text-slate-400">
          Controla ventas, productos, clientes e inventario desde una sola plataforma.
        </p>

        <ul className="space-y-3">
          {[
            'Gestión de productos y SKUs',
            'Control de inventario en tiempo real',
            'Reportes de ventas detallados',
            'Administración de clientes',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-slate-300">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600/20 text-primary-400 text-sm">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-sm font-bold text-white">TL</span>
            </div>
            <span className="text-xl font-bold text-slate-900">TechLedger</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
