'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from 'react';

interface Flight {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
}

export default function HomePage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5290/flights')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch flights');
        return res.json();
      })
      .then(data => {
        setFlights(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading flights...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Available Flights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map(flight => (
          <Card key={flight.id} className="shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-bold">Flight #{flight.id}</h2>
              <p><strong>From:</strong> {flight.origin}</p>
              <p><strong>To:</strong> {flight.destination}</p>
              <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
              <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
              <p><strong>Available Seats:</strong> {flight.availableSeats}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
