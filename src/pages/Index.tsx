import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CreateBookingForm } from '@/components/CreateBookingForm';
import { SearchBooking } from '@/components/SearchBooking';
import { BookingCard } from '@/components/BookingCard';
import { BookingDetail } from '@/components/BookingDetail';
import { StatsCard } from '@/components/StatsCard';
import { sampleBookings } from '@/data/mockData';
import { Booking, BookingStatus, TimelineEvent } from '@/types/cargo';
import { Package, Plane, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchResult, setSearchResult] = useState<Booking | null | 'not-found'>(null);

  const stats = useMemo(() => ({
    total: bookings.length,
    booked: bookings.filter(b => b.status === 'BOOKED').length,
    inTransit: bookings.filter(b => b.status === 'DEPARTED').length,
    delivered: bookings.filter(b => b.status === 'DELIVERED').length,
  }), [bookings]);

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    toast.success('Booking created successfully!', {
      description: `Reference: ${newBooking.refId}`,
    });
  };

  const handleSearch = (refId: string) => {
    const found = bookings.find(b => b.refId.toUpperCase() === refId.toUpperCase());
    if (found) {
      setSearchResult(found);
      setSelectedBooking(found);
    } else {
      setSearchResult('not-found');
      toast.error('Booking not found', {
        description: `No booking found with reference ${refId}`,
      });
    }
  };

  const handleStatusChange = (status: 'DEPARTED' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED') => {
    if (!selectedBooking) return;

    const now = new Date();
    const eventTypeMap: Record<string, TimelineEvent['type']> = {
      DEPARTED: 'DEPARTED',
      ARRIVED: 'ARRIVED',
      DELIVERED: 'DELIVERED',
      CANCELLED: 'CANCELLED',
    };

    const locationMap: Record<string, string> = {
      DEPARTED: selectedBooking.origin,
      ARRIVED: selectedBooking.destination,
      DELIVERED: selectedBooking.destination,
      CANCELLED: selectedBooking.origin,
    };

    const descriptionMap: Record<string, string> = {
      DEPARTED: `Cargo departed from ${selectedBooking.origin}`,
      ARRIVED: `Cargo arrived at ${selectedBooking.destination}`,
      DELIVERED: 'Cargo delivered to consignee',
      CANCELLED: 'Booking cancelled',
    };

    const newEvent: TimelineEvent = {
      id: `TL-${Date.now()}`,
      timestamp: now,
      type: eventTypeMap[status],
      location: locationMap[status],
      description: descriptionMap[status],
      ...(status === 'DEPARTED' && selectedBooking.flights[0] && {
        flightInfo: {
          flightNumber: selectedBooking.flights[0].flightNumber,
          airline: selectedBooking.flights[0].airline,
        },
      }),
    };

    const updatedBooking: Booking = {
      ...selectedBooking,
      status: status as BookingStatus,
      updatedAt: now,
      timeline: [...selectedBooking.timeline, newEvent],
    };

    setBookings(prev =>
      prev.map(b => (b.refId === selectedBooking.refId ? updatedBooking : b))
    );
    setSelectedBooking(updatedBooking);

    const toastMessages: Record<string, { title: string; description: string }> = {
      DEPARTED: { title: 'Marked as Departed', description: 'Cargo is now in transit' },
      ARRIVED: { title: 'Marked as Arrived', description: 'Cargo has arrived at destination' },
      DELIVERED: { title: 'Marked as Delivered', description: 'Shipment completed successfully' },
      CANCELLED: { title: 'Booking Cancelled', description: 'The booking has been cancelled' },
    };

    const msg = toastMessages[status];
    if (status === 'CANCELLED') {
      toast.error(msg.title, { description: msg.description });
    } else {
      toast.success(msg.title, { description: msg.description });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Bookings"
            value={stats.total}
            icon={Package}
            iconColor="text-primary"
          />
          <StatsCard
            title="Awaiting Pickup"
            value={stats.booked}
            icon={Package}
            iconColor="text-sky-500"
          />
          <StatsCard
            title="In Transit"
            value={stats.inTransit}
            icon={Plane}
            iconColor="text-amber-500"
          />
          <StatsCard
            title="Delivered"
            value={stats.delivered}
            icon={CheckCircle2}
            iconColor="text-green-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms & List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <SearchBooking onSearch={handleSearch} />

            {/* Search Error Message */}
            {searchResult === 'not-found' && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-slide-up">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive font-medium">
                  No booking found. Please check your reference number.
                </p>
              </div>
            )}

            {/* Create Booking */}
            <CreateBookingForm onBookingCreated={handleBookingCreated} />

            {/* Recent Bookings */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Bookings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {bookings.slice(0, 6).map(booking => (
                  <BookingCard
                    key={booking.refId}
                    booking={booking}
                    onClick={() => setSelectedBooking(booking)}
                    selected={selectedBooking?.refId === booking.refId}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Detail */}
          <div className="lg:col-span-1">
            {selectedBooking ? (
              <BookingDetail
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="card-elevated-lg p-8 text-center h-[400px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Booking Selected</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Select a booking from the list or search by reference number to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
