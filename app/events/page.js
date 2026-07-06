import EventLanding from '@/components/EventLanding';

export const metadata = {
  title: 'Book Events Today - Concerts, Shows, Meetups | Lucknow Fast Events',
  description: 'Same-day event booking in Lucknow. Concert tickets, shows, meetups - book instantly. Fast delivery, best prices, instant confirmation.',
  keywords: 'events in lucknow, concert tickets lucknow, book events, same day events, bms events lucknow, shows lucknow',
  openGraph: {
    title: 'Book Events Today - Same Day Event Booking',
    description: 'Instant event booking for concerts, shows, meetups in Lucknow',
    url: 'https://aroventech.in/events',
    type: 'website',
  },
};

export default function EventsPage() {
  return <EventLanding />;
}
