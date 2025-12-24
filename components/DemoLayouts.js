
import React from 'react';
import {
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaLinkedin,
    FaBars, FaShoppingCart, FaSearch, FaUser, FaArrowRight, FaStar, FaCheckCircle,
    FaChartLine, FaUsers, FaBox, FaCog, FaDownload, FaPlay
} from 'react-icons/fa';

// --- Shared UI Components ---

const Button = ({ children, variant = 'primary', style, ...props }) => {
    const baseStyle = {
        padding: '12px 28px',
        borderRadius: '50px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        fontSize: '15px',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        ...style
    };

    const variants = {
        primary: { background: 'var(--accent)', color: 'white', image: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' },
        outline: { background: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)' },
        white: { background: 'white', color: 'var(--accent)' }
    };

    const vStyle = variants[variant];

    return (
        <button
            style={{ ...baseStyle, ...vStyle, background: vStyle.image || vStyle.background }}
            {...props}
        >
            {children}
        </button>
    );
};

const Section = ({ bg = 'white', children, style }) => (
    <div style={{ padding: '80px 24px', background: bg, ...style }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>{children}</div>
    </div>
);

const Card = ({ children, style }) => (
    <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s ease',
        border: '1px solid rgba(0,0,0,0.03)',
        ...style
    }}>
        {children}
    </div>
);

// --- Specific Layout Components ---

const BrandingFooter = () => (
    <div style={{
        textAlign: 'center',
        padding: '12px',
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: '12px',
        borderTop: '1px solid #1e293b',
        fontFamily: 'sans-serif',
        marginTop: 'auto'
    }}>
        <p style={{ margin: 0 }}>
            DESIGNED & POWERED BY <a href="https://www.aroventech.site" target="_blank" rel="dofollow" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>AROVEN TECH</a>
            <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
            Start your project @ ₹999
        </p>
    </div>
);

export const LandingPageLayout = ({ data, colors }) => (
    <div style={{ fontFamily: '"Inter", sans-serif', color: '#1e293b' }}>
        {/* Navigation */}
        <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: '800', fontSize: '24px', color: colors.accent, letterSpacing: '-0.5px' }}>
                {data.business || data.name || "BrandLogo"}
            </div>
            <div style={{ display: 'none', md: 'flex', gap: '30px', fontWeight: '500', color: '#64748b' }}>
                {['Home', 'Services', 'About', 'Testimonials', 'Contact'].map(item => (
                    <span key={item} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>{item}</span>
                ))}
            </div>
            <Button style={{ '--accent': colors.accent, '--accent-dark': colors.text }}>Get Started</Button>
        </nav>

        {/* Hero Section */}
        <div style={{
            background: `linear-gradient(135deg, ${colors.bg} 0%, white 100%)`,
            padding: '100px 24px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: colors.accent, opacity: '0.1', borderRadius: '50%', filter: 'blur(80px)' }}></div>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                {data.offer && (
                    <span style={{ background: '#fffbeb', color: '#d97706', padding: '6px 16px', borderRadius: '30px', fontWeight: '700', fontSize: '13px', display: 'inline-block', marginBottom: '24px', border: '1px solid #fcd34d' }}>
                        🎉 {data.offer}
                    </span>
                )}
                <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1', background: `linear-gradient(to right, ${colors.text}, ${colors.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {data.heroTitle || data.name}
                </h1>
                <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' }}>
                    {data.heroSubtitle || data.tagline || "We help businesses grow with stunning websites and digital solutions."}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <Button style={{ '--accent': colors.accent }}>{data.availability ? 'Book Appointment' : 'Start Now'}</Button>
                    <Button variant="outline" style={{ '--accent': colors.text }}>Learn More</Button>
                </div>
            </div>
        </div>

        {/* Features / Services */}
        <Section bg="#f8fafc">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>Our Expertise</h2>
                <div style={{ width: '60px', height: '4px', background: colors.accent, margin: '0 auto', borderRadius: '2px' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {(data.services || ['High Quality Work', '24/7 Support', 'Fast Delivery']).map((feature, i) => (
                    <Card key={i} style={{ padding: '40px' }}>
                        <div style={{ width: '60px', height: '60px', background: `${colors.accent}15`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: colors.accent, marginBottom: '24px' }}>
                            {i % 3 === 0 ? '🚀' : i % 3 === 1 ? '💎' : '🛡️'}
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{typeof feature === 'string' ? feature : feature.name}</h3>
                        <p style={{ color: '#64748b', lineHeight: '1.6' }}>We provide best-in-class solutions tailored to your specific business needs with guaranteed results.</p>
                        <div style={{ marginTop: '20px', color: colors.accent, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                            Learn more <FaArrowRight size={12} />
                        </div>
                    </Card>
                ))}
            </div>
        </Section>

        {/* Stats / Trust */}
        <Section bg={colors.accent} style={{ color: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
                {[
                    { label: 'Happy Clients', val: '500+' },
                    { label: 'Projects Done', val: '120+' },
                    { label: 'Years Exp.', val: '10+' },
                    { label: 'Team Members', val: '25+' }
                ].map((stat, i) => (
                    <div key={i}>
                        <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px' }}>{stat.val}</div>
                        <div style={{ opacity: 0.8, fontSize: '16px' }}>{stat.label}</div>
                    </div>
                ))}
            </div>
        </Section>

        {/* Footer */}
        <footer style={{ background: '#0f172a', color: 'white', padding: '60px 24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '60px' }}>
                <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>{data.business || data.name}</div>
                    <p style={{ color: '#94a3b8', lineHeight: '1.6', maxWidth: '300px' }}>
                        Transforming ideas into digital reality. Trusted by leading businesses worldwide.
                    </p>
                </div>
                <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li>Home</li>
                        <li>Services</li>
                        <li>About Us</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Contact</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaPhone /> +91 98765 43210</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaEnvelope /> info@example.com</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaMapMarkerAlt /> Lucknow, India</li>
                    </ul>
                </div>
            </div>
            <div style={{ borderTop: '1px solid #1e293b', marginTop: '60px', paddingTop: '30px', textAlign: 'center', color: '#64748b' }}>
                &copy; {new Date().getFullYear()} {data.business || data.name}. All rights reserved.
            </div>
        </footer>
        <BrandingFooter />
    </div>
);

export const DashboardLayout = ({ data, colors }) => (
    <div style={{ display: 'flex', background: '#f1f5f9', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', background: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', background: colors.accent, borderRadius: '8px' }}></div>
                {data.schoolName || data.platform || 'Admin'}
            </div>
            <nav style={{ flex: 1, padding: '24px' }}>
                {[
                    { icon: <FaChartLine />, label: 'Dashboard', active: true },
                    { icon: <FaUsers />, label: 'Users' },
                    { icon: <FaBox />, label: 'Products/Courses' },
                    { icon: <FaCheckCircle />, label: 'Orders/Tasks' },
                    { icon: <FaCog />, label: 'Settings' },
                ].map((item, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
                        background: item.active ? colors.accent : 'transparent',
                        color: item.active ? 'white' : '#94a3b8',
                        transition: 'all 0.2s'
                    }}>
                        {item.icon} {item.label}
                    </div>
                ))}
            </nav>
            <div style={{ padding: '24px', borderTop: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#334155', borderRadius: '50%' }}></div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>Admin User</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>admin@demo.com</div>
                    </div>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
            <header style={{ background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Dashboard Overview</h2>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><FaSearch /></div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><FaEnvelope /></div>
                </div>
            </header>

            <div style={{ padding: '32px' }}>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    {[
                        { label: 'Total Revenue', val: '₹12.5L', change: '+12%', color: '#10b981' },
                        { label: 'Active Users', val: '2,450', change: '+5%', color: '#3b82f6' },
                        { label: 'New Orders', val: '450', change: '+18%', color: '#f59e0b' },
                        { label: 'Support Tickets', val: '12', change: '-2%', color: '#64748b' },
                    ].map((stat, i) => (
                        <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{stat.label}</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{stat.val}</div>
                            <div style={{ fontSize: '13px', color: stat.color, fontWeight: '500' }}>{stat.change} from last month</div>
                        </div>
                    ))}
                </div>

                {/* Dashboard Widgets */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', height: '400px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Revenue Analytics</h3>
                        <div style={{ width: '100%', height: '300px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '20px' }}>
                            {[40, 60, 45, 80, 55, 70, 90, 65].map((h, i) => (
                                <div key={i} style={{ width: '40px', height: `${h}%`, background: colors.accent, borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', height: '400px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Recent Activity</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent }}></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '500' }}>New User Registered</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>2 mins ago</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <BrandingFooter />
        </main >
    </div >
);

export const StoreLayout = ({ data, colors }) => (
    <div style={{ fontFamily: '"Inter", sans-serif', background: '#f9fafb' }}>
        {/* Header */}
        <header style={{ background: 'white', padding: '20px 0', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', fontStyle: 'italic', color: colors.accent }}>
                    {data.storeName || data.restaurant}
                </div>
                <div style={{ display: 'flex', flex: 1, maxWidth: '500px', margin: '0 40px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        style={{ width: '100%', padding: '12px 20px', borderRadius: '50px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                    />
                    <div style={{ position: 'absolute', right: '15px', top: '12px', color: '#94a3b8' }}><FaSearch /></div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}><FaUser /> Account</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        <div style={{ position: 'relative' }}>
                            <FaShoppingCart size={20} />
                            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'red', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                        </div>
                        Cart
                    </div>
                </div>
            </div>
        </header>

        {/* Hero Banner */}
        <div style={{ height: '400px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' }}>
            <div>
                <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Huge Season Sale</h1>
                <p style={{ fontSize: '20px', marginBottom: '32px', color: '#cbd5e1' }}>Get up to 50% off on all new arrivals.</p>
                <Button style={{ '--accent': colors.accent, background: 'white', color: 'black' }}>Shop Now</Button>
            </div>
        </div>

        {/* Products */}
        <Section>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '40px' }}>Featured Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                {(data.products || (data.categories ? data.categories[0].items : [])).map((item, i) => (
                    <Card key={i} style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '250px', background: '#f1f5f9', position: 'relative' }}>
                            {/* Image Placeholder */}
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '40px' }}><FaBox /></div>
                            <button style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', border: 'none', width: '35px', height: '35px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><FaStar /></button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Category</div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{item.name}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{item.price}</div>
                                <button style={{ background: colors.accent, color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaShoppingCart /></button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </Section>
        <BrandingFooter />
    </div>
);

export const MobileProfileLayout = ({ data, colors }) => (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '380px', background: 'white', borderRadius: '30px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', overflow: 'hidden', border: '8px solid white' }}>
            <div style={{ height: '140px', background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}88)` }}></div>
            <div style={{ textAlign: 'center', padding: '0 24px 40px', marginTop: '-60px' }}>
                <div style={{ width: '120px', height: '120px', background: 'white', borderRadius: '50%', margin: '0 auto 16px', padding: '4px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#94a3b8' }}>
                        {data.name.charAt(0)}
                    </div>
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{data.name}</h1>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>{data.role} @ {data.company}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px' }}>
                    <Button style={{ '--accent': colors.accent, width: '100%', justifyContent: 'center' }}><FaPhone /> Call</Button>
                    <Button variant="outline" style={{ '--accent': colors.accent, width: '100%', justifyContent: 'center' }}><FaEnvelope /> Email</Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.links.map((link, i) => (
                        <a key={i} href="#" style={{
                            display: 'flex', alignItems: 'center', padding: '16px', background: '#f8fafc',
                            borderRadius: '16px', textDecoration: 'none', color: '#334155', fontWeight: '600',
                            transition: 'background 0.2s', border: '1px solid #e2e8f0'
                        }}>
                            <span style={{ fontSize: '20px', marginRight: '12px', color: colors.accent }}>{link.icon}</span>
                            {link.label}
                            <FaArrowRight style={{ marginLeft: 'auto', fontSize: '12px', opacity: 0.5 }} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
        <div style={{ position: 'absolute', bottom: '20px', color: '#94a3b8', fontSize: '12px' }}>Previewing on Mobile Layout</div>
        <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0 }}>
            <BrandingFooter />
        </div>
    </div>
);
