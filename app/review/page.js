'use client';

import { useState, useEffect } from 'react';
import styles from './review.module.css';

const REVIEWS = [
    "Aroven Tech provided excellent service! My website was delivered on time and looks fantastic. Highly recommended for anyone in Lucknow looking for web development.",
    "Best software company I've worked with. The team is very professional, responsive, and they truly understand client needs. 5 stars!",
    "Great experience with Aroven Tech. They created a stunning website for my business that has already helped me get more customers. Thank you!",
    "Very professional and affordable web development services. I am completely satisfied with the quality of work and support provided.",
    "Amazing team! They transformed my ideas into a beautiful reality. If you need a website, Aroven Tech is the place to go.",
    "Fast, reliable, and high-quality service. The developers are skilled and very helpful. I highly recommend Aroven Tech.",
    "I'm impressed by the attention to detail and creativity shown by the Aroven Tech team. My new site is exactly what I wanted.",
    "Top-notch website development in Lucknow. Great pricing and even better service. Keep up the good work!",
    "Excellent support and maintenance services. They are always available to help whenever I have issues with my site.",
    "Truly the best web developers in the city. Professionalism at its peak. Love my new website!",
];

export default function ReviewPage() {
    const [review, setReview] = useState('');
    const [copied, setCopied] = useState(false);

    // Generate random review on mount
    useEffect(() => {
        generateReview();
    }, []);

    const generateReview = () => {
        const randomReview = REVIEWS[Math.floor(Math.random() * REVIEWS.length)];
        setReview(randomReview);
        setCopied(false);
    };

    const handleCopyAndRedirect = () => {
        navigator.clipboard.writeText(review).then(() => {
            setCopied(true);
            // Small delay to show "Copied!" feedback before redirecting
            setTimeout(() => {
                window.open('https://search.google.com/local/writereview?placeid=ChIJI1SRcQDjmzkRIvk0ismD6As', '_blank');
            }, 800);
        });
    };

    return (
        <main className={styles.container}>
            <div className={`${styles.card} glass`}>
                <h1 className={`${styles.title} gradient-text`}>Rate Us!</h1>
                <p className={styles.description}>
                    We appreciate your support. We've generated a review for you based on our top feedback!
                </p>

                <div className={`${styles.reviewBox} ${styles.animate}`} key={review}>
                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    <p className={styles.reviewText}>"{review}"</p>
                </div>

                <div className={styles.controls}>
                    <button onClick={generateReview} className={styles.btnSecondary}>
                        🔄 Try Another
                    </button>
                    <button onClick={handleCopyAndRedirect} className="btn-primary">
                        {copied ? '✅ Copied! Redirecting...' : '📋 Copy Text & Go to Review'}
                    </button>
                </div>

                <p className={styles.step}>
                    Step 1: Click "Copy & Go" <br />
                    Step 2: Paste the text & click Post on Google!
                </p>
            </div>
        </main>
    );
}
