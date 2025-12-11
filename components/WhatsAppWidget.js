'use client';
import { useState } from 'react';
import styles from './WhatsAppWidget.module.css';

export default function WhatsAppWidget() {
    const [isHovered, setIsHovered] = useState(false);

    const phoneNumber = '919598023701'; // WhatsApp number with country code
    const message = encodeURIComponent('Hello! I am interested in your services.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Chat on WhatsApp"
        >
            {/* WhatsApp Icon */}
            <svg
                viewBox="0 0 32 32"
                className={styles.icon}
                fill="currentColor"
            >
                <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.956 0-7.444 6.056-13.5 13.5-13.5s13.5 6.056 13.5 13.5-6.056 13.5-13.5 13.5zM21.229 19.036c-0.385-0.193-2.275-1.122-2.627-1.25s-0.608-0.193-0.865 0.193c-0.257 0.385-0.997 1.25-1.222 1.508s-0.45 0.289-0.835 0.096c-0.385-0.193-1.627-0.601-3.098-1.911-1.146-1.022-1.919-2.283-2.144-2.668s-0.024-0.594 0.169-0.786c0.173-0.171 0.385-0.45 0.578-0.674s0.257-0.385 0.385-0.643c0.128-0.257 0.064-0.482-0.032-0.674s-0.865-2.083-1.186-2.852c-0.313-0.75-0.631-0.647-0.865-0.659-0.223-0.012-0.481-0.015-0.737-0.015s-0.673 0.096-1.025 0.482c-0.353 0.385-1.346 1.315-1.346 3.206s1.378 3.718 1.571 3.975c0.193 0.257 2.704 4.129 6.553 5.791 0.915 0.395 1.629 0.631 2.186 0.808 0.919 0.292 1.755 0.251 2.414 0.152 0.737-0.11 2.275-0.929 2.596-1.827s0.321-1.667 0.225-1.827c-0.096-0.161-0.353-0.257-0.737-0.45z" />
            </svg>

            {/* Tooltip */}
            {isHovered && (
                <span className={styles.tooltip}>
                    Chat with us!
                </span>
            )}
        </a>
    );
}
