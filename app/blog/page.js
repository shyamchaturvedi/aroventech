export const metadata = {
    title: 'Blog - Web Development Tips | ArovenTech Lucknow Articles',
    description: 'Latest web development tips, SEO strategies & tech news for Lucknow businesses. Expert articles by ArovenTech team. Stay updated with IT trends!',
    keywords: 'blog, web development tips, seo tips lucknow, technology articles, it news lucknow, aroventech blog',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://aroventech.in/blog'
    },
    openGraph: {
        title: 'ArovenTech Blog - Tech Tips for Lucknow Businesses',
        description: 'Expert articles on website development, SEO, and digital marketing',
        url: 'https://aroventech.in/blog',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tech Blog - ArovenTech Lucknow',
        description: 'Latest articles on web development and IT trends',
    }
};

export default function BlogPage() {
    const articles = [
        {
            title: 'How to Choose the Best Website Developer in Lucknow',
            excerpt: 'Looking for a reliable website developer in Lucknow? Learn the key factors to consider when selecting an IT company for your business website.',
            date: 'December 10, 2024',
            category: 'Web Development'
        },
        {
            title: '999 Website vs Custom Website: Which is Right for Your Business?',
            excerpt: 'Confused between affordable 999 website package and custom development? This guide helps Lucknow businesses make the right choice.',
            date: 'December 8, 2024',
            category: 'Business Tips'
        },
        {
            title: 'Top 10 SEO Tips for Local Businesses in Lucknow',
            excerpt: 'Want your business to rank #1 on Google in Lucknow? Follow these proven SEO strategies specifically for local businesses in Gomti Nagar.',
            date: 'December 5, 2024',
            category: 'SEO & Marketing'
        },
        {
            title: 'Why Every Lucknow Business Needs a Professional Website in 2024',
            excerpt: 'The digital transformation is here. Discover why having a website is crucial for businesses in Lucknow and how it can boost your sales.',
            date: 'December 1, 2024',
            category: 'Business Growth'
        },
    ];

    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                Blog - <span className="gradient-text">Tech Tips & Articles</span>
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                Welcome to the ArovenTech blog! We share expert insights on website development, app development, SEO strategies, and digital marketing specifically for businesses in Lucknow. Stay updated with the latest IT trends and learn how to grow your business online.
            </p>

            <div style={{ maxWidth: '900px', margin: '3rem auto', display: 'grid', gap: '2rem' }}>
                {articles.map((article, idx) => {
                    const slugs = [
                        '/blog/choose-best-website-developer-lucknow',
                        '/blog/999-website-vs-custom-website',
                        '/blog/top-10-seo-tips-local-businesses-lucknow',
                        '/blog/why-lucknow-business-needs-website-2024'
                    ];

                    return (
                        <div key={idx} className="glass" style={{ padding: '2rem', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{article.category}</span>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{article.date}</span>
                            </div>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{article.title}</h2>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>{article.excerpt}</p>
                            <a href={slugs[idx]} className="btn-primary" style={{ display: 'inline-block' }}>
                                Read More →
                            </a>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', textAlign: 'center' }}>
                <h2>Why Read Our Blog?</h2>
                <p style={{ maxWidth: '700px', margin: '1rem auto', color: 'var(--text-dim)' }}>
                    As the best software company in Lucknow with 10+ years of experience, we share practical insights that actually work for local businesses. Our articles are written by developers and digital marketers who understand the Lucknow market. Whether you are a small shop in Gomti Nagar or a large enterprise, you will find valuable tips to improve your online presence and grow your business.
                </p>
                <a href="/contact" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                    Get Free Consultation
                </a>
            </div>
        </main>
    );
}
