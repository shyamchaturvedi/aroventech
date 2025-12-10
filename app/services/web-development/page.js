import Image from 'next/image';

export const metadata = {
    title: 'Web Development Services in Lucknow | ArovenTech Website Design',
    description: 'Professional website development services in Lucknow. Custom websites, e-commerce, business websites starting @ Rs.999. Best web design company in Gomti Nagar. Call 9598023701',
    keywords: 'web development lucknow, website design lucknow, web design company, custom website development, ecommerce website lucknow, gomti nagar web developer',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://aroventech.in/services/web-development'
    },
    openGraph: {
        title: 'Web Development Services - ArovenTech Lucknow',
        description: 'Professional website development starting @ Rs.999. Best in Lucknow',
        url: 'https://aroventech.in/services/web-development',
    },
};

export default function WebDevelopmentPage() {
    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                <span className="gradient-text">Website Development Services</span> in Lucknow
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                ArovenTech is the leading website development company in Lucknow, offering professional web design and development services for businesses of all sizes. From simple business websites to complex e-commerce platforms, we deliver high-quality, SEO-optimized websites that help you grow online.
            </p>

            <div style={{ margin: '3rem auto', maxWidth: '600px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image
                    src="/web-development-lucknow.png"
                    alt="Website Development Services in Lucknow - ArovenTech Professional Web Design"
                    width={1200}
                    height={600}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h2>Our Web Development Services</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Business Websites</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Professional corporate websites for companies in Lucknow. Perfect for service providers, consultants, and B2B businesses.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>E-commerce Websites</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Full-featured online stores with payment integration, inventory management, and order tracking for retail businesses.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Portfolio Websites</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Showcase your work beautifully. Ideal for photographers, designers, artists, and freelancers in Lucknow.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Educational Websites</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Websites for schools, colleges, and coaching institutes with student portals and online admission systems.</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
                <h2>Why Choose ArovenTech for Web Development in Lucknow?</h2>
                <ul style={{ marginTop: '1.5rem', color: 'var(--text-dim)', lineHeight: '2' }}>
                    <li>✅ <strong>Affordable Pricing:</strong> Starting @ just Rs.999 - Best rates in Lucknow</li>
                    <li>✅ <strong>Fast Delivery:</strong> Basic websites ready in 24-48 hours</li>
                    <li>✅ <strong>SEO Optimized:</strong> Guaranteed Google ranking for local searches</li>
                    <li>✅ <strong>Mobile Responsive:</strong> Perfect display on all devices</li>
                    <li>✅ <strong>Modern Design:</strong> Latest UI/UX trends and technologies</li>
                    <li>✅ <strong>24x7 Support:</strong> WhatsApp and call support available</li>
                </ul>
            </div>

            <div className="text-center" style={{ marginTop: '3rem' }}>
                <h2>Ready to Get Your Website?</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    Whether you need a simple business website or a complex e-commerce platform, ArovenTech has the expertise to deliver. Contact us today for a free consultation and quote.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/pricing" className="btn-primary">View Pricing</a>
                    <a href="/contact" className="btn-primary">Get Free Quote</a>
                </div>
            </div>
        </main>
    );
}
