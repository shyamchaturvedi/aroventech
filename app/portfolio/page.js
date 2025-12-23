import Image from 'next/image';

export const metadata = {
    title: 'Portfolio - Aroven Tech Projects | Best Work in Lucknow',
    description: 'View 100+ successful projects by Aroven Tech Lucknow. Website development, app development & software solutions. See our real client work in Gomti Nagar.',
    keywords: 'portfolio, web projects lucknow, case studies, Aroven Tech work, client projects gomti nagar, website examples lucknow',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://Aroven Tech.in/portfolio'
    },
    openGraph: {
        title: 'Aroven Tech Portfolio - 100+ Projects in Lucknow',
        description: 'See our successful website & app projects. Real work by best IT company in Lucknow',
        url: 'https://Aroven Tech.in/portfolio',
        images: [{ url: '/web-development-lucknow.png' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Work - Aroven Tech Lucknow Portfolio',
        description: 'Portfolio of 100+ successful IT projects in Gomti Nagar',
    }
};

export default function PortfolioPage() {
    const projects = [
        { category: 'E-commerce Websites', count: '25+', desc: 'Online shopping platforms for Lucknow retailers' },
        { category: 'Business Websites', count: '40+', desc: 'Corporate websites for companies in Gomti Nagar' },
        { category: 'School Websites', count: '15+', desc: 'Educational institution websites in Lucknow' },
        { category: 'Mobile Apps', count: '20+', desc: 'Android & iOS apps for local businesses' },
    ];

    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                Our Portfolio - <span className="gradient-text">Best Projects in Lucknow</span>
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                Aroven Tech has successfully delivered 100+ projects for businesses across Lucknow and India. As the best software company in Lucknow, we specialize in website development, mobile app development, and custom software solutions. Our portfolio showcases real work for clients in Gomti Nagar, Hazratganj, and across Uttar Pradesh.
            </p>

            {/* Featured Project */}
            <div className="glass animate-fade-up" style={{
                padding: '40px',
                borderRadius: '20px',
                margin: '2rem auto 4rem auto',
                maxWidth: '900px',
                border: '1px solid var(--primary)',
                background: 'linear-gradient(145deg, rgba(16, 16, 16, 0.9) 0%, rgba(30, 10, 50, 0.8) 100%)',
                boxShadow: '0 0 30px rgba(112, 0, 255, 0.15)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{
                        background: 'linear-gradient(90deg, #FF9933, #FFFFFF, #138808)',
                        color: 'black',
                        padding: '6px 16px',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        marginBottom: '20px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}>
                        🚩 LATEST PROJECT
                    </span>
                    <h2 style={{
                        fontSize: '2.5rem',
                        marginBottom: '15px',
                        background: 'linear-gradient(to right, #FF9933, #FFD700)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Shree Ram Rajya Mahayagya 2026
                    </h2>
                    <p style={{ color: '#cbd5e1', marginBottom: '30px', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 30px auto' }}>
                        A grand spiritual website developed for the upcoming Mahayagya. <br />
                        Features: <strong>Fast Loading, Event Gallery, Mobile Friendly & Secure.</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="https://www.sreeramrajyamahayagya2026.com/" target="_blank" className="btn-primary" style={{ padding: '14px 30px', fontSize: '1.1rem' }}>
                            🌐 Visit Live Website
                        </a>
                    </div>
                </div>
            </div>

            <h2 className="text-center" style={{ marginTop: '4rem', marginBottom: '2rem' }}>
                Project Categories - Lucknow IT Services
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                {projects.map((project, idx) => (
                    <div key={idx} className="glass" style={{ padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>{project.count}</h3>
                        <h4 style={{ marginBottom: '1rem' }}>{project.category}</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{project.desc}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', textAlign: 'center' }}>
                <h2>Why Choose Aroven Tech for Your Project?</h2>
                <p style={{ maxWidth: '700px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    We are the most trusted website development company in Lucknow with 10+ years of experience. Every project is delivered with:
                </p>
                <ul style={{ maxWidth: '600px', margin: '1.5rem auto', textAlign: 'left', color: 'var(--text-dim)' }}>
                    <li>✅ Fast delivery (24-48 hours for basic websites)</li>
                    <li>✅ SEO optimization guaranteed (Google ranking)</li>
                    <li>✅ Mobile-friendly responsive design</li>
                    <li>✅ Affordable pricing starting @ Rs.999</li>
                    <li>✅ 24x7 support via WhatsApp and call</li>
                    <li>✅ Money-back guarantee on quality</li>
                </ul>
                <a href="/contact" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                    Start Your Project Now
                </a>
            </div>
        </main>
    );
}
