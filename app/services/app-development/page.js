export const metadata = {
    title: 'App Development Services in Lucknow | Android & iOS Apps | ArovenTech',
    description: 'Professional mobile app development in Lucknow. Android & iOS apps starting @ Rs.15,000. Best app developers in Gomti Nagar. Flutter, React Native. Call 9598023701',
    keywords: 'app development lucknow, android app developer, ios app development, mobile app company lucknow, flutter developer, react native lucknow',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://aroventech.in/services/app-development'
    },
    openGraph: {
        title: 'Mobile App Development - ArovenTech Lucknow',
        description: 'Android & iOS app development starting @ Rs.15,000. Best in Lucknow',
        url: 'https://aroventech.in/services/app-development',
    },
};

export default function AppDevelopmentPage() {
    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                <span className="gradient-text">Mobile App Development</span> Services in Lucknow
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                ArovenTech provides professional mobile app development services for businesses in Lucknow. We build high-performance Android and iOS apps using modern technologies like Flutter and React Native. From e-commerce apps to business management apps, we deliver solutions that help you reach your customers on mobile.
            </p>

            <div style={{ marginTop: '3rem' }}>
                <h2>Our App Development Services</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Android Apps</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Native and cross-platform Android apps for Google Play Store. Reach millions of users in Lucknow and beyond.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>iOS Apps</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Professional iPhone and iPad apps for Apple App Store. Premium quality for iOS users.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Cross-Platform Apps</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Single codebase for both Android and iOS using Flutter or React Native. Cost-effective solution.</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>E-commerce Apps</h3>
                        <p style={{ color: 'var(--text-dim)' }}>Shopping apps with payment gateway, cart, wishlist, and order tracking for retail businesses in Lucknow.</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
                <h2>Technologies We Use</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--primary)' }}>Flutter</h4>
                        <p style={{ color: 'var(--text-dim)' }}>Google's framework for beautiful cross-platform apps</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary)' }}>React Native</h4>
                        <p style={{ color: 'var(--text-dim)' }}>Facebook's framework for iOS and Android apps</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary)' }}>Native Development</h4>
                        <p style={{ color: 'var(--text-dim)' }}>Kotlin for Android, Swift for iOS</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <h2 className="text-center">Why Choose ArovenTech for App Development?</h2>
                <ul style={{ maxWidth: '700px', margin: '1.5rem auto', color: 'var(--text-dim)', lineHeight: '2' }}>
                    <li>✅ <strong>Experienced Team:</strong> 20+ apps delivered for Lucknow businesses</li>
                    <li>✅ <strong>Affordable Pricing:</strong> Starting @ Rs.15,000 - Best rates in the city</li>
                    <li>✅ <strong>Modern Technologies:</strong> Flutter, React Native, Native development</li>
                    <li>✅ <strong>Complete Support:</strong> From planning to App Store submission</li>
                    <li>✅ <strong>Performance Focused:</strong> Fast, smooth, and bug-free apps</li>
                    <li>✅ <strong>Maintenance:</strong> 1 year free support and updates</li>
                </ul>
            </div>

            <div className="text-center" style={{ marginTop: '3rem' }}>
                <h2>Ready to Build Your Mobile App?</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    Whether you need a simple app for your business or a complex e-commerce platform, ArovenTech is the best mobile app development company in Lucknow. Contact us for a free consultation.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/pricing" className="btn-primary">View Pricing</a>
                    <a href="/contact" className="btn-primary">Get Free Quote</a>
                </div>
            </div>
        </main>
    );
}
