import { Booking } from '@/types/cargo';
import { StatusBadge } from './StatusBadge';
import { FlightPath } from './FlightPath';
import { airports } from '@/data/mockData';
import { Package, Scale, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
  selected?: boolean;
}

export function BookingCard({ booking, onClick, selected }: BookingCardProps) {
  const originAirport = airports.find(a => a.code === booking.origin);
  const destAirport = airports.find(a => a.code === booking.destination);

  return (
    <div
      onClick={onClick}
      className={cn(
        'card-elevated p-5 cursor-pointer transition-all duration-200 hover:shadow-cargo-lg animate-slide-up',
        selected && 'ring-2 ring-accent shadow-cargo-lg'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Booking Ref</p>
          <p className="text-lg font-bold text-primary mt-0.5">{booking.refId}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <FlightPath
        origin={booking.origin}
        destination={booking.destination}
        originCity={originAirport?.city}
        destinationCity={destAirport?.city}
        animated={booking.status === 'DEPARTED'}
        compact
      />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Package className="w-4 h-4" />
            <span>{booking.pieces} pcs</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Scale className="w-4 h-4" />
            <span>{booking.weightKg} kg</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{format(booking.createdAt, 'MMM d')}</span>
        </div>
      </div>

      {onClick && (
        <div className="flex items-center justify-end mt-3 text-accent font-medium text-sm">
          View Details <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </div>
  );
}
