import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Aroven Tech Lucknow - Best Software & Website Development | 999 Website Offer',
  description: 'Lucknow No.1 Website & Software Development Company. Aroven Tech offers 999 website, business website, app development, billing software, hotel software. Fast delivery & SEO ranking guaranteed in Gomti Nagar.',
  keywords: 'best software company in lucknow, website development lucknow, app development lucknow, 999 website lucknow, Aroven Tech lucknow, gomti nagar website developer, IT company lucknow, affordable website lucknow, lucknow web developer near me, business website in lucknow',
  robots: 'index, follow',
  language: 'English',
  icons: {
    icon: '/icon.svg',
  },
  verification: {
    google: '99QW0DpmKL0bjT7HJNWCwbQ7m4KaNHzvjukqASxVMxA',
  },
  openGraph: {
    title: 'Aroven Tech Lucknow - Best Website & Software Developer',
    description: '999 Website Offer | Fast Delivery | High SEO Ranking | Lucknow No.1 IT Solution in Gomti Nagar.',
    url: 'https://Aroven Tech.in',
    siteName: 'Aroven Tech',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aroven Tech Lucknow - Website & App Development',
    description: '999 Me Website | Lucknow Best Software Company in Gomti Nagar',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Aroven Tech Lucknow',
    'image': 'https://Aroven Tech.in/logo.svg',
    'description': 'Best software, app & website development company in Lucknow. 999 website offer available. Located in Gomti Nagar.',
    'telephone': '+919598023701',
    'email': 'info@Aroven Tech.in',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Gomti Nagar',
      'addressLocality': 'Lucknow',
      'addressRegion': 'Uttar Pradesh',
      'postalCode': '226010',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '26.8467',
      'longitude': '80.9462'
    },
    'url': 'https://Aroven Tech.in',
    'priceRange': 'Rs.999 - Rs.50000',
    'sameAs': [
      'https://facebook.com/Aroven Tech',
      'https://instagram.com/Aroven Tech'
    ],
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      'opens': '09:00',
      'closes': '20:00'
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Contact />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
