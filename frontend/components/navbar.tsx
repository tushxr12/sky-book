'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClasses = (href: string) =>
    `block text-sm px-3 py-2 rounded-md transition-colors ${pathname === href
      ? 'text-primary font-semibold'
      : 'text-muted-foreground hover:text-primary'
    }`;

  return (
    <>
      
      <nav className="sticky top-0 z-50 py-1 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            ✈️ SkyBook
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/flights" className={linkClasses('/flights')}>Flights</Link>
            <Link href="/bookings" className={linkClasses('/bookings')}>Bookings</Link>
            <Link href="/bookings/new">
              <Button
                size="sm"
                variant={pathname === '/bookings/new' ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                + New Booking
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Links */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            <Link href="/flights" className={linkClasses('/flights')} onClick={() => setMenuOpen(false)}>Flights</Link>
            <Link href="/bookings" className={linkClasses('/bookings')} onClick={() => setMenuOpen(false)}>Bookings</Link>
            <Link href="/bookings/new" onClick={() => setMenuOpen(false)}>
              <Button
                className="w-full"
                size="sm"
                variant={pathname === '/bookings/new' ? 'default' : 'outline'}
              >
                + New Booking
              </Button>
            </Link>
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
