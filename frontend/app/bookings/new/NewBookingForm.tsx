'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewBookingPage() {
    // const searchParams = useSearchParams();
    // const flightIdFromQuery = searchParams.get('flightId');
    // const [flightId, setFlightId] = useState(flightIdFromQuery || '');

    const searchParams = useSearchParams();
    const router = useRouter();
    const [flightId, setFlightId] = useState('');

    useEffect(() => {
        const flightIdFromQuery = searchParams.get('flightId');
        if (flightIdFromQuery) {
            setFlightId(flightIdFromQuery);
        }
    }, [searchParams]);

    const [passengerName, setPassengerName] = useState('');
    const [seatsToReserve, setSeatsToReserve] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const bookingServiceUrl = process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL;

        if (!bookingServiceUrl) {
            setError('Flight service URL is not defined in env variables');
            setSubmitting(false);
            return;
        }

        const response = await fetch(bookingServiceUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                flightId: Number(flightId),
                passengerName,
                seatsReserved: Number(seatsToReserve),
            })
        });

        let resultText = await response.text();
        setSubmitting(false);

        if (!response.ok) {
            try {
                const json = JSON.parse(resultText);
                const errorMessage = json.errorMessage || JSON.stringify(json);
                setError(errorMessage);
                toast.error(`❌ Booking failed:\n${errorMessage}`);
            } catch {
                setError(resultText);
                toast.error(`❌ Booking failed:\n${resultText}`);
            }
            return;
        }
        toast.success('🎉 Booking successful!');
        setTimeout(() => {
            router.push('/bookings');
        }, 500);
    };

    return (
        <div className="max-w-md mx-auto py-5 mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center">Book Your Flight</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="flightId">Flight ID</Label>
                    <Input
                        id="flightId"
                        value={flightId}
                        onChange={(e) => setFlightId(e.target.value)}
                        required
                        type="number"
                    />
                </div>

                <div>
                    <Label htmlFor="passengerName">Passenger Name</Label>
                    <Input
                        id="passengerName"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="seats">Seats to Reserve</Label>
                    <Input
                        id="seats"
                        value={seatsToReserve}
                        onChange={(e) => setSeatsToReserve(Number(e.target.value))}
                        type="number"
                        min={1}
                        required
                    />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                </Button>

                {/* {error && <p className="text-sm text-red-500 whitespace-pre-line">{error}</p>} */}

            </form>
        </div>
    );
}