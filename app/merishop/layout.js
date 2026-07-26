export const metadata = {
  title: "MeriShop — #1 Offline Billing App, GST Invoice & Thermal Receipt POS in India",
  description: "Download MeriShop — India's premier 100% offline retail POS app for Kirana Stores, Restaurants, Medical Shops & Dairy. Generate GST invoices in 3s, print Bluetooth thermal receipts, scan barcode stock & manage Udhaar Khata without internet!",
  keywords: [
    "MeriShop",
    "MeriShop App",
    "Offline POS App India",
    "GST Billing App",
    "Thermal Receipt Printer App",
    "Kirana Store Billing Software",
    "Restaurant KOT Printing App",
    "Digital Udhaar Khata App",
    "Barcode Scanner Inventory",
    "ArovenTech",
    "Desi Dukaan Billing",
    "Shyam Chaturvedi"
  ],
  authors: [{ name: "Shyam Chaturvedi", url: "https://www.aroventech.site" }],
  creator: "Shyam Chaturvedi (ArovenTech)",
  publisher: "ArovenTech",
  metadataBase: new URL("https://www.aroventech.site"),
  alternates: {
    canonical: "/merishop",
  },
  openGraph: {
    title: "MeriShop — Desi Dukaan Ka Digital Register & Offline POS Engine",
    description: "GST Billing, 58mm/80mm Thermal Receipts, Barcode Inventory & Udhaar Khata. 100% Offline.",
    url: "https://www.aroventech.site/merishop",
    siteName: "MeriShop — Retail Operating System",
    images: [
      {
        url: "/assets/images/v2_hero.png",
        width: 1200,
        height: 630,
        alt: "MeriShop POS Terminal App",
      },
    ],
    locale: "hi_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeriShop — #1 Offline POS & Billing App in India",
    description: "Instant GST Billing, Bluetooth Receipts, Barcode Stock Tracker & Udhaar Ledger.",
    images: ["/assets/images/v2_hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MeriShopLayout({ children }) {
  return <>{children}</>;
}
