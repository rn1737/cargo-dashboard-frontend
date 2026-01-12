import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package } from 'lucide-react';

interface SearchBookingProps {
  onSearch: (refId: string) => void;
}

export function SearchBooking({ onSearch }: SearchBookingProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim().toUpperCase());
    }
  };

  return (
    <div className="card-elevated p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Package className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Track Shipment</h3>
          <p className="text-sm text-muted-foreground">Enter your booking reference</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="e.g., ACB123456"
            className="input-cargo pl-10 uppercase"
          />
        </div>
        <Button type="submit" className="btn-accent">
          Track
        </Button>
      </form>
    </div>
  );
}
