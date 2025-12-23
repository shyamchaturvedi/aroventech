import styles from './Testimonials.module.css';

const reviews = [
    { name: 'Amit Kumar', role: 'Business Owner', text: 'Arvoen Tech made my shop website in 2 days. Very happy with the service.' },
    { name: 'Dr. Sharma', role: 'Clinic Director', text: 'Professional team and great pricing. My clinic appointments have increased.' },
    { name: 'Sarah Khan', role: 'Boutique Owner', text: 'The ₹999 plan is a game changer. Best web developers in Lucknow.' }
];

export default function Testimonials() {
    return (
        <section className={`section-padding ${styles.section}`}>
            <div className="container">
                <h2 className="text-center">What Clients Say <span className="gradient-text">About Us</span></h2>

                <div className={styles.grid}>
                    {reviews.map((r, index) => (
                        <div key={index} className={`${styles.card} animate-fade-up`} style={{ animationDelay: `${index * 0.15}s` }}>
                            <div className={styles.header}>
                                <div className={styles.avatar}>{r.name.charAt(0)}</div>
                                <div>
                                    <h4 className={styles.name}>{r.name}</h4>
                                    <span className={styles.role}>{r.role}</span>
                                </div>
                            </div>
                            <p className={styles.text}>"{r.text}"</p>
                            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                        </div>
                    ))}
                </div>

                <div className="text-center" style={{ marginTop: '3rem' }}>
                    <a href="/review" className="btn-primary">Write a Review ✍️</a>
                </div>
            </div>
        </section>
    );
}
