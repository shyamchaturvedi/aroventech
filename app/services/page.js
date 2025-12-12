import Services from '@/components/Services';
import Image from 'next/image';

export const metadata = {
    title: 'IT Services in Lucknow | Website, App & SEO | Aroven Tech Gomti Nagar',
    description: 'Best IT services in Gomti Nagar, Lucknow. Website Development, Android/iOS App Development, Custom Software, Digital Marketing & Google SEO packages starting @ Rs.999. Call 9598023701',
    keywords: 'web development services lucknow, app developers lucknow, seo company lucknow, digital marketing lucknow, software solutions lucknow, custom erp lucknow, gomti nagar it services, Aroven Tech services',
    robots: 'index, follow',
    openGraph: {
        title: 'Complete IT Services in Lucknow - Aroven Tech',
        description: 'Website, App, Software & SEO Services | 999 Website Offer | Gomti Nagar, Lucknow',
    },
};

export default function ServicesPage() {
    return (
        <main className="section-padding container">
            <h1 className="text-center" style={{ marginTop: '80px' }}>
                Our <span className="gradient-text">Premium IT Services in Lucknow</span>
            </h1>

            <h2 className="text-center" style={{ fontSize: '1.2rem', fontWeight: 'normal', color: 'var(--text-dim)', marginTop: '1rem' }}>
                Best Software & Website Development Company in Gomti Nagar, Lucknow
            </h2>

            {/* Dashboard Image - SEO Optimized Alt */}
            <div style={{ margin: '2rem auto', maxWidth: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <Image
                    src="/seo-marketing-dashboard.png"
                    alt="Best Digital Marketing Dashboard and SEO Services in Lucknow - Aroven Tech Gomti Nagar"
                    width={1200}
                    height={600}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            <Services />

            <div style={{ marginTop: '5rem' }}>
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>
                    Why Digital Transformation for Lucknow Businesses?
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>For Business Owners in Lucknow</h3>
                        <p>Stop relying on offline methods. Get a custom ERP and CRM to manage your billing, inventory, and customers automatically. Best software company in Lucknow.</p>
                    </div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>For Retail Shops & E-commerce</h3>
                        <p>Launch your E-commerce store today. Sell products online to customers across Lucknow and India 24/7. Affordable website development in Gomti Nagar.</p>
                    </div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>For Schools & Coaching Centers</h3>
                        <p>Educational institutions need management software for student tracking and fee collection. We build the best solutions for Lucknow institutes.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
