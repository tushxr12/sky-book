'use client';
import { Hero } from "../components/hero"
import { Features } from "../components/features"
import { Feedback } from '@/components/feedback';
import { Technology } from '@/components/technology';
import { Contact } from '@/components/contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Feedback />
      <Technology />
      <Contact />
    </>
  );
}
