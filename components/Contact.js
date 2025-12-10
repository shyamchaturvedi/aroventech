import styles from './Contact.module.css';

export default function Contact() {
    return (
        <footer id="contact" className={`${styles.footer} section-padding`}>
            <div className="container">
                <div className={styles.contactGrid}>
                    <div className={styles.column}>
                        <h3>Contact Us</h3>
                        <div className={styles.infoItem}>
                            <strong>Address:</strong> Gomti Nagar, Lucknow
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Call:</strong> <a href="tel:9598023701" style={{ color: 'white' }}>9598023701</a>
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Email:</strong> info@aroventech.in
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>
                            Service Available: Pan India + Lucknow Local Support
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h3>Quick Links</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="/" className={styles.infoItem}>Home</a>
                            <a href="/services" className={styles.infoItem}>Services</a>
                            <a href="/portfolio" className={styles.infoItem}>Portfolio</a>
                            <a href="/pricing" className={styles.infoItem}>Pricing</a>
                            <a href="/testimonials" className={styles.infoItem}>Testimonials</a>
                            <a href="/faq" className={styles.infoItem}>FAQ</a>
                            <a href="/blog" className={styles.infoItem}>Blog</a>
                            <a href="/about" className={styles.infoItem}>About Us</a>
                        </div>
                    </div>
                </div>

                <div className={styles.seoBlock}>
                    <h4>Top IT Services in Lucknow</h4>
                    <div className={styles.tags}>
                        <span className={styles.tag}>best software company in lucknow |</span>
                        <span className={styles.tag}>best website development company in lucknow |</span>
                        <span className={styles.tag}>lucknow website developer |</span>
                        <span className={styles.tag}>gomti nagar website development |</span>
                        <span className={styles.tag}>affordable website in lucknow |</span>
                        <span className={styles.tag}>999 website in lucknow |</span>
                        <span className={styles.tag}>website maker in lucknow |</span>
                        <span className={styles.tag}>IT company near me lucknow |</span>
                        <span className={styles.tag}>app development company lucknow |</span>
                        <span className={styles.tag}>aroventech lucknow</span>
                    </div>
                </div>

                <div className={styles.copyright}>
                    ArovenTech – Lucknow’s Best Software & Website Development Company – 999 Offer Available
                </div>
            </div>
        </footer>
    );
}
