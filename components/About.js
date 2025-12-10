import styles from './Services.module.css';

export default function About() {
    return (
        <section id="about" className="section-padding container">
            <div className={styles.card} style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>About <span className="gradient-text">ArovenTech</span></h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                    "ArovenTech is a leading software & web development company headquartered in Gomti Nagar, Lucknow.
                    We provide the fastest & most affordable IT solutions. Trusted by over 100+ businesses."
                </p>
            </div>
        </section>
    );
}
