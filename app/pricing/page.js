
import Link from 'next/link';
import styles from './Pricing.module.css';

export const metadata = {
    title: 'Web Pricing Catalog | Aroven Tech Lucknow',
    description: 'Complete pricing catalog for Website Development, Apps, and SEO services in Lucknow. Plans starting from ₹199 to ₹14,499. No hidden costs.',
    keywords: 'website pricing lucknow, web development cost, cheap website lucknow, seo packages pricing, app development cost lucknow',
};

export default function PricingPage() {
    const tiers = [
        {
            title: "Personal & Micro (Best Sellers)",
            plans: [
                {
                    name: "Digital Biz Card OR Linktree",
                    price: "₹199",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["3-5 Page Layout", "\"Save to Contacts\" Button", "Social Media Links", "No Monthly Fees"]
                },
                {
                    name: "Student Resume OR CV",
                    price: "₹299",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["Detailed Multi-Section Profile", "Download PDF Option", "Shareable Link for HR", "Fast React/HTML Code"]
                },
                {
                    name: "Event Invite OR Wish Site",
                    price: "₹399",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["Wedding / Birthday / Anniversary", "Unlimited Photo Gallery", "Date, Time & Google Map", "RSVP via WhatsApp"]
                },
                {
                    name: "Frontend JS Website",
                    price: "₹699",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["10-15 Page Custom Design", "React.js or Pure HTML5", "Contact Form", "Animations Included"],
                    highlightName: true
                }
            ]
        },
        {
            title: "Business Starter (Static)",
            plans: [
                {
                    name: "Cafe / Hotel Menu (QR)",
                    price: "₹799",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["Digital QR Menu", "Unlimited Item Categories", "No Commission Fees", "Direct WhatsApp Order"]
                },
                {
                    name: "Landing Page Pro",
                    price: "₹899",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["Long-Scroll + 5 Support Pages", "High Conversion Design", "FAQ & Testimonials", "Lead Capture Form"]
                },
                {
                    name: "Doctor OR CA OR Lawyer",
                    price: "₹999",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["15-Page Professional Portfolio", "Appointment Booking Link", "Clinic/Office Location Map", "Trust Building Layout"]
                },
                {
                    name: "Creative Portfolio",
                    price: "₹1,199",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["Photographer / Model / Artist", "Unlimited Masonry Gallery", "Dark Mode Aesthetics", "Insta/YouTube Integration"]
                },
                {
                    name: "Service Intro (Gym/Repair)",
                    price: "₹1,499",
                    period: "/ one-time",
                    hostFree: true,
                    features: ["15-20 Page Info Site", "Pricing Tables", "Team Section", "Enquiry Form"]
                }
            ]
        },
        {
            title: "Dynamic Business (Admin Panel)",
            plans: [
                {
                    name: "Blogger OR Writer",
                    price: "₹2,249",
                    period: "/ year",
                    hostPaid: true,
                    features: ["CREATE UNLIMITED PAGES", "Admin Panel to Write Posts", "Categories & Comments", "SEO Friendly Structure"]
                },
                {
                    name: "News Portal",
                    price: "₹3,249",
                    period: "/ year",
                    hostPaid: true,
                    features: ["UNLIMITED News Articles", "Breaking News Ticker", "AdSense / Ad Space Ready", "Reporter Login"]
                },
                {
                    name: "NGO OR Charity Trust",
                    price: "₹3,749",
                    period: "/ year",
                    hostPaid: true,
                    features: ["UNLIMITED Event Galleries", "Donation Gateway (QR/UPI)", "Volunteer Registration", "Annual Reports Section"]
                },
                {
                    name: "School OR Coaching CMS",
                    price: "₹4,249",
                    period: "/ year",
                    hostPaid: true,
                    features: ["UNLIMITED Student Records", "Notice Board System", "Student Results Page", "Teacher Profiles"]
                }
            ]
        },
        {
            title: "Commercial & High-End",
            plans: [
                {
                    name: "Real Estate OR Broker",
                    price: "₹5,499",
                    period: "/ year",
                    hostPaidPro: true,
                    features: ["UNLIMITED Property Listings", "Image Sliders", "Agent Profiles", "Search Filters"]
                },
                {
                    name: "Travel & Ticket Agency",
                    price: "₹6,499",
                    period: "/ year",
                    hostPaidPro: true,
                    features: ["UNLIMITED Tour Packages", "Call-to-Book Integration", "Taxi / Car Rental Form", "Trip Enquiry Management"]
                },
                {
                    name: "Shop Lite (WhatsApp)",
                    price: "₹7,499",
                    period: "/ year",
                    hostPaidPro: true,
                    features: ["UNLIMITED Product Catalog", "Cart to WhatsApp Checkout", "No Payment Gateway Fees", "Easy Admin Panel"]
                },
                {
                    name: "Political Leader Brand",
                    price: "₹6,749",
                    period: "/ year",
                    hostPaidPro: true,
                    features: ["UNLIMITED Campaign Posts", "Election Portfolio", "Supporter Registration", "Social Media Feed"]
                },
                {
                    name: "Directory OR Classifieds",
                    price: "₹9,499",
                    period: "/ year",
                    hostPaidPro: true,
                    features: ["UNLIMITED Listings", "User Registration & Post", "Category Search", "Paid Listing Slots"]
                },
                {
                    name: "Full E-Commerce",
                    price: "₹10,499",
                    period: "/ year",
                    hostPaidPro: true,
                    features: ["UNLIMITED Products & Orders", "Razorpay / Stripe Integration", "User Login System", "Inventory Management"]
                },
                {
                    name: "LMS (Course Selling)",
                    price: "₹14,499",
                    period: "/ year",
                    hostPaidPro: true,
                    features: ["UNLIMITED Courses & Videos", "Student Dashboard", "Secure Video Player", "Payment Gateway"]
                }
            ]
        },
        {
            title: "Software & Apps (Subscriptions)",
            plans: [
                {
                    name: "Offline PC Software",
                    price: "₹999",
                    period: "/ year",
                    features: ["Medical Billing OR Hotel OR POS", "Runs on Windows / MacOS", "No Internet Required (Offline DB)", "Fast Bill Printing"],
                    accentStyle: "var(--highlight)",
                    badge: "DESKTOP",
                    badgeColor: "var(--highlight)",
                    cardStyle: { borderColor: 'var(--highlight)', background: '#150f1f' }
                },
                {
                    name: "Android App (Flutter)",
                    price: "₹2,499",
                    period: "/ year",
                    features: ["E-com OR News OR Booking App", "Android (.apk / Play Store ready)", "Push Notifications", "Smooth UI Performance"],
                    accentStyle: "var(--success)",
                    badge: "MOBILE",
                    badgeColor: "var(--success)",
                    cardStyle: { borderColor: 'var(--success)', background: '#0f1d18' }
                }
            ]
        },
        {
            title: "SEO & Digital Marketing",
            plans: [
                {
                    name: "Basic SEO Setup",
                    price: "₹999",
                    period: "/ one-time",
                    features: ["Google Search Console Setup", "Robots.txt & Sitemap Submission", "Basic Keyword Research", "Speed Optimization"],
                    cardStyle: { borderColor: 'var(--seo-border)' },
                    btnStyle: { background: 'var(--seo-border)', color: '#000' }
                },
                {
                    name: "Local SEO / GMB",
                    price: "₹2,499",
                    period: "/ one-time",
                    features: ["Google Map Ranking Boost", "Business Profile Optimization", "Review Management Strategy", "Local Keywords Targeting"],
                    cardStyle: { borderColor: 'var(--seo-border)' },
                    btnStyle: { background: 'var(--seo-border)', color: '#000' }
                },
                {
                    name: "Pro Marketing Retainer",
                    price: "₹4,999",
                    period: "/ month",
                    features: ["Guaranteed Ranking Improvement", "4 Blog Posts / Month", "High Quality Backlinks", "Competitor Analysis"],
                    cardStyle: { borderColor: 'var(--seo-border)' },
                    btnStyle: { background: 'var(--seo-border)', color: '#000' }
                }
            ]
        }
    ];

    const generateWhatsAppLink = (planName) => {
        const message = `Hi Aroven Tech, I am interested in the ${planName} plan. Please share more details.`;
        return `https://wa.me/919598023701?text=${encodeURIComponent(message)}`;
    };

    return (
        <main className={styles.pricingContainer}>


            <header className={styles.header}>
                <Link href="/special-offer" className={styles.specialOfferLink}>
                    🔥 LUCKNOW SPECIAL: Get a Business Website for ₹999 (Limited Time) &rarr;
                </Link>

                <h1 className={styles.title}>Web Development Catalog</h1>
                <p className={styles.lead}>Premium Websites at Unbeatable Prices. <br />Choose the plan that fits your vision.</p>

                <div style={{ marginTop: '24px', display: 'inline-block', background: 'rgba(255,150,0,0.1)', border: '1px solid rgba(255,150,0,0.3)', padding: '10px 20px', borderRadius: '8px' }}>
                    <strong style={{ color: '#fbbf24' }}>⚠️ NOTE:</strong> Domain Name is <strong>NOT Included</strong>.
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px', fontSize: '0.9em' }}>
                        You can use a <strong>Free Subdomain</strong> or buy a custom domain.
                    </span>
                </div>
            </header>

            {tiers.map((tier, index) => (
                <div key={index}>
                    <div className={styles.tierLabel}>
                        <div className={styles.tierLine}></div>
                        <span>{tier.title}</span>
                        <div className={styles.tierLine}></div>
                    </div>
                    <div className={styles.grid}>
                        {tier.plans.map((plan, pIndex) => (
                            <div key={pIndex} className={styles.card} style={plan.cardStyle || {}}>
                                {plan.badge && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: plan.badgeColor,
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        {plan.badge}
                                    </div>
                                )}
                                <h3 className={styles.planName} style={plan.highlightName ? { color: 'var(--accent)' } : {}}>
                                    {plan.name}
                                </h3>
                                <div className={styles.price}>
                                    {plan.price} <span className={styles.priceSub}>{plan.period}</span>
                                </div>

                                {plan.hostFree && (
                                    <div className={`${styles.hostTag} ${styles.hostFree}`}>Free Hosting Included</div>
                                )}
                                {plan.hostPaid && (
                                    <div className={`${styles.hostTag} ${styles.hostPaid}`}>Includes Hosting (Worth ~₹750)</div>
                                )}
                                {plan.hostPaidPro && (
                                    <div className={`${styles.hostTag} ${styles.hostPaid}`} style={{ color: 'white', borderColor: 'white' }}>
                                        Includes Pro Hosting (~₹1500 Value)
                                    </div>
                                )}

                                <ul className={styles.features}>
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex}>{feature}</li>
                                    ))}
                                </ul>

                                <a
                                    href={generateWhatsAppLink(plan.name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.btn}
                                    style={plan.btnStyle || (plan.accentStyle ? { background: plan.accentStyle } : {})}
                                >
                                    Choose Plan
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className={styles.discountBanner}>
                🎓 SPECIAL OFFER: STUDENTS GET FLAT 10% OFF ON ALL PLANS (WITH VALID ID)
            </div>

            <div className={styles.brandingSection}>
                <img src="/logo.svg" alt="Aroven Tech Logo" className={styles.brandLogo} />
                <div className={styles.brandText}>Powered by Aroven Tech</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Lucknow's #1 IT Solutions Partner</div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} Aroven Tech. All Rights Reserved.
            </div>
        </main>
    );
}
