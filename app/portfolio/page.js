import Image from 'next/image';

export const metadata = {
    title: 'Portfolio - ArovenTech Projects | Best Work in Lucknow',
    description: 'View 100+ successful projects by ArovenTech Lucknow. Website development, app development & software solutions. See our real client work in Gomti Nagar.',
    keywords: 'portfolio, web projects lucknow, case studies, aroventech work, client projects gomti nagar, website examples lucknow',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://aroventech.in/portfolio'
    },
    openGraph: {
        title: 'ArovenTech Portfolio - 100+ Projects in Lucknow',
        description: 'See our successful website & app projects. Real work by best IT company in Lucknow',
        url: 'https://aroventech.in/portfolio',
        images: [{ url: '/web-development-lucknow.png' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Work - ArovenTech Lucknow Portfolio',
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
                ArovenTech has successfully delivered 100+ projects for businesses across Lucknow and India. As the best software company in Lucknow, we specialize in website development, mobile app development, and custom software solutions. Our portfolio showcases real work for clients in Gomti Nagar, Hazratganj, and across Uttar Pradesh.
            </p>

            <div style={{ margin: '3rem auto', maxWidth: '700px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image
                    src="/web-development-lucknow.png"
                    alt="Portfolio Showcase - Best Website Development Projects in Lucknow by ArovenTech"
                    width={1200}
                    height={600}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
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
                <h2>Why Choose ArovenTech for Your Project?</h2>
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
