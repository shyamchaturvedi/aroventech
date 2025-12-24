"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Contact from './Contact';
import WhatsAppWidget from './WhatsAppWidget';
import TechBackground from './TechBackground';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    // Check if current route is a demo page
    const isDemoPage = pathname?.startsWith('/demos');

    if (isDemoPage) {
        return <>{children}</>;
    }

    return (
        <>
            <TechBackground />
            <Navbar />
            <div className="main-content">
                {children}
            </div>
            <Contact />
            <WhatsAppWidget />
        </>
    );
}
