import { Booking } from '@/types/cargo';
import { StatusBadge } from './StatusBadge';
import { FlightPath } from './FlightPath';
import { Timeline } from './Timeline';
import { airports } from '@/data/mockData';
import { Package, Scale, Plane, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface BookingDetailProps {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (status: 'DEPARTED' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED') => void;
}

export function BookingDetail({ booking, onClose, onStatusChange }: BookingDetailProps) {
  const originAirport = airports.find(a => a.code === booking.origin);
  const destAirport = airports.find(a => a.code === booking.destination);

  const canDepart = booking.status === 'BOOKED';
  const canArrive = booking.status === 'DEPARTED';
  const canDeliver = booking.status === 'ARRIVED';
  const canCancel = booking.status !== 'ARRIVED' && booking.status !== 'DELIVERED' && booking.status !== 'CANCELLED';

  return (
    <div className="card-elevated-lg h-full flex flex-col animate-slide-up">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Booking Reference</p>
            <h2 className="text-2xl font-bold text-primary mt-1">{booking.refId}</h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={booking.status} size="lg" />
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Flight Route */}
        <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
          <FlightPath
            origin={booking.origin}
            destination={booking.destination}
            originCity={originAirport?.city}
            destinationCity={destAirport?.city}
            animated={booking.status === 'DEPARTED'}
          />
        </div>

        {/* Cargo Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm">Pieces</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{booking.pieces}</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Scale className="w-4 h-4" />
              <span className="text-sm">Weight</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{booking.weightKg} kg</p>
          </div>
        </div>

        {/* Flight Info */}
        {booking.flights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
              Flight Information
            </h3>
            <div className="space-y-3">
              {booking.flights.map(flight => (
                <div
                  key={flight.id}
                  className="flex items-center gap-4 bg-muted/30 rounded-xl p-4 border border-border/50"
                >
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Plane className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {flight.flightNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">{flight.airline}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(flight.departureDateTime, 'MMM d')}
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {format(flight.departureDateTime, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Tracking Timeline
          </h3>
          <Timeline events={booking.timeline} />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="flex flex-wrap gap-3">
          {canDepart && (
            <Button
              onClick={() => onStatusChange('DEPARTED')}
              className="btn-accent flex-1"
            >
              Mark as Departed
            </Button>
          )}
          {canArrive && (
            <Button
              onClick={() => onStatusChange('ARRIVED')}
              className="btn-accent flex-1"
            >
              Mark as Arrived
            </Button>
          )}
          {canDeliver && (
            <Button
              onClick={() => onStatusChange('DELIVERED')}
              className="btn-accent flex-1"
            >
              Mark as Delivered
            </Button>
          )}
          {canCancel && (
            <Button
              onClick={() => onStatusChange('CANCELLED')}
              variant="destructive"
              className="flex-1"
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
