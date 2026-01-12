import { Plane, Package } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-cargo-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Package className="w-8 h-8" />
              <Plane className="w-4 h-4 absolute -top-1 -right-1 transform rotate-45" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AirCargo</h1>
              <p className="text-xs text-primary-foreground/70">Booking & Tracking</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">Bookings</a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">Routes</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
