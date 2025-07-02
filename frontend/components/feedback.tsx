import React from 'react'
import { InfiniteMovingCards } from './ui/infinite-moving-cards';

export function Feedback() {

    const testimonials = [
  {
    quote:
      "SkyBook made my last-minute flight booking effortless! The UI is clean, and everything just works — love it!",
    name: "Riya Sharma",
    title: "Frequent Traveler",
  },
  {
    quote:
      "Booking a flight has never been this fast. I had my seats reserved in less than 30 seconds. Amazing experience!",
    name: "Amit Verma",
    title: "Tech Consultant",
  },
  {
    quote:
      "I really appreciate the simplicity of SkyBook. No logins, no fuss — just search, book, and fly.",
    name: "Sneha Patel",
    title: "Digital Nomad",
  },
  {
    quote:
      "The real-time seat availability feature is a game changer. I could instantly see which flights had open seats.",
    name: "Rohit Mehta",
    title: "Software Engineer",
  },
  {
    quote:
      "SkyBook’s dark mode and mobile responsiveness make it a joy to use, especially during late-night travel planning.",
    name: "Priya Desai",
    title: "UX Designer",
  },
];
    return (
        <section className="w-full bg-white dark:bg-gray-950 py-16 border-t">
            <div className="w-full mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">What Our Users Say</h2>
                {/* <div className="grid gap-6 sm:grid-cols-2"> */}
                    <div className="rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                        <InfiniteMovingCards
                            items={testimonials}
                            direction="left"
                            speed="normal"
                        />
                    </div>
                {/* </div> */}
            </div>
        </section>

    )
}