import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ArovenTech Lucknow - Best Software & Website Development | 999 Website Offer',
  description: 'Lucknow No.1 Website & Software Development Company. ArovenTech offers 999 website, business website, app development, billing software, hotel software. Fast delivery & SEO ranking guaranteed in Gomti Nagar.',
  keywords: 'best software company in lucknow, website development lucknow, app development lucknow, 999 website lucknow, aroventech lucknow, gomti nagar website developer, IT company lucknow, affordable website lucknow, lucknow web developer near me, business website in lucknow',
  robots: 'index, follow',
  language: 'English',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'ArovenTech Lucknow - Best Website & Software Developer',
    description: '999 Website Offer | Fast Delivery | High SEO Ranking | Lucknow No.1 IT Solution in Gomti Nagar.',
    url: 'https://aroventech.in',
    siteName: 'ArovenTech',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArovenTech Lucknow - Website & App Development',
    description: '999 Me Website | Lucknow Best Software Company in Gomti Nagar',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'ArovenTech Lucknow',
    'image': 'https://aroventech.in/logo.svg',
    'description': 'Best software, app & website development company in Lucknow. 999 website offer available. Located in Gomti Nagar.',
    'telephone': '+919598023701',
    'email': 'info@aroventech.in',
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
    'url': 'https://aroventech.in',
    'priceRange': 'Rs.999 - Rs.50000',
    'sameAs': [
      'https://facebook.com/aroventech',
      'https://instagram.com/aroventech'
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
      </body>
    </html>
  );
}
