import Link from 'next/link';
import styles from './CertificateInternship.module.css';

export const metadata = {
    title: 'Online Certificate & Internship Program | Aroven Tech',
    description: 'Learn Web Development, App Development, Digital Marketing & Software Development. Get Aroven Tech Certificate + Internship + Placement Support.',
    keywords: 'online course, internship program, certificate course, web development training, digital marketing course, software development course lucknow'
};

export default function CertificateInternshipPage() {
    const courses = [
        {
            id: 1,
            title: 'Web Development',
            icon: '🌐',
            duration: '12 Weeks',
            students: '500+',
            coursePrice: '₹2,999',
            internshipPrice: '₹5,999',
            description: 'Master HTML5, CSS3, JavaScript, React.js & Next.js',
            highlights: ['Responsive Design', 'Frontend Framework', 'Backend Basics', '10 Live Projects'],
            whatYouLearn: [
                'HTML5 & CSS3 Fundamentals',
                'JavaScript ES6+',
                'React.js & State Management',
                'Next.js & API Integration',
                'Responsive Web Design',
                'Git & GitHub'
            ]
        },
        {
            id: 2,
            title: 'Mobile App Development',
            icon: '📱',
            duration: '14 Weeks',
            students: '320+',
            coursePrice: '₹3,499',
            internshipPrice: '₹6,999',
            description: 'Build Android & iOS apps with Flutter & React Native',
            highlights: ['Cross-Platform', 'Firebase Integration', 'App Deployment', '8 Real Projects'],
            whatYouLearn: [
                'Dart Programming',
                'Flutter Framework',
                'UI/UX Best Practices',
                'Firebase & Backend',
                'API Integration',
                'App Store Publishing'
            ]
        },
        {
            id: 3,
            title: 'Digital Marketing',
            icon: '📊',
            duration: '10 Weeks',
            students: '450+',
            coursePrice: '₹1,999',
            internshipPrice: '₹4,999',
            description: 'Master SEO, Social Media, Google Ads & Content Marketing',
            highlights: ['SEO Mastery', 'Social Media', 'Google Ads', 'Real Campaigns'],
            whatYouLearn: [
                'SEO & Keyword Research',
                'Google Search Console',
                'Social Media Strategy',
                'Facebook & Instagram Ads',
                'Google Ads Certification',
                'Analytics & Reporting'
            ]
        },
        {
            id: 4,
            title: 'Software Development',
            icon: '⚙️',
            duration: '16 Weeks',
            students: '280+',
            coursePrice: '₹4,499',
            internshipPrice: '₹8,999',
            description: 'Learn C++, Python, Database Design & System Architecture',
            highlights: ['Core Programming', 'Database Design', 'System Design', '12 Projects'],
            whatYouLearn: [
                'C++ & Python Programming',
                'Data Structures & Algorithms',
                'Database Design (SQL)',
                'API Development',
                'System Architecture',
                'Problem Solving'
            ]
        }
    ];

    const internshipBenefits = [
        { icon: '🎓', title: 'Aroven Tech Certificate', desc: 'Recognized Certificate on Completion' },
        { icon: '💼', title: 'Live Projects', desc: 'Work on Real Client Projects' },
        { icon: '👨‍💼', title: 'Mentorship', desc: 'Guidance from Industry Experts' },
        { icon: '📜', title: 'Experience Letter', desc: 'Professional Experience Letter' },
        { icon: '🤝', title: 'Placement Support', desc: 'Job Referrals & Interview Prep' },
        { icon: '💰', title: 'Portfolio Building', desc: 'Showcase Your Skills Online' }
    ];

    const testimonials = [
        {
            name: 'Raj Kumar',
            role: 'Web Developer @ StartUp',
            text: 'The course was incredible! I got placed within 2 weeks of internship completion. Highly recommend!',
            rating: 5
        },
        {
            name: 'Priya Singh',
            role: 'Digital Marketer @ E-commerce',
            text: 'Best investment for my career. Real-world projects made me job-ready immediately.',
            rating: 5
        },
        {
            name: 'Arjun Verma',
            role: 'App Developer @ Tech Company',
            text: 'Mentors were supportive and project-based learning was exactly what I needed.',
            rating: 5
        }
    ];

    return (
        <main className={styles.container}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>🚀 Online Certificate & Internship Program</h1>
                    <p className={styles.subtitle}>
                        Learn industry-ready skills, gain practical experience, and earn Aroven Tech Certificate
                    </p>
                    <p className={styles.highlight}>
                        ✨ Job-Ready Skills • Real Projects • Placement Support • Career Growth
                    </p>
                </div>
            </section>

            {/* Courses Section */}
            <section className={styles.coursesSection}>
                <div className={styles.sectionHeader}>
                    <h2>Choose Your Course</h2>
                    <p>Comprehensive training programs designed for career success</p>
                </div>

                <div className={styles.coursesGrid}>
                    {courses.map((course) => (
                        <div key={course.id} className={styles.courseCard}>
                            <div className={styles.courseIcon}>{course.icon}</div>
                            <h3>{course.title}</h3>
                            <p className={styles.courseDesc}>{course.description}</p>

                            <div className={styles.courseStats}>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>Duration</span>
                                    <span className={styles.statValue}>{course.duration}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>Students</span>
                                    <span className={styles.statValue}>{course.students}</span>
                                </div>
                            </div>

                            <div className={styles.highlights}>
                                {course.highlights.map((h, i) => (
                                    <span key={i} className={styles.highlight}>{h}</span>
                                ))}
                            </div>

                            <div className={styles.whatYouLearn}>
                                <h4>What You'll Learn:</h4>
                                <ul>
                                    {course.whatYouLearn.map((item, i) => (
                                        <li key={i}>✓ {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.pricingOptions}>
                                <div className={styles.priceOption}>
                                    <span className={styles.optionLabel}>Course Only</span>
                                    <span className={styles.price}>{course.coursePrice}</span>
                                </div>
                                <div className={styles.priceOption}>
                                    <span className={styles.optionLabel}>+ Internship</span>
                                    <span className={styles.price}>{course.internshipPrice}</span>
                                </div>
                            </div>

                            <a href={`https://wa.me/919598023701?text=Hi Aroven Tech, I'm interested in ${course.title} course. Please send details.`} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className={styles.enrollBtn}>
                                Enroll Now on WhatsApp
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Internship Benefits */}
            <section className={styles.benefitsSection}>
                <div className={styles.sectionHeader}>
                    <h2>Why Choose Our Internship?</h2>
                    <p>Get real-world experience with industry experts</p>
                </div>

                <div className={styles.benefitsGrid}>
                    {internshipBenefits.map((benefit, i) => (
                        <div key={i} className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>{benefit.icon}</div>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Program Structure */}
            <section className={styles.structureSection}>
                <div className={styles.sectionHeader}>
                    <h2>Program Structure</h2>
                    <p>4-Phase Learning Path to Success</p>
                </div>

                <div className={styles.phases}>
                    <div className={styles.phase}>
                        <div className={styles.phaseNumber}>1</div>
                        <h3>Foundation</h3>
                        <p>Core concepts, fundamentals & theory from industry experts</p>
                    </div>
                    <div className={styles.phase}>
                        <div className={styles.phaseNumber}>2</div>
                        <h3>Hands-On Training</h3>
                        <p>Live coding sessions, practical exercises & assignments</p>
                    </div>
                    <div className={styles.phase}>
                        <div className={styles.phaseNumber}>3</div>
                        <h3>Real Projects</h3>
                        <p>Work on actual client projects during internship phase</p>
                    </div>
                    <div className={styles.phase}>
                        <div className={styles.phaseNumber}>4</div>
                        <h3>Placement Support</h3>
                        <p>Interview prep, resume review & job referrals</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className={styles.testimonialsSection}>
                <div className={styles.sectionHeader}>
                    <h2>Success Stories</h2>
                    <p>From our graduates</p>
                </div>

                <div className={styles.testimonialGrid}>
                    {testimonials.map((t, i) => (
                        <div key={i} className={styles.testimonialCard}>
                            <div className={styles.stars}>
                                {'⭐'.repeat(t.rating)}
                            </div>
                            <p className={styles.testimonialText}>"{t.text}"</p>
                            <div className={styles.testimonialAuthor}>
                                <strong>{t.name}</strong>
                                <span className={styles.role}>{t.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.faqSection}>
                <div className={styles.sectionHeader}>
                    <h2>Frequently Asked Questions</h2>
                </div>

                <div className={styles.faqGrid}>
                    <div className={styles.faqItem}>
                        <h4>📌 Do I need prior coding experience?</h4>
                        <p>No! Our courses are beginner-friendly. We start from scratch and build your skills step by step.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>📌 Is the certificate recognized?</h4>
                        <p>Yes! Aroven Tech Certificate is recognized by leading tech companies and is highly valued by employers.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>📌 What's the job placement rate?</h4>
                        <p>85%+ of our graduates get placed within 3 months. We provide active placement support.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>📌 Can I learn at my own pace?</h4>
                        <p>Yes! All course materials are available 24/7. You can learn anytime, anywhere at your own pace.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>📌 What if I don't complete the course?</h4>
                        <p>Full refund within 7 days if you're not satisfied. No questions asked policy.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>📌 Do you provide internship stipend?</h4>
                        <p>Internship stipends vary based on performance. Top performers get ₹5,000-₹15,000/month.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <h2>Ready to Transform Your Career?</h2>
                <p>Join 1500+ students who've already started their journey with Aroven Tech</p>
                <div className={styles.ctaButtons}>
                    <a href="https://wa.me/919598023701?text=Hi Aroven Tech, I want to know more about your certificate/internship program. Please guide me." 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className={styles.ctaPrimary}>
                        📞 Enquire on WhatsApp
                    </a>
                    <a href="/contact" className={styles.ctaSecondary}>
                        📧 Send Enquiry
                    </a>
                </div>
            </section>

            {/* Footer Info */}
            <section className={styles.footerInfo}>
                <p>🎓 Aroven Tech | Lucknow's #1 IT Training & Solutions Partner</p>
                <p>Certificate • Internship • Placement • Career Growth</p>
            </section>
        </main>
    );
}
