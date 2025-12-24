

import React from 'react';
import Link from 'next/link';
import { demoPlans } from '../../data/demoPlans';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = demoPlans[slug];

    if (!project) return { title: 'Demo Not Found' };

    const title = `${project.title} Demo | Aroven Tech Lucknow`;
    const desc = `Live preview of ${project.title} by Aroven Tech. Get this premium website/app designed for your business starting @ ₹999. Best Web Development in Lucknow.`;

    return {
        title: title,
        description: desc,
        keywords: `${project.type} website demo, aroven tech designs, lucknow web developer, ${project.title} template, cheap website lucknow`,
        openGraph: {
            title: title,
            description: desc,
            url: `https://www.aroventech.site/demos/${slug}`,
            siteName: 'Aroven Tech',
            images: [
                {
                    url: 'https://www.aroventech.site/logo.svg', // Fallback or specific demo image
                    width: 1200,
                    height: 630,
                }
            ],
            type: 'website',
        }
    };
}


export default async function DemoPage({ params }) {
    const { slug } = await params;
    const project = demoPlans[slug];

    if (!project) {
        // Fallback for SEO/Marketing plans which map to a generic type if not found
        if (slug.includes('seo') || slug.includes('marketing')) {
            return <DemoViewer project={demoPlans['marketing-seo']} slug={slug} />;
        }
        return notFound();
    }

    return <DemoViewer project={project} slug={slug} />;
}

function DemoViewer({ project, slug }) {
    const { title, type, theme, features, mockData } = project;

    // Theme Colors
    const getThemeColors = (themeType) => {
        switch (themeType) {
            case 'modern': return { bg: '#f8fafc', text: '#1e293b', accent: '#3b82f6' };
            case 'clean': return { bg: '#ffffff', text: '#334155', accent: '#64748b' };
            case 'celebration': return { bg: '#fff1f2', text: '#881337', accent: '#e11d48' };
            case 'dark-art': return { bg: '#0f172a', text: '#e2e8f0', accent: '#f59e0b' };
            case 'medical': return { bg: '#eff6ff', text: '#1e3a8a', accent: '#2563eb' };
            case 'food': return { bg: '#fff7ed', text: '#431407', accent: '#ea580c' };
            case 'education': return { bg: '#f0f9ff', text: '#0c4a6e', accent: '#0284c7' };
            case 'news': return { bg: '#ffffff', text: '#171717', accent: '#dc2626' };
            case 'app-showcase': return { bg: '#18181b', text: '#f4f4f5', accent: '#10b981' };
            default: return { bg: '#ffffff', text: '#1f2937', accent: '#4f46e5' };
        }
    };

    const colors = getThemeColors(theme);

    return (
        <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Demo Header Bar */}
            <div style={{
                background: '#0a0a0a', color: 'white', padding: '10px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #333'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link href="/pricing" style={{ fontSize: '14px', color: '#999', textDecoration: 'none' }}>&larr; Back to Pricing</Link>
                    <span style={{ fontSize: '14px', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>Previewing: <strong>{title}</strong></span>
                </div>
                <Link href="/contact" style={{
                    background: '#00e5ff', color: 'black', padding: '6px 16px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: 'bold', textDecoration: 'none'
                }}>
                    Get This Template
                </Link>
            </div>

            {/* Main Preview Area */}
            <div style={{
                backgroundColor: colors.bg,
                color: colors.text,
                minHeight: 'calc(100vh - 54px)',
                position: 'relative'
            }}>
                {renderContent(type, colors, project)}
            </div>
        </div>
    );
}

// Import dynamic layouts
import {
    LandingPageLayout, DashboardLayout, StoreLayout, MobileProfileLayout
} from '@/components/DemoLayouts';

function renderContent(type, colors, project) {
    const { mockData: data, title } = project;

    // Mapping types to Premium Layouts

    // 1. Mobile Profile (Business Card)
    if (type === 'mobile-profile') return <MobileProfileLayout data={data} colors={colors} />;

    // 2. Dashboard / LMS / School CMS
    if (type === 'dashboard') return <DashboardLayout data={data} colors={colors} />;

    // 3. E-commerce / Store / Menu
    if (type === 'store' || type === 'menu') return <StoreLayout data={data} colors={colors} />;

    // 4. Default Landing Page (Corporate, Service, Profile, Real Estate, etc.)
    // We treat most 'web' types as a high-quality Landing Page for now
    if (['landing', 'profile', 'listing', 'resume', 'event', 'blog', 'news', 'impact'].includes(type)) {
        // We can pass specific variants or flags if needed in the future
        return <LandingPageLayout data={data} colors={colors} />;
    }

    // 5. Fallback for Software/Apps (Still use the mockup view as they are non-web)
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: '800' }}>{data.title || title}</h1>
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '60px' }}>High-Performance {type === 'software' ? 'Desktop Software' : 'Mobile Application'} Solution</p>

            <div style={{
                background: '#1e293b', color: 'white', padding: '60px', borderRadius: '30px',
                boxShadow: '0 30px 60px -10px rgba(0,0,0,0.3)', maxWidth: '900px', margin: '0 auto',
                border: `1px solid ${colors.accent}`, position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(${colors.accent}44, transparent 70%)` }}></div>
                <div style={{ position: 'relative', zIndex: 10, border: '2px dashed #475569', borderRadius: '20px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px', color: colors.accent }}>
                            {type === 'software' ? '🖥️' : '📱'}
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>
                            {type === 'software' ? 'Windows / MacOS Software' : 'Android / iOS App'}
                        </h3>
                        <p style={{ opacity: 0.7 }}>Fully Functional • Native Performance • Secure</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {(project.features || []).map(f => (
                    <span key={f} style={{ background: 'white', padding: '10px 24px', borderRadius: '50px', fontSize: '15px', fontWeight: '600', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: colors.text }}>
                        ✔️ {f}
                    </span>
                ))}
            </div>
        </div>
    );
}
