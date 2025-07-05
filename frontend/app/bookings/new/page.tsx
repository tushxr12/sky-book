'use client';

import { Suspense } from 'react';
import NewBookingForm from './NewBookingForm';

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewBookingForm />
    </Suspense>
  );
}