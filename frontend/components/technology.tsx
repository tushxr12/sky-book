import React from 'react'

export function Technology() {
    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 border-t">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Built With</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Next.js</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tailwind CSS</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">.NET Core</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">SQLite</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">REST APIs</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">ShadCN UI</span>
                </div>
            </div>
        </section>
    )
}
