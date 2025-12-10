import About from '@/components/About';
import Image from 'next/image';

export const metadata = {
    title: 'About ArovenTech | Best Software Company in Lucknow | Our Team & Leadership',
    description: 'Meet the team behind Lucknow fastest growing IT company. CEO Mr. Shyam Chaturvedi and Director Mr. Gaurav Yadav leading ArovenTech in Gomti Nagar. Serving 100+ clients across India with best website and software solutions.',
    keywords: 'about aroventech, shyam chaturvedi ceo, gaurav yadav director, best it team in lucknow, gomti nagar it office, software company profile lucknow, lucknow it company',
    robots: 'index, follow',
    openGraph: {
        title: 'About ArovenTech Lucknow - Best IT Company Team',
        description: 'Leading Software & Website Development Company in Gomti Nagar, Lucknow | 100+ Happy Clients',
    },
};

export default function AboutPage() {
    return (
        <main className="section-padding container">
            <h1 className="text-center" style={{ marginTop: '80px' }}>
                About <span className="gradient-text">ArovenTech Lucknow</span>
            </h1>

            {/* Office Image - SEO Optimized Alt */}
            <div style={{ margin: '2rem auto', maxWidth: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <Image
                    src="/aroven-office-team.png"
                    alt="Technical Team of Best Software Company in Lucknow - ArovenTech Gomti Nagar Office"
                    width={1200}
                    height={600}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            <div className="text-center" style={{ marginTop: '3rem', fontSize: '1.2rem', color: 'var(--text-dim)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Lucknow Premier Website & Software Development Company
                </h2>
                <p style={{ maxWidth: '800px', margin: '0 auto' }}>
                    ArovenTech is Lucknow premier software and website development company, headquartered in Gomti Nagar.
                    We are dedicated to providing the fastest, most affordable, and high-quality IT solutions to businesses across India.
                    With over 10+ years of experience, we have successfully transformed 100+ businesses digitally.
                    Best website developer in Lucknow with guaranteed Google ranking.
                </p>
            </div>

            {/* Leadership Section */}
            <div style={{ marginTop: '4rem' }}>
                <h2 className="text-center" style={{ marginBottom: '3rem' }}>
                    Our <span className="gradient-text">Leadership Team</span>
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>

                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Mr. Shyam Chaturvedi</h3>
                        <p style={{ color: 'white', fontWeight: 'bold' }}>CEO & Founder</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                            Visionary leader focused on innovation and excellence in IT sector. Leading ArovenTech to become the best software company in Lucknow.
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Mr. Gaurav Yadav</h3>
                        <p style={{ color: 'white', fontWeight: 'bold' }}>Director</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                            Driving operational efficiency and strategic growth for ArovenTech. Expert in software development and digital transformation.
                        </p>
                    </div>

                </div>
            </div>

            <div className="text-center" style={{ marginTop: '4rem' }}>
                <h2>Our Mission - Digital Lucknow</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    To empower every business in Lucknow, from Gomti Nagar to Hazratganj, with their own professional digital presence.
                    We believe in quality, affordability, and trust. Making Lucknow businesses online with best website development services.
                </p>
            </div>
        </main>
    );
}
