import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'live' | 'upcoming' | 'completed' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  pulse?: boolean;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className,
  pulse = false 
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    live: 'bg-red-100 text-red-700',
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {pulse && variant === 'live' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: BadgeProps['variant']; label: string; pulse?: boolean }> = {
    live: { variant: 'live', label: 'LIVE', pulse: true },
    upcoming: { variant: 'upcoming', label: 'Upcoming' },
    completed: { variant: 'completed', label: 'Completed' },
    cancelled: { variant: 'warning', label: 'Cancelled' },
    postponed: { variant: 'warning', label: 'Postponed' },
  };

  const config = statusMap[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} pulse={config.pulse}>
      {config.label}
    </Badge>
  );
}
