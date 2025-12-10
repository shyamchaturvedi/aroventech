export const metadata = {
    title: 'Pricing - 999 Website Offer | ArovenTech Lucknow Packages',
    description: 'Get professional website @ Rs.999 in Lucknow. View all ArovenTech pricing packages for website, app & software development. Call 9598023701 now!',
    keywords: '999 website lucknow, website price lucknow, affordable web development, pricing packages, cheap website gomti nagar, website cost lucknow',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://aroventech.in/pricing'
    },
    openGraph: {
        title: '999 Website Offer - ArovenTech Lucknow Pricing',
        description: 'Affordable website packages starting @ Rs.999. Best IT company pricing in Lucknow',
        url: 'https://aroventech.in/pricing',
    },
    twitter: {
        card: 'summary_large_image',
        title: '999 Website Package - ArovenTech Lucknow',
        description: 'Most affordable website development in Lucknow. Starting @ Rs.999',
    }
};

export default function PricingPage() {
    const packages = [
        {
            name: '999 Basic Website',
            price: '₹999',
            features: ['3-5 Pages', 'Mobile Responsive', 'Basic SEO', '1 Year Domain Free', 'WhatsApp Support'],
            popular: true
        },
        {
            name: 'Business Website',
            price: '₹4,999',
            features: ['10-15 Pages', 'Advanced SEO', 'Contact Forms', 'Google Maps', 'Social Media Integration', '6 Months Support'],
            popular: false
        },
        {
            name: 'E-commerce Website',
            price: '₹9,999',
            features: ['Unlimited Products', 'Payment Gateway', 'Inventory Management', 'Order Tracking', 'Admin Panel', '1 Year Support'],
            popular: false
        },
    ];

    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                Pricing - <span className="gradient-text">999 Website Offer in Lucknow</span>
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                ArovenTech offers the most affordable website development packages in Lucknow. Our famous Rs.999 website offer is perfect for small businesses, shops, and startups in Gomti Nagar. Get a professional website with SEO optimization, mobile-friendly design, and fast delivery. Best prices guaranteed from the top-rated software company in Lucknow.
            </p>

            <h2 className="text-center" style={{ marginTop: '3rem' }}>
                Our Website Packages - Best Prices in Lucknow
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                {packages.map((pkg, idx) => (
                    <div key={idx} className="glass" style={{ padding: '2rem', borderRadius: '16px', border: pkg.popular ? '2px solid var(--primary)' : 'none', position: 'relative' }}>
                        {pkg.popular && (
                            <span style={{ position: 'absolute', top: '-10px', right: '20px', background: 'var(--primary)', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                                MOST POPULAR
                            </span>
                        )}
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{pkg.name}</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            {pkg.price}
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {pkg.features.map((feature, i) => (
                                <li key={i} style={{ padding: '0.5rem 0', color: 'var(--text-dim)' }}>
                                    ✅ {feature}
                                </li>
                            ))}
                        </ul>
                        <a href="/contact" className="btn-primary" style={{ marginTop: '2rem', display: 'block', textAlign: 'center' }}>
                            Order Now
                        </a>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
                <h2>Additional Services - Lucknow IT Solutions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--primary)' }}>Mobile App Development</h4>
                        <p style={{ color: 'var(--text-dim)' }}>Starting @ ₹15,000 - Android & iOS apps</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary)' }}>Software Development</h4>
                        <p style={{ color: 'var(--text-dim)' }}>Starting @ ₹10,000 - Custom software solutions</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary)' }}>Digital Marketing</h4>
                        <p style={{ color: 'var(--text-dim)' }}>Starting @ ₹5,000/month - SEO & Google Ads</p>
                    </div>
                </div>
            </div>

            <div className="text-center" style={{ marginTop: '3rem' }}>
                <h3>Why Our Pricing is the Best in Lucknow?</h3>
                <p style={{ maxWidth: '700px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    We believe in transparency and affordability. Unlike other expensive software companies in Lucknow, ArovenTech provides enterprise-quality work at prices that small businesses can afford. Our 999 website package is perfect for startups, while our premium packages cater to established businesses. Located in Gomti Nagar, we serve clients across India with local support.
                </p>
                <a href="tel:9598023701" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                    Call for Custom Quote: 9598023701
                </a>
            </div>
        </main>
    );
}
