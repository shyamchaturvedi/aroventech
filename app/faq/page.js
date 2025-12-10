export const metadata = {
    title: 'FAQ - Common Questions | ArovenTech Website Development Lucknow',
    description: 'Common questions about website development in Lucknow answered. ArovenTech FAQ on pricing, process, timeline & technology. Get instant answers!',
    keywords: 'faq, website development questions, how to get website, website cost, aroventech questions, lucknow web developer faq',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://aroventech.in/faq'
    },
    openGraph: {
        title: 'Frequently Asked Questions - ArovenTech Lucknow',
        description: 'Get answers to common questions about website and app development',
        url: 'https://aroventech.in/faq',
    },
    twitter: {
        card: 'summary',
        title: 'FAQ - ArovenTech Lucknow',
        description: 'Common questions answered about IT services',
    }
};

export default function FAQPage() {
    const faqs = [
        {
            question: 'What is included in the 999 website package?',
            answer: 'The Rs.999 website package includes 3-5 pages, mobile responsive design, basic SEO optimization, 1 year free domain, and WhatsApp support. Perfect for small businesses in Lucknow looking for an affordable online presence.'
        },
        {
            question: 'How long does it take to build a website?',
            answer: 'Basic websites (999 package) are delivered in 24-48 hours. Business websites take 5-7 days. E-commerce websites take 10-15 days. We are the fastest website development company in Lucknow.'
        },
        {
            question: 'Do you provide SEO services?',
            answer: 'Yes! All our websites come with basic SEO optimization. We also offer advanced SEO packages starting @ Rs.5,000/month with guaranteed Google ranking for Lucknow-based searches.'
        },
        {
            question: 'Can I update the website myself after it is built?',
            answer: 'Absolutely! We provide an easy-to-use admin panel where you can update content, images, and products yourself. We also provide training and 24x7 support via WhatsApp.'
        },
        {
            question: 'Do you develop mobile apps?',
            answer: 'Yes, we develop Android and iOS apps using Flutter and React Native. Pricing starts @ Rs.15,000. We have developed 20+ apps for businesses in Lucknow.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept bank transfer, UPI, credit/debit cards, and cash payments at our Gomti Nagar office. 50% advance required to start work, 50% on delivery.'
        },
        {
            question: 'Do you offer support after website delivery?',
            answer: 'Yes! All packages include 6 months to 1 year of free support. We are available 24x7 on WhatsApp (9598023701) for any queries or issues. Best customer service in Lucknow IT industry.'
        },
        {
            question: 'Can you redesign my existing website?',
            answer: 'Yes, we offer website redesign services starting @ Rs.3,000. We can modernize your old website with new design, better speed, and improved SEO.'
        },
        {
            question: 'Do you work with clients outside Lucknow?',
            answer: 'Yes! While we are based in Gomti Nagar, Lucknow, we serve clients across India. We handle everything remotely via video calls, WhatsApp, and email. Local clients can visit our office.'
        },
        {
            question: 'What makes ArovenTech the best software company in Lucknow?',
            answer: 'We combine 10+ years of experience, affordable pricing (999 website offer), fast delivery, guaranteed SEO ranking, and excellent customer support. 100+ satisfied clients and 5-star reviews prove our commitment to quality.'
        },
    ];

    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                Frequently Asked Questions - <span className="gradient-text">ArovenTech Lucknow</span>
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                Got questions about website development, app development, or IT services in Lucknow? Find answers to the most common questions asked by our clients. ArovenTech is committed to transparency and customer satisfaction.
            </p>

            <div style={{ maxWidth: '900px', margin: '3rem auto' }}>
                {faqs.map((faq, idx) => (
                    <div key={idx} className="glass" style={{ padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{idx + 1}. {faq.question}</h3>
                        <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>{faq.answer}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', textAlign: 'center' }}>
                <h2>Still Have Questions?</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    Our team is available 24x7 to answer any questions you may have about our services, pricing, or process. Contact us via WhatsApp, call, or visit our office in Gomti Nagar, Lucknow.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="tel:9598023701" className="btn-primary">
                        Call: 9598023701
                    </a>
                    <a href="https://wa.me/919598023701" className="btn-primary">
                        WhatsApp Chat
                    </a>
                    <a href="/contact" className="btn-primary">
                        Visit Office
                    </a>
                </div>
            </div>
        </main>
    );
}
