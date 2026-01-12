import { BookingStatus } from '@/types/cargo';
import { cn } from '@/lib/utils';
import { Package, Plane, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<BookingStatus, { 
  label: string; 
  className: string; 
  icon: React.ElementType;
}> = {
  BOOKED: { 
    label: 'Booked', 
    className: 'status-booked',
    icon: Package,
  },
  DEPARTED: { 
    label: 'Departed', 
    className: 'status-departed',
    icon: Plane,
  },
  ARRIVED: { 
    label: 'Arrived', 
    className: 'status-arrived',
    icon: MapPin,
  },
  DELIVERED: { 
    label: 'Delivered', 
    className: 'status-delivered',
    icon: CheckCircle2,
  },
  CANCELLED: { 
    label: 'Cancelled', 
    className: 'status-cancelled',
    icon: XCircle,
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <span className={cn('status-badge', config.className, sizeClasses[size])}>
      <Icon className={cn(
        size === 'sm' && 'w-3 h-3',
        size === 'md' && 'w-3.5 h-3.5',
        size === 'lg' && 'w-4 h-4',
      )} />
      {config.label}
    </span>
  );
}
