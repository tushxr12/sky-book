import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero(){
    return (
        <section className="relative bg-white dark:bg-gray-950 py-20 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                    Plan Your Next Journey with{' '}
                    <span className="text-blue-600 dark:text-blue-400">SkyBook✈️</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Fast, simple, and reliable flight bookings built for modern travelers.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/flights">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer">
                            Search Flights
                        </Button>
                    </Link>
                    <Link href="/bookings">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            My Bookings
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}