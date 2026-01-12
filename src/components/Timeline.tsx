import { TimelineEvent } from '@/types/cargo';
import { cn } from '@/lib/utils';
import { Package, Plane, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineProps {
  events: TimelineEvent[];
}

const eventConfig: Record<TimelineEvent['type'], {
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  CREATED: { 
    icon: Package, 
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
  },
  DEPARTED: { 
    icon: Plane, 
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  ARRIVED: { 
    icon: MapPin, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  DELIVERED: { 
    icon: CheckCircle2, 
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  CANCELLED: { 
    icon: XCircle, 
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative pl-10 pb-6 animate-fade-in">
            {/* Vertical Line */}
            {!isLast && (
              <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-border to-transparent" />
            )}

            {/* Icon */}
            <div className={cn(
              'absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center',
              config.bgColor
            )}>
              <Icon className={cn('w-4 h-4', config.color)} />
            </div>

            {/* Content */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-foreground">{event.description}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Location: <span className="font-medium">{event.location}</span>
                  </p>
                  {event.flightInfo && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Plane className="w-3 h-3" />
                        {event.flightInfo.flightNumber} • {event.flightInfo.airline}
                      </span>
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-foreground">
                    {format(event.timestamp, 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(event.timestamp, 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
