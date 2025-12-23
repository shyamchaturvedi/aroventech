'use client';
import { useState } from 'react';
import styles from './Navbar.module.css';
import Image from 'next/image';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className={`${styles.navbar} glass`}>
            <div className={`container ${styles.navContent}`}>
                <div className={styles.logoWrapper}>
                    <Image
                        src="/logo.svg"
                        alt="Aroven Tech Icon"
                        width={50}
                        height={50}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                    <span className={styles.logoText}>
                        <span className={styles.logoAroven}>Aroven</span>
                        <span className={styles.logoTech}>Tech</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className={styles.links}>
                    <a href="/" className={styles.link}>Home</a>
                    <a href="/services" className={styles.link}>Services</a>
                    <a href="/portfolio" className={styles.link}>Portfolio</a>
                    <a href="/pricing" className={styles.link}>Pricing</a>
                    <a href="/review" className={styles.link}>Review Us</a>
                    <a href="/about" className={styles.link}>About</a>
                    <a href="/contact" className={styles.link}>Contact</a>
                    <a href="tel:9598023701" className="btn-primary">Call: 9598023701</a>
                </div>

                {/* Hamburger Icon */}
                <button
                    className={styles.hamburger}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className={isOpen ? styles.active : ''}></span>
                    <span className={isOpen ? styles.active : ''}></span>
                    <span className={isOpen ? styles.active : ''}></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                <a href="/" className={styles.mobileLink} onClick={closeMenu}>Home</a>
                <a href="/services" className={styles.mobileLink} onClick={closeMenu}>Services</a>
                <a href="/portfolio" className={styles.mobileLink} onClick={closeMenu}>Portfolio</a>
                <a href="/pricing" className={styles.mobileLink} onClick={closeMenu}>Pricing</a>
                <a href="/about" className={styles.mobileLink} onClick={closeMenu}>About</a>
                <a href="/contact" className={styles.mobileLink} onClick={closeMenu}>Contact</a>
                <a href="tel:9598023701" className="btn-primary" onClick={closeMenu} style={{ marginTop: '1rem' }}>Call: 9598023701</a>
            </div>
        </nav>
    );
}
