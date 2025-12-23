import Link from 'next/link';
import styles from './Offer.module.css';

export const metadata = {
    title: 'Lucknow Business Starter Pack @ 999',
    description: 'Get a professional business website for just ₹999. Limited time offer for Lucknow businesses.',
};

export default function SpecialOfferPage() {
    return (
        <main className={styles.container}>
            <div className={styles.hero}>
                <span className={styles.badge}>🔥 LUCKNOW SPECIAL OFFER - 7 DAYS ONLY</span>
                <h1 className={styles.title}>
                    Get Your Business Online <br />
                    <span className={styles.highlight}>For Just ₹999</span>
                </h1>
                <p className={styles.subtitle}>
                    Stop losing customers to your competition. Get a professional Profile Website + QR Code in 24 hours.
                </p>

                <div className={styles.priceBox}>
                    <div className={styles.oldPrice}>₹2,500</div>
                    <div className={styles.price}>₹999/-</div>
                    <Link href="https://wa.me/919598023701?text=Hi%20Aroven%20Tech,%20I%20want%20to%20claim%20the%20999%20Business%20Website%20Offer." className={styles.ctaButton}>
                        👉 CLAIM OFFER NOW
                    </Link>
                    <div className={styles.timer}>⚡ 12 people claimed today!</div>
                </div>
            </div>

            <section className={styles.features}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '10px' }}>What You Get Inside?</h2>
                <div className={styles.grid}>
                    <div className={styles.featureCard}>
                        <span className={styles.icon}>🚀</span>
                        <h3 className={styles.cardTitle}>Professional One-Page Site</h3>
                        <p className={styles.cardText}>Showcase your services, photos, and about section in a premium layout.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <span className={styles.icon}>📍</span>
                        <h3 className={styles.cardTitle}>Google Map Location</h3>
                        <p className={styles.cardText}>Help customers find your shop/office easily with embedded maps.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <span className={styles.icon}>📞</span>
                        <h3 className={styles.cardTitle}>Click-to-Call Button</h3>
                        <p className={styles.cardText}>Customers can call you directly from the website with one tap.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <span className={styles.icon}>📱</span>
                        <h3 className={styles.cardTitle}>Mobile Friendly</h3>
                        <p className={styles.cardText}>Looks perfect on all mobile phones and easy to share on WhatsApp.</p>
                    </div>
                </div>
            </section>

            <section className={styles.trustSection}>
                <div className={styles.guarantee}>
                    <h3>🔒 100% Satisfaction Guarantee</h3>
                    <p>We don't just build websites; we build your business reputation. <br /> Trusted by 50+ Lucknow Businesses.</p>
                </div>
                <div style={{ marginTop: '30px' }}>
                    <Link href="/pricing" style={{ color: '#94a3b8', textDecoration: 'underline' }}>
                        View All Other Plans
                    </Link>
                </div>
            </section>
        </main>
    );
}
