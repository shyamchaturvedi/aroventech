import styles from './WhyChoose.module.css';

const reasons = [
    { icon: '⭐', title: '10+ Years Experience', desc: 'Trusted by 100+ businesses' },
    { icon: '🚀', title: 'Fastest Delivery', desc: 'Get website in 24-48 hours' },
    { icon: '📈', title: 'SEO Guaranteed', desc: 'Rank #1 on Google Search' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Modern responsive designs' },
    { icon: '💬', title: '24x7 Support', desc: 'WhatsApp & Call Support' },
    { icon: '💰', title: 'Best Price', desc: 'Starting @ just ₹999' },
];

export default function WhyChoose() {
    return (
        <section className="section-padding container">
            <h2 className="text-center">Why Choose <span className="gradient-text">ArovenTech?</span></h2>
            <div className={styles.features}>
                {reasons.map((r, index) => (
                    <div key={index} className={styles.feature}>
                        <span className={styles.icon}>{r.icon}</span>
                        <h4>{r.title}</h4>
                        <p>{r.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
