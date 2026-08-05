"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Contact from './Contact';
import WhatsAppWidget from './WhatsAppWidget';
import TechBackground from './TechBackground';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (pathname?.includes('merishop') || pathname?.includes('demos') || pathname?.includes('admin') || (typeof window !== 'undefined' && (window.location.pathname.includes('merishop') || window.location.pathname.includes('admin')))) {
            setIsStandalone(true);
        }
    }, [pathname]);

    if (isStandalone || pathname?.includes('merishop') || pathname?.includes('demos') || pathname?.includes('admin')) {
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
