import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorMap = {
  blue:   { bg: 'bg-primary-50',  icon: 'bg-primary-100 text-primary-600',  value: 'text-primary-700' },
  green:  { bg: 'bg-emerald-50',  icon: 'bg-emerald-100 text-emerald-600',  value: 'text-emerald-700' },
  orange: { bg: 'bg-amber-50',    icon: 'bg-amber-100 text-amber-600',      value: 'text-amber-700' },
  red:    { bg: 'bg-rose-50',     icon: 'bg-rose-100 text-rose-600',        value: 'text-rose-700' },
  purple: { bg: 'bg-violet-50',   icon: 'bg-violet-100 text-violet-600',    value: 'text-violet-700' },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className={cn('card-enter rounded-xl border border-slate-100 bg-white p-5 shadow-sm')}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <p className={cn('mt-2 text-2xl font-bold', colors.value)}>{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colors.icon)}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-50 pt-3">
          <span
            className={cn(
              'text-xs font-medium',
              trend.value >= 0 ? 'text-emerald-600' : 'text-rose-500'
            )}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
