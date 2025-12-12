export const metadata = {
    title: 'Digital Marketing Services in Lucknow | SEO & Google Ads | Aroven Tech',
    description: 'Best digital marketing agency in Lucknow. SEO services, Google Ads, social media marketing starting @ Rs.5,000/month. Guaranteed ranking in Gomti Nagar. Call 9598023701',
    keywords: 'digital marketing lucknow, seo services lucknow, google ads lucknow, social media marketing, seo company gomti nagar, best digital agency lucknow',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://Aroven Tech.in/services/digital-marketing'
    },
    openGraph: {
        title: 'Digital Marketing Services - Aroven Tech Lucknow',
        description: 'SEO, Google Ads & Social Media Marketing @ Rs.5,000/month',
        url: 'https://Aroven Tech.in/services/digital-marketing',
    },
};

export default function DigitalMarketingPage() {
    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                <span className="gradient-text">Digital Marketing Services</span> in Lucknow
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                Aroven Tech is the leading digital marketing agency in Lucknow, helping businesses grow online through SEO, Google Ads, and social media marketing. We specialize in local SEO for Lucknow businesses, ensuring you rank #1 on Google for your target keywords. Get more customers, more leads, and more sales with our proven digital marketing strategies.
            </p>

            <div style={{ marginTop: '3rem' }}>
                <h2>Our Digital Marketing Services</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>SEO Services</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Guaranteed Google ranking for "best [your business] in Lucknow" searches. On-page, off-page, and technical SEO.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Google Ads (PPC)</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Targeted ads for Lucknow customers. Pay only for clicks. Start getting leads from day 1.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Social Media Marketing</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Facebook, Instagram, LinkedIn marketing. Build brand awareness and engage with customers in Lucknow.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Content Marketing</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Blog writing, video marketing, and content strategy to attract and convert customers.</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
                <h2>Why Local SEO Matters for Lucknow Businesses</h2>
                <p style={{ marginTop: '1rem', color: 'var(--text-dim)', lineHeight: '1.8' }}>
                    When someone in Gomti Nagar searches for "best restaurant near me" or "software company in Lucknow", you want YOUR business to show up first. That's what local SEO does. We optimize your website and Google My Business profile to rank for Lucknow-specific searches. Our proven strategies have helped 50+ local businesses dominate Google search results.
                </p>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <h2 className="text-center">Digital Marketing Package Pricing</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                        <h3>Basic SEO</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '1rem 0' }}>Rs.5,000/month</div>
                        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                            <li>✅ 10 Keywords</li>
                            <li>✅ On-page SEO</li>
                            <li>✅ Monthly reports</li>
                        </ul>
                    </div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '2px solid var(--primary)' }}>
                        <h3>Advanced SEO</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '1rem 0' }}>Rs.10,000/month</div>
                        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                            <li>✅ 20 Keywords</li>
                            <li>✅ On-page + Off-page</li>
                            <li>✅ Google My Business</li>
                            <li>✅ Content writing</li>
                        </ul>
                    </div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                        <h3>Google Ads</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '1rem 0' }}>Rs.8,000/month</div>
                        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                            <li>✅ Campaign setup</li>
                            <li>✅ Ad creation</li>
                            <li>✅ Optimization</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center" style={{ marginTop: '3rem' }}>
                <h2>Ready to Dominate Google Search in Lucknow?</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    Stop losing customers to competitors. Let Aroven Tech, the best digital marketing company in Lucknow, help you rank #1 on Google and grow your business online.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/contact" className="btn-primary">Get Free SEO Audit</a>
                    <a href="tel:9598023701" className="btn-primary">Call: 9598023701</a>
                </div>
            </div>
        </main>
    );
}
