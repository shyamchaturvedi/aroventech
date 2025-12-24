import styles from './Contact.module.css';

export default function Contact() {
    return (
        <footer id="contact" className={`${styles.footer} section-padding`}>
            <div className="container">
                <div className={styles.contactGrid}>
                    <div className={styles.column}>
                        <h3>Contact Us</h3>
                        <div className={styles.infoItem}>
                            <strong>📍 Address:</strong><br />
                            Aroven Tech Software Solutions<br />
                            Gomti Nagar, Lucknow<br />
                            Uttar Pradesh - 226010<br />
                            India
                        </div>
                        <div className={styles.infoItem}>
                            <strong>📞 Call:</strong> <a href="tel:9598023701" style={{ color: 'var(--primary)' }}>9598023701</a>
                        </div>
                        <div className={styles.infoItem}>
                            <strong>📧 Email:</strong> <a href="mailto:info@aroventech.site" style={{ color: 'var(--primary)' }}>info@aroventech.site</a>
                        </div>
                        <div className={styles.infoItem}>
                            <strong>🕐 Hours:</strong><br />
                            Monday - Saturday: 9:00 AM - 8:00 PM<br />
                            Sunday: Closed
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: '500' }}>
                            🌐 Service Available: Pan India + Lucknow Local Support
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h3>Find Us on Map</h3>
                        <div style={{ width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.2891234567890!2d80.9462!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUwJzQ4LjEiTiA4MMKwNTYnNDYuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Aroven Tech Office Location - Gomti Nagar, Lucknow"
                            ></iframe>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                            📍 Located in Gomti Nagar - Lucknow's Premium IT Hub<br />
                            Easy access from all parts of Lucknow
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
                        <span className={styles.tag}>Aroven Tech lucknow</span>
                    </div>
                </div>

                <div className={styles.copyright}>
                    Aroven Tech – Lucknow’s Best Software & Website Development Company – 999 Offer Available
                </div>
            </div>
        </footer>
    );
}
