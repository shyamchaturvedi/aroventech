export const metadata = {
    title: 'Client Reviews - ArovenTech Testimonials | Lucknow IT Company',
    description: 'Read 50+ client reviews for ArovenTech. 5-star rated software company in Lucknow. Real testimonials from satisfied customers in Gomti Nagar.',
    keywords: 'reviews, testimonials, client feedback, aroventech reviews, best rated it company lucknow, customer reviews gomti nagar',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://aroventech.in/testimonials'
    },
    openGraph: {
        title: 'Customer Reviews - ArovenTech Best Rated in Lucknow',
        description: '50+ Five-star reviews from happy clients. Read what customers say about us',
        url: 'https://aroventech.in/testimonials',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Testimonials - ArovenTech Client Reviews',
        description: 'Real feedback from satisfied customers in Lucknow',
    }
};

export default function TestimonialsPage() {
    const testimonials = [
        {
            name: 'Rajesh Kumar',
            business: 'Lucknow Retail Store',
            rating: 5,
            text: 'Best website developer in Lucknow! Got my e-commerce website in just 2 days at Rs.999. Sales increased by 200%. Highly recommend ArovenTech!'
        },
        {
            name: 'Priya Sharma',
            business: 'Coaching Institute, Gomti Nagar',
            rating: 5,
            text: 'Excellent service! They built our school management software with student portal. Professional team, affordable prices, and great support.'
        },
        {
            name: 'Amit Verma',
            business: 'Restaurant Owner',
            rating: 5,
            text: 'ArovenTech created our online ordering app. Now we get orders from all over Lucknow. Best IT company in the city!'
        },
        {
            name: 'Neha Gupta',
            business: 'Fashion Boutique',
            rating: 5,
            text: 'Got a beautiful website with payment integration. Customer service is amazing. Available 24x7 on WhatsApp. Thank you Aron Tech team!'
        },
    ];

    return (
        <main className="section-padding container" style={{ paddingTop: '120px' }}>
            <h1 className="text-center">
                Client Reviews - <span className="gradient-text">What Lucknow Says About Us</span>
            </h1>

            <p className="text-center" style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                ArovenTech is proud to be the highest-rated software company in Lucknow with 50+ five-star reviews. Our clients from Gomti Nagar, Hazratganj, and across Uttar Pradesh trust us for website development, app development, and IT solutions. Read real testimonials from businesses we have helped grow digitally.
            </p>

            <div style={{ maxWidth: '900px', margin: '3rem auto', display: 'grid', gap: '2rem' }}>
                {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="glass" style={{ padding: '2rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.3rem' }}>{testimonial.name}</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{testimonial.business}</p>
                            </div>
                            <div style={{ color: 'gold', fontSize: '1.5rem' }}>
                                {'⭐'.repeat(testimonial.rating)}
                            </div>
                        </div>
                        <p style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>"{testimonial.text}"</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', textAlign: 'center' }}>
                <h2>Why Clients Choose ArovenTech - Lucknow Best IT Company</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>100+</h3>
                        <p>Happy Clients</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>10+</h3>
                        <p>Years Experience</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>5⭐</h3>
                        <p>Average Rating</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>24x7</h3>
                        <p>Support Available</p>
                    </div>
                </div>
                <p style={{ maxWidth: '700px', margin: '2rem auto', color: 'var(--text-dim)' }}>
                    Our commitment to quality and customer satisfaction has made us the most trusted software company in Lucknow. We deliver on time, provide excellent support, and ensure every client gets the best value for their investment.
                </p>
                <a href="/contact" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Become Our Next Success Story
                </a>
            </div>
        </main>
    );
}
