import React from 'react'

export function Features() {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 border-t border-gray-200 dark:border-gray-800 ">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
                    Why Choose SkyBook?
                </h2>

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center space-y-3">
                        <div className="text-4xl">🛫</div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Browse Flights</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quickly explore all available flights with live availability.
                        </p>
                    </div>

                    <div className="text-center space-y-3">
                        <div className="text-4xl">✅</div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Simple Booking</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Reserve your seats in seconds — no account needed.
                        </p>
                    </div>

                    <div className="text-center space-y-3">
                        <div className="text-4xl">📱</div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Responsive UI</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Works smoothly on mobile, tablet, and desktop devices.
                        </p>
                    </div>

                    <div className="text-center space-y-3">
                        <div className="text-4xl">🔐</div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Reliable Services</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Powered by scalable microservices built with .NET and Next.js.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}