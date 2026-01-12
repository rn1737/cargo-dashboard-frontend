import { Airport, Booking, Flight } from '@/types/cargo';

export const airports: Airport[] = [
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata' },
  { code: 'COK', name: 'Cochin International', city: 'Kochi' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad' },
  { code: 'PNQ', name: 'Pune International', city: 'Pune' },
  { code: 'GOI', name: 'Goa International', city: 'Goa' },
];

const airlines = ['Air India Cargo', 'IndiGo Cargo', 'SpiceJet Cargo', 'BlueDart Aviation', 'Vistara Cargo'];

function generateFlightNumber(airline: string): string {
  const prefix = airline.substring(0, 2).toUpperCase();
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${number}`;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function generateFlights(origin: string, destination: string, date: Date): Flight[] {
  const flights: Flight[] = [];
  const flightCount = Math.floor(Math.random() * 5) + 3;

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const departureHour = 6 + Math.floor(Math.random() * 16);
    const flightDuration = 1.5 + Math.random() * 2;

    const departure = new Date(date);
    departure.setHours(departureHour, Math.floor(Math.random() * 60), 0, 0);

    flights.push({
      id: `FL-${Date.now()}-${i}`,
      flightNumber: generateFlightNumber(airline),
      airline,
      departureDateTime: departure,
      arrivalDateTime: addHours(departure, flightDuration),
      origin,
      destination,
    });
  }

  return flights.sort((a, b) => a.departureDateTime.getTime() - b.departureDateTime.getTime());
}

export function generateTransitRoutes(origin: string, destination: string, date: Date): { firstLeg: Flight; secondLeg: Flight }[] {
  const transitPoints = airports
    .filter(a => a.code !== origin && a.code !== destination)
    .slice(0, 3);

  const routes: { firstLeg: Flight; secondLeg: Flight }[] = [];

  transitPoints.forEach(transit => {
    const firstLegFlights = generateFlights(origin, transit.code, date);
    if (firstLegFlights.length > 0) {
      const firstLeg = firstLegFlights[0];
      
      // Second leg can be same day or next day
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const secondLegFlights = generateFlights(transit.code, destination, 
        Math.random() > 0.5 ? date : nextDay
      );
      
      if (secondLegFlights.length > 0) {
        const validSecondLegs = secondLegFlights.filter(
          f => f.departureDateTime.getTime() > firstLeg.arrivalDateTime.getTime() + 2 * 60 * 60 * 1000
        );
        
        if (validSecondLegs.length > 0) {
          routes.push({
            firstLeg,
            secondLeg: validSecondLegs[0],
          });
        }
      }
    }
  });

  return routes;
}

function generateRefId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) result += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 6; i++) result += nums[Math.floor(Math.random() * nums.length)];
  return result;
}

export const sampleBookings: Booking[] = [
  {
    refId: 'ACB123456',
    origin: 'DEL',
    destination: 'BLR',
    pieces: 5,
    weightKg: 250,
    status: 'DEPARTED',
    createdAt: new Date('2026-01-10T10:00:00'),
    updatedAt: new Date('2026-01-11T08:30:00'),
    flights: [
      {
        id: 'FL-001',
        flightNumber: 'AI5432',
        airline: 'Air India Cargo',
        departureDateTime: new Date('2026-01-11T08:00:00'),
        arrivalDateTime: new Date('2026-01-11T10:30:00'),
        origin: 'DEL',
        destination: 'BLR',
      },
    ],
    timeline: [
      {
        id: 'TL-001',
        timestamp: new Date('2026-01-10T10:00:00'),
        type: 'CREATED',
        location: 'DEL',
        description: 'Booking created',
      },
      {
        id: 'TL-002',
        timestamp: new Date('2026-01-11T08:30:00'),
        type: 'DEPARTED',
        location: 'DEL',
        description: 'Cargo departed from Delhi',
        flightInfo: { flightNumber: 'AI5432', airline: 'Air India Cargo' },
      },
    ],
  },
  {
    refId: 'ACB789012',
    origin: 'BOM',
    destination: 'HYD',
    pieces: 12,
    weightKg: 480,
    status: 'ARRIVED',
    createdAt: new Date('2026-01-09T14:00:00'),
    updatedAt: new Date('2026-01-10T16:45:00'),
    flights: [
      {
        id: 'FL-002',
        flightNumber: 'IG2345',
        airline: 'IndiGo Cargo',
        departureDateTime: new Date('2026-01-10T14:00:00'),
        arrivalDateTime: new Date('2026-01-10T15:30:00'),
        origin: 'BOM',
        destination: 'HYD',
      },
    ],
    timeline: [
      {
        id: 'TL-003',
        timestamp: new Date('2026-01-09T14:00:00'),
        type: 'CREATED',
        location: 'BOM',
        description: 'Booking created',
      },
      {
        id: 'TL-004',
        timestamp: new Date('2026-01-10T14:30:00'),
        type: 'DEPARTED',
        location: 'BOM',
        description: 'Cargo departed from Mumbai',
        flightInfo: { flightNumber: 'IG2345', airline: 'IndiGo Cargo' },
      },
      {
        id: 'TL-005',
        timestamp: new Date('2026-01-10T16:45:00'),
        type: 'ARRIVED',
        location: 'HYD',
        description: 'Cargo arrived at Hyderabad',
      },
    ],
  },
  {
    refId: 'ACB345678',
    origin: 'MAA',
    destination: 'DEL',
    pieces: 3,
    weightKg: 75,
    status: 'DELIVERED',
    createdAt: new Date('2026-01-08T09:00:00'),
    updatedAt: new Date('2026-01-09T18:00:00'),
    flights: [
      {
        id: 'FL-003',
        flightNumber: 'SJ8765',
        airline: 'SpiceJet Cargo',
        departureDateTime: new Date('2026-01-09T06:00:00'),
        arrivalDateTime: new Date('2026-01-09T09:00:00'),
        origin: 'MAA',
        destination: 'DEL',
      },
    ],
    timeline: [
      {
        id: 'TL-006',
        timestamp: new Date('2026-01-08T09:00:00'),
        type: 'CREATED',
        location: 'MAA',
        description: 'Booking created',
      },
      {
        id: 'TL-007',
        timestamp: new Date('2026-01-09T06:30:00'),
        type: 'DEPARTED',
        location: 'MAA',
        description: 'Cargo departed from Chennai',
        flightInfo: { flightNumber: 'SJ8765', airline: 'SpiceJet Cargo' },
      },
      {
        id: 'TL-008',
        timestamp: new Date('2026-01-09T09:15:00'),
        type: 'ARRIVED',
        location: 'DEL',
        description: 'Cargo arrived at Delhi',
      },
      {
        id: 'TL-009',
        timestamp: new Date('2026-01-09T18:00:00'),
        type: 'DELIVERED',
        location: 'DEL',
        description: 'Cargo delivered to consignee',
      },
    ],
  },
];

export { generateRefId };
