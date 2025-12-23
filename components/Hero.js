import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section id="home" className={styles.hero}>
            <div className={`container ${styles.content}`}>
                <div className={`${styles.badge} animate-fade-up`}>Lucknow's No.1 IT Company</div>

                <h1 className={`${styles.title} animate-fade-up delay-100`}>
                    Transforming Business with <br />
                    <span className="gradient-text">Next-Gen Websites</span>
                </h1>

                <p className={`${styles.subtitle} animate-fade-up delay-200`}>
                    Get a premium business website that brings customers. <br />
                    Starting at just <strong>₹999</strong> for local Lucknow shops.
                </p>

                <div className={`${styles.buttons} animate-fade-up delay-300`}>
                    <a href="/special-offer" className="btn-primary">🔥 Claim ₹999 Offer</a>
                    <a href="tel:9598023701" className={styles.btnSecondary}>📞 Call: 9598023701</a>
                    <a href="/services" className={styles.btnSecondary}>View Services</a>
                </div>
            </div>
        </section>
    );
}
