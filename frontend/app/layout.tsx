// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { StickyBanner } from '@/components/ui/sticky-banner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkyBook',
  description: 'Flight booking made simple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider>
          <StickyBanner className="hidden md:flex bg-gradient-to-b from-pink-400 to-blue-600">
            <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
              🚧 This is a demo project. Flight data is currently hardcoded for testing purposes.{" "}
              <a href="https://github.com/tushxr12/sky-book" target='_blank' className="transition duration-200 hover:underline">
                Checkout on Github 🌟
              </a>
            </p>
          </StickyBanner>
          <Navbar />
          <main className="flex-1 bg-gray-50 dark:bg-gray-950 p-4 pt-0">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
