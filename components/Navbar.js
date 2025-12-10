import styles from './Navbar.module.css';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className={`${styles.navbar} glass`}>
            <div className={`container ${styles.navContent}`}>
                <div className={styles.logoWrapper}>
                    <Image
                        src="/logo.svg"
                        alt="ArovenTech Logo"
                        width={220}
                        height={60}
                        style={{ objectFit: 'contain', height: '50px', width: 'auto' }}
                        priority
                    />
                </div>
                <div className={styles.links}>
                    <a href="/" className={styles.link}>Home</a>
                    <a href="/services" className={styles.link}>Services</a>
                    <a href="/portfolio" className={styles.link}>Portfolio</a>
                    <a href="/pricing" className={styles.link}>Pricing</a>
                    <a href="/about" className={styles.link}>About</a>
                    <a href="/contact" className={styles.link}>Contact</a>
                    <a href="tel:9598023701" className="btn-primary">Call: 9598023701</a>
                </div>
            </div>
        </nav>
    );
}
