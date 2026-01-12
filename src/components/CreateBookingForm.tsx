import { useState } from 'react';
import { airports, generateRefId, generateFlights } from '@/data/mockData';
import { Booking, Flight } from '@/types/cargo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plane, Package, Scale, Calendar, CheckCircle } from 'lucide-react';
import { FlightPath } from './FlightPath';
import { format } from 'date-fns';

interface CreateBookingFormProps {
  onBookingCreated: (booking: Booking) => void;
}

export function CreateBookingForm({ onBookingCreated }: CreateBookingFormProps) {
  const [step, setStep] = useState<'form' | 'flights' | 'confirm'>('form');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [pieces, setPieces] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [availableFlights, setAvailableFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const handleSearchFlights = () => {
    if (!origin || !destination || !date) return;
    const flights = generateFlights(origin, destination, new Date(date));
    setAvailableFlights(flights);
    setStep('flights');
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  const handleCreateBooking = () => {
    if (!selectedFlight || !origin || !destination || !pieces || !weight) return;

    const now = new Date();
    const refId = generateRefId();

    const newBooking: Booking = {
      refId,
      origin,
      destination,
      pieces: parseInt(pieces),
      weightKg: parseInt(weight),
      status: 'BOOKED',
      createdAt: now,
      updatedAt: now,
      flights: [selectedFlight],
      timeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: now,
          type: 'CREATED',
          location: origin,
          description: 'Booking created',
        },
      ],
    };

    setCreatedBooking(newBooking);
    setStep('confirm');
    onBookingCreated(newBooking);
  };

  const handleReset = () => {
    setStep('form');
    setOrigin('');
    setDestination('');
    setPieces('');
    setWeight('');
    setDate('');
    setAvailableFlights([]);
    setSelectedFlight(null);
    setCreatedBooking(null);
  };

  const originAirport = airports.find(a => a.code === origin);
  const destAirport = airports.find(a => a.code === destination);

  if (step === 'confirm' && createdBooking) {
    return (
      <div className="card-elevated-lg p-8 text-center animate-slide-up">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Booking Created!</h3>
        <p className="text-muted-foreground mb-4">Your booking has been successfully created.</p>
        
        <div className="bg-muted/30 rounded-xl p-6 mb-6 border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
          <p className="text-3xl font-bold text-primary">{createdBooking.refId}</p>
        </div>

        <FlightPath
          origin={createdBooking.origin}
          destination={createdBooking.destination}
          originCity={originAirport?.city}
          destinationCity={destAirport?.city}
          animated={false}
        />

        <Button onClick={handleReset} className="btn-primary mt-6">
          Create Another Booking
        </Button>
      </div>
    );
  }

  if (step === 'flights') {
    return (
      <div className="card-elevated-lg p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Select Flight</h3>
          <Button variant="ghost" onClick={() => setStep('form')} className="text-sm">
            ← Back
          </Button>
        </div>

        <FlightPath
          origin={origin}
          destination={destination}
          originCity={originAirport?.city}
          destinationCity={destAirport?.city}
          animated={false}
          compact
        />

        <div className="space-y-3 mt-6 max-h-[300px] overflow-y-auto">
          {availableFlights.map(flight => (
            <div
              key={flight.id}
              onClick={() => handleSelectFlight(flight)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedFlight?.id === flight.id
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Plane className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{flight.flightNumber}</p>
                    <p className="text-sm text-muted-foreground">{flight.airline}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {format(flight.departureDateTime, 'h:mm a')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    → {format(flight.arrivalDateTime, 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleCreateBooking}
          className="btn-accent w-full mt-6"
          disabled={!selectedFlight}
        >
          Create Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="card-elevated-lg p-6 animate-slide-up">
      <h3 className="text-lg font-bold text-foreground mb-6">Create New Booking</h3>

      <div className="space-y-5">
        {/* Route Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium">Origin</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="input-cargo">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {airports.map(airport => (
                  <SelectItem key={airport.code} value={airport.code}>
                    <span className="font-semibold">{airport.code}</span>
                    <span className="text-muted-foreground ml-2">- {airport.city}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="input-cargo">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {airports
                  .filter(a => a.code !== origin)
                  .map(airport => (
                    <SelectItem key={airport.code} value={airport.code}>
                      <span className="font-semibold">{airport.code}</span>
                      <span className="text-muted-foreground ml-2">- {airport.city}</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pieces" className="text-sm font-medium flex items-center gap-1.5">
              <Package className="w-4 h-4" /> Pieces
            </Label>
            <Input
              id="pieces"
              type="number"
              min="1"
              value={pieces}
              onChange={e => setPieces(e.target.value)}
              placeholder="Enter pieces"
              className="input-cargo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium flex items-center gap-1.5">
              <Scale className="w-4 h-4" /> Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min="1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="Enter weight"
              className="input-cargo"
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Departure Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="input-cargo"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <Button
          onClick={handleSearchFlights}
          className="btn-primary w-full"
          disabled={!origin || !destination || !pieces || !weight || !date || origin === destination}
        >
          Search Flights
        </Button>
      </div>
    </div>
  );
}
