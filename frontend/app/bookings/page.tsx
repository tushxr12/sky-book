'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Booking {
  id: number;
  flightId: number;
  passengerName: string;
  seatsReserved: number;
  bookingTime: string;
}

interface Flight {
  id: number;
  origin: string;
  destination: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5006/bookings').then((res) => res.json()),
      fetch('http://localhost:5290/flights').then((res) => res.json())
    ])
      .then(([bookingsData, flightsData]) => {
        setBookings(bookingsData);
        setFlights(flightsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load bookings or flights');
        setLoading(false);
      });
  }, []);

  const getFlightInfo = (flightId: number) =>
    flights.find((f) => f.id === flightId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold my-8 text-center">📋 All Bookings</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading bookings...</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-muted-foreground">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const flight = getFlightInfo(booking.flightId);

            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow border flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-lg">
                    🧾 Booking #{booking.id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 flex-1">
                  <p>
                    ✈️ <strong>Flight:</strong>{' '}
                    {flight ? `${flight.origin} → ${flight.destination}` : `#${booking.flightId}`}
                  </p>
                  <p>
                    👤 <strong>Passenger:</strong> {booking.passengerName}
                  </p>
                  <p>
                    💺 <strong>{booking.seatsReserved}</strong> seat{booking.seatsReserved > 1 ? 's' : ''}
                  </p>
                  <p>
                    🕒 <strong>Booked at:</strong>{' '}
                    {new Date(booking.bookingTime).toLocaleString()}
                  </p>
                </CardContent>


              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
