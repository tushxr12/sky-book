// app/flights/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface Flight {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();


  useEffect(() => {
    fetch('http://localhost:5290/flights')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch flights');
        return res.json();
      })
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center mt-10">Available Flights</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading flights...</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : flights.length === 0 ? (
        <p className="text-center text-muted-foreground">No flights found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  ✈️ {flight.origin} → {flight.destination}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                <p><strong>Total Seats:</strong> {flight.totalSeats}</p>
                <p><strong>Available:</strong> {flight.availableSeats}</p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button
                  className="w-full"
                  onClick={() => router.push(`/bookings/new?flightId=${flight.id}`)}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
