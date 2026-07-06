'use client';

import EventDetail from '@/components/EventDetail';
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
  const params = useParams();
  const { eventId } = params;

  return <EventDetail eventId={eventId} />;
}
