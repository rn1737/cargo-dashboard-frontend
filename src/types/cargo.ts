export type BookingStatus = 'BOOKED' | 'DEPARTED' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departureDateTime: Date;
  arrivalDateTime: Date;
  origin: string;
  destination: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'CREATED' | 'DEPARTED' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED';
  location: string;
  description: string;
  flightInfo?: {
    flightNumber: string;
    airline: string;
  };
}

export interface Booking {
  refId: string;
  origin: string;
  destination: string;
  pieces: number;
  weightKg: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  flights: Flight[];
  timeline: TimelineEvent[];
}

export interface Route {
  type: 'direct' | 'transit';
  flights: Flight[];
  totalDuration: number;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
}
