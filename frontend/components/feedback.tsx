import React from 'react'

export function Feedback() {
    return (
        <section className="w-full bg-white dark:bg-gray-950 py-16 border-t">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">What Our Users Say</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
                        <p className="text-gray-700 dark:text-gray-300">
                            “Booking was lightning fast and the UI is super clean. Loved the experience!”
                        </p>
                        <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">– Priya S, Bengaluru</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
                        <p className="text-gray-700 dark:text-gray-300">
                            “This feels smoother than most airline apps I’ve used. Well done.”
                        </p>
                        <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">– Aditya R, Delhi</p>
                    </div>
                </div>
            </div>
        </section>

    )
}