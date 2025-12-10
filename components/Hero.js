import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section id="home" className={styles.hero}>
            <div className={`container ${styles.content}`}>
                <div className={styles.badge}>Lucknow No.1 IT Company</div>
                <h1 className={styles.title}>
                    ArovenTech - Lucknow Best <br />
                    <span className="gradient-text">Software & Website Development Company</span>
                </h1>
                <p className={styles.subtitle}>
                    999 Website Offer in Lucknow | Fast Delivery | High SEO Ranking Guaranteed |
                    Best IT Company in Gomti Nagar, Lucknow | Affordable Website Developer Near Me
                </p>
                <div className={styles.buttons}>
                    <a href="/contact" className="btn-primary">Get Website @ Rs.999</a>
                    <a href="tel:9598023701" className={styles.btnSecondary}>Call Now: 9598023701</a>
                    <a href="/services" className={styles.btnSecondary}>View Our Services</a>
                </div>
            </div>
        </section>
    );
}
