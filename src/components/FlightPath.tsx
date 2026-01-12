import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlightPathProps {
  origin: string;
  destination: string;
  originCity?: string;
  destinationCity?: string;
  animated?: boolean;
  compact?: boolean;
}

export function FlightPath({ 
  origin, 
  destination, 
  originCity,
  destinationCity,
  animated = true,
  compact = false,
}: FlightPathProps) {
  return (
    <div className={cn("flight-path w-full", compact ? "py-2" : "py-4")}>
      <div className="flex items-center justify-between gap-4">
        {/* Origin */}
        <div className={cn("text-center", compact ? "min-w-[60px]" : "min-w-[80px]")}>
          <p className={cn("airport-code", compact && "text-lg")}>{origin}</p>
          {originCity && !compact && (
            <p className="text-xs text-muted-foreground mt-1">{originCity}</p>
          )}
        </div>

        {/* Flight Path Line */}
        <div className="flex-1 relative h-8 flex items-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40 rounded-full" />
          
          {/* Dashed overlay */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/30" />
            ))}
          </div>
          
          {/* Animated Plane */}
          {animated && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
              <Plane className="w-5 h-5 text-accent animate-plane-fly" />
            </div>
          )}
          
          {/* Static Plane for non-animated */}
          {!animated && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-background px-2">
                <Plane className="w-5 h-5 text-accent" />
              </div>
            </div>
          )}
        </div>

        {/* Destination */}
        <div className={cn("text-center", compact ? "min-w-[60px]" : "min-w-[80px]")}>
          <p className={cn("airport-code", compact && "text-lg")}>{destination}</p>
          {destinationCity && !compact && (
            <p className="text-xs text-muted-foreground mt-1">{destinationCity}</p>
          )}
        </div>
      </div>
    </div>
  );
}
