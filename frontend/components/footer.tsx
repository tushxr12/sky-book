// components/footer.tsx
'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="text-center md:text-left">
          <Link href={"/"}>
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              ✈️ SkyBook
            </p>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} SkyBook. All rights reserved.
          </p>
        </div>

        <div className="flex gap-6">
          <Link href="/flights" className="hover:text-blue-600 dark:hover:text-blue-400">
            Flights
          </Link>
          <Link href="/bookings" className="hover:text-blue-600 dark:hover:text-blue-400">
            Bookings
          </Link>
          <a
            href="https://github.com/tushxr12"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
