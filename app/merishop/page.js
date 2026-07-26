'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LuFileText, 
  LuPrinter, 
  LuQrCode, 
  LuUsers, 
  LuBarChart3, 
  LuCloud, 
  LuShoppingCart, 
  LuUtensils, 
  LuPill, 
  LuMilk, 
  LuScissors, 
  LuStore, 
  LuCheckCircle2, 
  LuGlobe, 
  LuShieldCheck, 
  LuDownload, 
  LuArrowDown,
  LuPlus,
  LuRotateCcw,
  LuSparkles
} from 'react-icons/lu';

export default function MeriShopPage() {
  const [items, setItems] = useState([]);
  const [isTearing, setIsTearing] = useState(false);
  const mockupRef = useRef(null);

  const totalAmt = items.reduce((acc, curr) => acc + curr.price, 0);

  const addPosItem = (name, price) => {
    setItems((prev) => [...prev, { id: Date.now(), name, price }]);
  };

  const resetBill = () => {
    setItems([]);
  };

  const triggerReceiptTear = () => {
    setIsTearing(true);
    setTimeout(() => {
      setIsTearing(false);
    }, 1000);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mockupRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      mockupRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const bentoFeatures = [
    {
      id: 'gst',
      title: 'GST Billing & Invoicing',
      sub: 'Fast 3-Second Invoices',
      image: '/assets/images/v2_gst.png',
      icon: <LuFileText size={24} />,
      desc: 'Tax & Non-Tax billing with customizable business logo, HSN codes, and instant PDF sharing.',
      delay: '0s'
    },
    {
      id: 'printer',
      title: 'Thermal Receipts & KOT',
      sub: 'Bluetooth 58mm & 80mm',
      image: '/assets/images/v2_printer.png',
      icon: <LuPrinter size={24} />,
      desc: 'Connect any ESC/POS Bluetooth printer for instant restaurant KOT & store receipts.',
      delay: '0.8s'
    },
    {
      id: 'barcode',
      title: 'Camera Barcode Scanner',
      sub: 'Real-Time Stock Alerts',
      image: '/assets/images/v2_barcode.png',
      icon: <LuQrCode size={24} />,
      desc: 'Scan barcode items using mobile camera with auto stock depletion alerts.',
      delay: '1.6s'
    },
    {
      id: 'khata',
      title: 'Digital Udhaar Khata',
      sub: 'Credit & Debit Ledger',
      image: '/assets/images/v2_khata.png',
      icon: <LuUsers size={24} />,
      desc: 'Track customer credit balances, send automated payment reminders, and keep clean accounts.',
      delay: '0.4s'
    },
    {
      id: 'reports',
      title: 'GSTR-1 & Net Profit',
      sub: '1-Click Financial Export',
      image: '/assets/images/v2_reports.png',
      icon: <LuBarChart3 size={24} />,
      desc: 'Export daily sales, net profit margins, GST return files, and expense reports to Excel.',
      delay: '1.2s'
    },
    {
      id: 'offline',
      title: '100% Offline Working',
      sub: 'Zero Internet Needed',
      image: '/assets/images/v2_kirana.png',
      icon: <LuCloud size={24} />,
      desc: 'Complete billing engine runs locally on device memory with encrypted Drive backup.',
      delay: '2s'
    }
  ];

  const appScreenshots = [
    { title: 'SMART POS HOME', subtitle: 'Fast Retail Billing', image: '/assets/images/v2_hero.png' },
    { title: 'INSTANT GST INVOICING', subtitle: 'PDF & WhatsApp Billing', image: '/assets/images/new_screen_gst.png' },
    { title: 'THERMAL PRINTER KOT', subtitle: '58mm & 80mm Bluetooth Prints', image: '/assets/images/new_screen_printer.png' },
    { title: 'BARCODE INVENTORY', subtitle: 'Camera Stock Scanner', image: '/assets/images/new_screen_barcode.png' },
    { title: 'UDHAAR LEDGER REGISTER', subtitle: 'Customer Credit & Debit', image: '/assets/images/new_screen_khata.png' },
    { title: 'FINANCIAL PROFIT REPORTS', subtitle: 'GSTR-1 Excel Exports', image: '/assets/images/new_screen_reports.png' }
  ];

  const businessCategories = [
    { name: 'Kirana & Supermarket', sub: 'Barcode Inventory', icon: <LuShoppingCart size={32} /> },
    { name: 'Restaurant & Cafe', sub: 'KOT Printing', icon: <LuUtensils size={32} /> },
    { name: 'Medical & Pharmacy', sub: 'Batch & Expiry', icon: <LuPill size={32} /> },
    { name: 'Milk & Dairy Store', sub: 'Daily Credit Ledger', icon: <LuMilk size={32} /> },
    { name: 'Salons & Services', sub: 'Job Cards & Billing', icon: <LuScissors size={32} /> },
    { name: 'Hardware & Garments', sub: 'Multi-Item Billing', icon: <LuStore size={32} /> },
  ];

  return (
    <div className="merishop-react-container">
      <style jsx global>{`
        :root {
          --color-orange: #FF5722;
          --color-red-vivid: #FE3E29;
          --color-gold: #FFD700;
          --bg-dark: #06060A;
          --bg-card: rgba(16, 16, 24, 0.75);
          --border-card: rgba(255, 255, 255, 0.08);
          --border-glow: rgba(254, 62, 41, 0.6);
          --font-display: 'Teko', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --font-mono: 'Space Mono', monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; background-color: var(--bg-dark); }
        body {
          background-color: var(--bg-dark);
          color: #FFFFFF;
          font-family: var(--font-body);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          background-image: 
            radial-gradient(circle at 50% 12%, rgba(254, 62, 41, 0.16) 0%, transparent 55%),
            radial-gradient(circle at 80% 60%, rgba(255, 87, 34, 0.12) 0%, transparent 45%);
        }

        /* CONTINUOUS FLOATING & GLOW KEYFRAMES */
        @keyframes floatLevitate {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(1.5deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 15px 35px rgba(254,62,41,0.4)); }
          50% { filter: drop-shadow(0 25px 65px rgba(254,62,41,0.85)); }
        }

        .floating-subject-nobg {
          mix-blend-mode: lighten;
          animation: floatLevitate 5s ease-in-out infinite, pulseGlow 4s ease-in-out infinite;
          display: block; width: 100%; height: 100%; object-fit: contain;
        }

        .glow-stroke-effect {
          box-shadow: 0 0 25px rgba(254, 62, 41, 0.18);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glow-stroke-effect:hover {
          box-shadow: 0 0 65px rgba(254, 62, 41, 0.75), inset 0 0 20px rgba(254, 62, 41, 0.3) !important;
          border-color: var(--color-orange) !important; transform: translateY(-6px);
        }

        nav.navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(6, 6, 10, 0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-card); padding: 0 40px; height: 76px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .brand-logo-wrap { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .nav-logo-img { height: 46px; width: auto; object-fit: contain; }
        .burbujeo-tag {
          background: var(--color-red-vivid); color: #FFF; font-family: var(--font-display);
          font-size: 1.3rem; font-weight: 700; padding: 2px 12px; border-radius: 6px; letter-spacing: 0.05em;
        }
        
        .nav-links { display: flex; gap: 32px; font-family: var(--font-body); font-size: 0.88rem; font-weight: 600; }
        .nav-links a { color: rgba(255,255,255,0.75); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--color-orange); }

        .btn-download-app {
          background: linear-gradient(135deg, var(--color-red-vivid) 0%, var(--color-orange) 100%);
          color: #FFF; font-family: var(--font-body); font-weight: 700; font-size: 0.88rem;
          padding: 12px 26px; border-radius: 30px; text-decoration: none; border: none;
          box-shadow: 0 4px 20px rgba(254, 62, 41, 0.4); display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.25s ease; cursor: pointer;
        }
        .btn-download-app:hover { transform: translateY(-2px); box-shadow: 0 8px 35px rgba(254, 62, 41, 0.75); }
        @media(max-width: 900px){ .nav-links { display: none; } }

        .hero {
          position: relative; min-height: 100vh; padding: 130px 40px 60px 40px;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1400px; margin: 0 auto;
        }
        .hero-left { max-width: 640px; z-index: 10; }
        
        .pill-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(254, 62, 41, 0.08); border: 1px solid rgba(254, 62, 41, 0.3);
          color: var(--color-orange); font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700;
          padding: 6px 16px; border-radius: 40px; margin-bottom: 24px; text-transform: uppercase;
        }

        .hero-h1 {
          font-family: var(--font-display); font-size: clamp(4.5rem, 11vw, 9rem);
          font-weight: 700; line-height: 0.85; text-transform: uppercase; margin-bottom: 24px; color: #FFF;
        }
        .hero-h1 span {
          background: linear-gradient(135deg, #FF6B4A 0%, #FE3E29 50%, #FF9800 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .hero-p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.78); margin-bottom: 36px; max-width: 560px; }
        .hero-p b { color: var(--color-orange); }

        .hero-actions { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 40px; }
        .btn-ghost-hero {
          background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-card);
          color: #FFF; font-weight: 700; font-size: 0.92rem; padding: 14px 28px; border-radius: 30px;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.25s ease;
          cursor: pointer;
        }
        .btn-ghost-hero:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); }

        .trust-strip { display: flex; gap: 24px; font-size: 0.82rem; color: rgba(255,255,255,0.75); flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 8px; }

        .hero-right-stage {
          position: relative; width: 560px; height: 600px; z-index: 5;
          display: flex; align-items: center; justify-content: center;
        }
        .hero-mockup-img {
          width: 100%; height: auto; max-height: 580px; object-fit: contain;
          transition: transform 0.15s ease-out; mix-blend-mode: lighten;
          animation: floatLevitate 6s ease-in-out infinite, pulseGlow 4s ease-in-out infinite;
        }
        @media(max-width: 1050px){ .hero-right-stage { display: none; } }

        .liquid-wave-wrap {
          width: 100%; height: 160px; overflow: hidden; position: relative; z-index: 10; margin-top: -30px;
        }
        .liquid-wave-wrap svg {
          width: 100%; height: 100%; fill: var(--color-red-vivid);
          transform-origin: bottom center; animation: waveScaleLoop 8s infinite ease-in-out;
        }
        @keyframes waveScaleLoop {
          0%, 100% { transform: scaleY(1); }
          33% { transform: scaleY(1.08); }
          66% { transform: scaleY(0.95); }
        }

        .features-section { max-width: 1400px; margin: 0 auto; padding: 80px 40px; position: relative; z-index: 10; }
        .sec-header { text-align: center; margin-bottom: 50px; }
        .sec-header h2 { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5.5rem); text-transform: uppercase; line-height: 0.9; }

        .bento-image-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        @media(max-width: 1000px){ .bento-image-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 650px){ .bento-image-grid { grid-template-columns: 1fr; } }

        .bento-feature-card {
          background: var(--bg-card); border: 1px solid var(--border-card);
          border-radius: 24px; overflow: hidden; backdrop-filter: blur(20px);
          transition: all 0.35s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
        }
        .bento-feature-card:hover { transform: translateY(-8px); border-color: var(--border-glow); box-shadow: 0 20px 50px rgba(254,62,41,0.3); }
        .bento-card-img-wrap { width: 100%; height: 240px; position: relative; overflow: hidden; background: transparent; padding: 16px; }
        .bento-card-img-wrap img {
          mix-blend-mode: lighten; width: 100%; height: 100%; object-fit: contain; display: block;
          animation: floatLevitate 5s ease-in-out infinite; transition: transform 0.5s ease;
        }
        .bento-feature-card:hover .bento-card-img-wrap img { transform: scale(1.1); }
        
        .bento-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .bento-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .bento-card-icon { color: var(--color-orange); }
        .bento-card-title { font-size: 1.25rem; font-weight: 700; color: #FFF; }
        .bento-card-sub { font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-orange); margin-bottom: 10px; text-transform: uppercase; }
        .bento-card-desc { font-size: 0.88rem; color: rgba(255,255,255,0.65); line-height: 1.5; }

        .app-gallery-section { max-width: 1400px; margin: 0 auto; padding: 40px 40px 100px 40px; position: relative; z-index: 10; }
        .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        @media(max-width: 900px){ .gallery-grid { grid-template-columns: 1fr; } }

        .gallery-card {
          background: var(--bg-card); border: 1px solid var(--border-card);
          border-radius: 24px; overflow: hidden; backdrop-filter: blur(20px);
          transition: all 0.35s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .gallery-card:hover { transform: translateY(-8px); border-color: var(--border-glow); box-shadow: 0 20px 50px rgba(254,62,41,0.3); }
        .gallery-card-img-wrap { width: 100%; height: 320px; position: relative; overflow: hidden; padding: 12px; }
        .gallery-card-img-wrap img { width: 100%; height: 100%; object-fit: contain; display: block; mix-blend-mode: lighten; }
        .gallery-card-info { padding: 24px; text-align: center; }
        .gallery-card-info h4 { font-family: var(--font-display); font-size: 1.8rem; text-transform: uppercase; color: #FFF; margin-bottom: 6px; }
        .gallery-card-info p { font-size: 0.85rem; color: rgba(255,255,255,0.65); }

        .demo-section {
          background: rgba(12, 12, 18, 0.95); border-top: 1px solid var(--border-card); border-bottom: 1px solid var(--border-card);
          padding: 80px 40px; position: relative; z-index: 10;
        }
        .demo-wrap { max-width: 1400px; margin: 0 auto; }
        .demo-header { margin-bottom: 40px; }
        .demo-header .tag { color: var(--color-orange); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
        .demo-header h2 { font-family: var(--font-display); font-size: clamp(2.8rem, 6vw, 4.5rem); text-transform: uppercase; line-height: 0.9; }

        .demo-grid { display: grid; grid-template-columns: 1fr 1.1fr 0.9fr; gap: 30px; align-items: center; }
        @media(max-width: 1000px){ .demo-grid { grid-template-columns: 1fr; } }

        .demo-box {
          background: var(--bg-card); border: 1px solid var(--border-card);
          border-radius: 24px; padding: 28px; backdrop-filter: blur(16px);
        }
        
        .receipt-live-paper {
          background: #F8FAFC; color: #0F172A; font-family: var(--font-mono); font-size: 0.82rem;
          padding: 20px; border-radius: 12px; line-height: 1.8; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          min-height: 150px; position: relative; transition: transform 0.4s ease;
        }
        .receipt-live-paper.tearing { animation: receiptTearAnim 0.8s ease forwards; }
        @keyframes receiptTearAnim {
          0% { transform: translateY(0) rotateX(0deg); }
          30% { transform: translateY(80px) rotateX(6deg); }
          70% { transform: translateY(220px) rotateX(-4deg); opacity: 0.8; }
          100% { transform: translateY(320px) rotateX(0deg); opacity: 0; }
        }
        .receipt-live-row { display: flex; justify-content: space-between; }
        .receipt-live-total { border-top: 2px dashed #CBD5E1; margin-top: 10px; padding-top: 8px; font-weight: 700; display: flex; justify-content: space-between; font-size: 1rem; }

        .categories-section { max-width: 1400px; margin: 0 auto; padding: 100px 40px; }
        .cat-title { margin-bottom: 50px; }
        .cat-title h2 { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4.2rem); text-transform: uppercase; color: #FFF; }
        
        .cat-cards-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
        @media(max-width: 1100px){ .cat-cards-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(max-width: 650px){ .cat-cards-grid { grid-template-columns: repeat(2, 1fr); } }

        .cat-item-card {
          background: var(--bg-card); border: 1px solid var(--border-card);
          border-radius: 20px; padding: 28px 16px; text-align: center; position: relative;
          display: flex; flex-direction: column; align-items: center;
        }
        .cat-num-badge { position: absolute; top: 12px; right: 12px; font-family: var(--font-mono); font-size: 0.7rem; color: rgba(255,255,255,0.4); }
        .cat-icon-svg { margin-bottom: 14px; color: var(--color-red-vivid); }
        .cat-name { font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; }
        .cat-sub { font-size: 0.75rem; color: rgba(255,255,255,0.5); }

        .stats-strip {
          background: rgba(16, 16, 24, 0.95); border-top: 1px solid var(--border-card);
          padding: 36px 40px; display: flex; justify-around: space-around; flex-wrap: wrap; gap: 24px;
        }
        .stat-box { text-align: center; }
        .stat-box .val { font-family: var(--font-display); font-size: 2.6rem; font-weight: 700; color: var(--color-orange); }
        .stat-box .lbl { font-family: var(--font-mono); font-size: 0.75rem; color: rgba(255,255,255,0.6); text-transform: uppercase; }

        footer {
          border-top: 1px solid var(--border-card); padding: 60px 40px; text-align: center;
          font-family: var(--font-mono); font-size: 0.85rem; color: rgba(255,255,255,0.5);
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .footer-logo-img { height: 48px; width: auto; object-fit: contain; margin-bottom: 8px; }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <Link href="/merishop" className="brand-logo-wrap">
          <img src="/assets/images/logo.png" alt="MeriShop Official Logo" className="nav-logo-img" />
          <div className="burbujeo-tag glow-stroke-effect">BURBUJEO</div>
        </Link>
        <div className="nav-links">
          <a href="#features">Features Matrix</a>
          <a href="#gallery">3D Floating Showcase</a>
          <a href="#demo">Live Printer Simulator</a>
          <a href="#categories">Business Types</a>
          <Link href="/merishop/privacy">Privacy Policy</Link>
        </div>
        <a href="https://play.google.com/store/apps/details?id=com.aroventech.merishop" target="_blank" rel="noopener noreferrer" className="btn-download-app glow-stroke-effect">
          <span>DOWNLOAD APP</span>
          <LuDownload size={16} />
        </a>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-left">
          <div className="pill-badge">
            <LuSparkles style={{ display: 'inline', marginRight: 4 }} /> DESI DUKAAN KA DIGITAL REGISTER — BURBUJEO DEL BUENO
          </div>
          <h1 className="hero-h1">AAPKI DUKAAN KA<br /><span>POORA HISAAB</span></h1>
          <p className="hero-p">
            GST Billing, Bluetooth Thermal Receipts, Barcode Stock Tracker aur Udhaar Khata — <b>100% Offline</b>.
          </p>
          <div className="hero-actions">
            <a href="https://play.google.com/store/apps/details?id=com.aroventech.merishop" target="_blank" rel="noopener noreferrer" className="btn-download-app glow-stroke-effect" style={{ padding: '16px 36px', fontSize: '1.02rem' }}>
              <span>FREE APP DOWNLOAD NOW</span>
              <LuDownload size={18} />
            </a>
            <a href="#demo" className="btn-ghost-hero glow-stroke-effect">
              <span>TEST PRINTER DEMO <LuArrowDown style={{ display: 'inline', marginLeft: 4 }} /></span>
            </a>
          </div>
          <div className="trust-strip">
            <div className="trust-item">
              <LuCheckCircle2 size={18} color="#FF5722" />
              <b>100% Offline</b> Works Without Internet
            </div>
            <div className="trust-item">
              <LuGlobe size={18} color="#FF5722" />
              <b>Made in India</b> For Indian Businesses
            </div>
            <div className="trust-item">
              <LuShieldCheck size={18} color="#FF5722" />
              <b>Secure & Private</b> Your Data, Your Control
            </div>
          </div>
        </div>

        {/* 3D FLOATING HERO MOCKUP STAGE WITHOUT BACKGROUND */}
        <div className="hero-right-stage">
          <img 
            src="/assets/images/v2_hero.png" 
            alt="MeriShop 3D POS Terminal" 
            className="hero-mockup-img" 
            ref={mockupRef}
          />
        </div>
      </header>

      {/* LIQUID WAVE DIVIDER */}
      <div className="liquid-wave-wrap">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path d="M0,80 C250,20 500,140 750,80 C1000,10 1250,120 1440,80 L1440,180 L0,180 Z"></path>
        </svg>
      </div>

      {/* RICH FLOATING 3D BENTO FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="sec-header">
          <h2>POWERFUL POS MODULES</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>// FLOATING TRANSPARENT 3D ANIMATED VISUALS</p>
        </div>

        <div className="bento-image-grid">
          {bentoFeatures.map((feat) => (
            <div key={feat.id} className="bento-feature-card glow-stroke-effect">
              <div className="bento-card-img-wrap">
                <img 
                  src={feat.image} 
                  alt={feat.title} 
                  style={{ animationDelay: feat.delay }}
                />
              </div>
              <div className="bento-card-body">
                <div>
                  <div className="bento-card-header">
                    <span className="bento-card-icon">{feat.icon}</span>
                    <span className="bento-card-title">{feat.title}</span>
                  </div>
                  <div className="bento-card-sub">{feat.sub}</div>
                  <p className="bento-card-desc">{feat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3D FLOATING APP SHOWCASE GALLERY */}
      <section className="app-gallery-section" id="gallery">
        <div className="sec-header">
          <h2>3D FLOATING INTERFACES SHOWCASE</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>// SEAMLESS LEVITATING MOBILE RETAIL OS SCREENSHOTS</p>
        </div>

        <div className="gallery-grid">
          {appScreenshots.map((item, idx) => (
            <div key={idx} className="gallery-card glow-stroke-effect">
              <div className="gallery-card-img-wrap">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ animation: `floatLevitate 6s ease-in-out ${idx * 0.4}s infinite` }}
                />
              </div>
              <div className="gallery-card-info">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE THERMAL PRINTER DEMO */}
      <section className="demo-section" id="demo">
        <div className="demo-wrap">
          <div className="demo-header">
            <div className="tag">LIVE DEMO</div>
            <h2>TEST THERMAL PRINTER LIVE</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Billing karo, Print nikalo, Real experience lo MeriShop ke saath.</p>
          </div>

          <div className="demo-grid">
            <div className="demo-box glow-stroke-effect">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-orange)', marginBottom: 16 }}>1. TAP ITEMS TO ADD</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => addPosItem('Masala Chai', 20)} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span><LuPlus style={{ display: 'inline', marginRight: 4 }} /> Masala Chai</span> <b>₹20</b>
                </button>
                <button onClick={() => addPosItem('Samosa Chat', 30)} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span><LuPlus style={{ display: 'inline', marginRight: 4 }} /> Samosa Chat</span> <b>₹30</b>
                </button>
                <button onClick={() => addPosItem('Cold Coffee', 50)} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span><LuPlus style={{ display: 'inline', marginRight: 4 }} /> Cold Coffee</span> <b>₹50</b>
                </button>
                <button onClick={resetBill} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--color-orange)', color: 'var(--color-orange)' }}>
                  <LuRotateCcw size={16} style={{ marginRight: 6 }} /> RESET
                </button>
              </div>
            </div>

            <div className="demo-box glow-stroke-effect">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-orange)', marginBottom: 16 }}>2. LIVE RECEIPT PREVIEW</div>
              <div className={`receipt-live-paper ${isTearing ? 'tearing' : ''}`}>
                <div style={{ textAlign: 'center', fontWeight: 700, borderBottom: '1px dashed #94A3B8', paddingBottom: 6, marginBottom: 8 }}>MERISHOP RETAIL POS</div>
                {items.length === 0 ? (
                  <div style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>Tap items on the left to add to bill</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="receipt-live-row">
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))
                )}
                <div className="receipt-live-total">
                  <span>GRAND TOTAL:</span>
                  <span style={{ color: 'var(--color-red-vivid)' }}>₹{totalAmt}</span>
                </div>
              </div>
            </div>

            <div className="demo-box glow-stroke-effect" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#10B981', marginBottom: 16 }}>3. PRINTER STATUS: CONNECTED</div>
              <div style={{ margin: '16px 0' }}>
                <LuPrinter size={60} color="#10B981" />
              </div>
              <button onClick={triggerReceiptTear} className="btn-download-app glow-stroke-effect" style={{ width: '100%', justifyContent: 'center', padding: 16 }}>
                PRINT & TEAR RECEIPT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS CATEGORIES SECTION */}
      <section className="categories-section" id="categories">
        <div className="cat-title">
          <h2>BUILT FOR EVERY INDIAN BUSINESS</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Ek app, sabke liye. Har business ka perfect saathi.</p>
        </div>

        <div className="cat-cards-grid">
          {businessCategories.map((cat, i) => (
            <div key={i} className="cat-item-card glow-stroke-effect">
              <span className="cat-num-badge">0{i+1}</span>
              <span className="cat-icon-svg">{cat.icon}</span>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-sub">{cat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="stat-box"><div className="val">100%</div><div className="lbl">OFFLINE WORKING</div></div>
        <div className="stat-box"><div className="val">10,000+</div><div className="lbl">HAPPY MERCHANTS</div></div>
        <div className="stat-box"><div className="val">₹50 CR+</div><div className="lbl">TRANSACTIONS MONTHLY</div></div>
        <div className="stat-box"><div className="val">PAN INDIA</div><div className="lbl">GROWING TOGETHER</div></div>
        <div className="stat-box"><div className="val">100% SAFE</div><div className="lbl">ENCRYPTED BACKUP</div></div>
      </div>

      {/* FOOTER */}
      <footer>
        <img src="/assets/images/logo.png" alt="MeriShop Logo" className="footer-logo-img" />
        <p>&copy; 2026 ArovenTech. Developed by Shyam Chaturvedi. All rights reserved. | <Link href="/merishop/privacy" style={{ color: 'var(--color-orange)', textDecoration: 'none' }}>Privacy Policy</Link></p>
      </footer>
    </div>
  );
}
