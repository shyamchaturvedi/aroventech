import styles from './Services.module.css';

const services = [
    {
        title: 'Website Development',
        desc: 'Best websites for Business, Portfolios, Hospitals, and Shops.',
        price: 'Starts @ ₹999 Only',
        features: ['Business Website', 'School / Coaching', 'E-commerce / Shop', 'Portfolio Website']
    },
    {
        title: 'Software Development',
        desc: 'Custom software solutions tailored for every business need.',
        features: ['Medical Billing (AroBill)', 'Hotel Management', 'Restaurant Ordering', 'CRM / ERP & Inventory']
    },
    {
        title: 'Mobile App Development',
        desc: 'Native Android & iOS Apps built with the latest technology.',
        features: ['Android App', 'iOS App', 'Custom Business Apps', 'Flutter / React Native']
    },
    {
        title: 'Digital Marketing',
        desc: 'Grow your business with guaranteed Google Ranking & SEO.',
        features: ['Google Search Ranking', 'GMB Setup', 'Social Media Ads', 'Lead Generation']
    }
];

export default function Services() {
    return (
        <section id="services" className={`${styles.services} section-padding`}>
            <div className="container">
                <h2 className="text-center">Our <span className="gradient-text">IT Services</span></h2>
                <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Providing the fastest & most affordable IT solutions in Lucknow. Websites, Apps, and Software all under one roof.
                </p>

                <div className={styles.grid}>
                    {services.map((s, index) => (
                        <div key={index} className={styles.card}>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                            <ul>
                                {s.features.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                            {s.price && <span className={styles.price}>{s.price}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
