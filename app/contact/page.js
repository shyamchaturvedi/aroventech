
export const metadata = {
    title: 'Contact Aroven Tech Lucknow | Web Developer Phone Number | Call 9598023701',
    description: 'Contact Lucknow best website developer in Gomti Nagar. Call 9598023701 for 999 website offer. Visit our IT company office. Available 24x7 for software and app development queries.',
    keywords: 'contact web developer lucknow, software company phone number lucknow, Aroven Tech address gomti nagar, it company contact lucknow, website developer near me lucknow',
    robots: 'index, follow',
    openGraph: {
        title: 'Contact Aroven Tech - Best IT Company in Lucknow',
        description: 'Get in touch for Website, Software & App Development | Call 9598023701 | Gomti Nagar, Lucknow',
    },
};

export default function ContactPage() {
    return (
        <main className="section-padding container" style={{ paddingTop: '120px', minHeight: '60vh' }}>
            <h1 className="text-center">
                Contact <span className="gradient-text">Aroven Tech Lucknow</span>
            </h1>
            <h2 className="text-center" style={{ fontSize: '1.2rem', fontWeight: 'normal', color: 'var(--text-dim)', marginTop: '1rem', marginBottom: '3rem' }}>
                Best Website Developer in Gomti Nagar, Lucknow | Available 24x7
            </h2>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <a href="tel:9598023701" className="btn-primary" style={{ display: 'inline-block', marginRight: '1rem' }}>
                    Call Now: 9598023701
                </a>
                <a href="https://wa.me/919598023701" className="btn-primary" style={{ display: 'inline-block' }}>
                    WhatsApp Chat
                </a>
            </div>

            <div className="text-center" style={{ marginTop: '3rem', maxWidth: '600px', margin: '3rem auto' }}>
                <p style={{ color: 'var(--text-dim)' }}>
                    Visit us at our office in Gomti Nagar, Lucknow or contact us for best website development,
                    software solutions, app development, and digital marketing services.
                    Aroven Tech - Your trusted IT partner in Lucknow.
                </p>
            </div>
        </main>
    );
}
