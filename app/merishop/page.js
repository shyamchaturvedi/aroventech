'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// CLEAN SVG ICONS (100% Fail-Safe)
const IconFileText = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const IconPrinter = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const IconQrCode = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><line x1="7" y1="8" x2="7" y2="16"></line><line x1="10" y1="8" x2="10" y2="16"></line><line x1="13" y1="8" x2="13" y2="16"></line><line x1="17" y1="8" x2="17" y2="16"></line></svg>;
const IconUsers = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconBarChart3 = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconCloud = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>;
const IconShoppingCart = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconUtensils = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>;
const IconPill = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>;
const IconMilk = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8v4H8z"></path><path d="M6 6h12v16H6z"></path></svg>;
const IconScissors = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>;
const IconStore = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconCheckCircle = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconGlobe = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconShieldCheck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const IconDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const IconArrowDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
const IconPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconRotateCcw = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const IconSparkles = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path></svg>;
const IconDroplet = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>;

export default function MeriShopPage() {
  const [items, setItems] = useState([]);
  const [isTearing, setIsTearing] = useState(false);
  const mockupRef = useRef(null);
  const canvasRef = useRef(null);

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

  // 3D TILT EFFECT
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

  // HIGH-TECH STYLISH WATER RIPPLE & CAUSTICS CANVAS ENGINE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ripples = [];
    for (let i = 0; i < 35; i++) {
      ripples.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 25 + 5,
        maxRadius: Math.random() * 90 + 40,
        speed: Math.random() * 0.7 + 0.3,
        alpha: Math.random() * 0.45 + 0.1,
        color: i % 3 === 0 ? 'rgba(0, 210, 255, ' : 'rgba(254, 62, 41, '
      });
    }

    const handleCanvasClick = (e) => {
      for (let i = 0; i < 3; i++) {
        ripples.push({
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 30,
          radius: 4,
          maxRadius: 80 + i * 20,
          speed: 1.5 - i * 0.2,
          alpha: 0.8,
          color: 'rgba(0, 210, 255, '
        });
      }
    };
    window.addEventListener('click', handleCanvasClick);

    let animId;
    const drawWater = () => {
      ctx.clearRect(0, 0, width, height);

      // Render interactive liquid ripples
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color + r.alpha + ')';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        r.radius += r.speed;
        r.alpha -= 0.004;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples[i] = {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 4,
            maxRadius: Math.random() * 90 + 40,
            speed: Math.random() * 0.7 + 0.3,
            alpha: Math.random() * 0.45 + 0.1,
            color: Math.random() < 0.5 ? 'rgba(0, 210, 255, ' : 'rgba(254, 62, 41, '
          };
        }
      }

      animId = requestAnimationFrame(drawWater);
    };
    drawWater();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  const bentoFeatures = [
    {
      id: 'gst',
      title: 'GST Billing & Invoicing',
      sub: 'Fast 3-Second Invoices',
      image: '/assets/images/v2_gst.png',
      icon: <IconFileText />,
      desc: 'Tax & Non-Tax billing with customizable business logo, HSN codes, and instant PDF sharing.'
    },
    {
      id: 'printer',
      title: 'Thermal Receipts & KOT',
      sub: 'Bluetooth 58mm & 80mm',
      image: '/assets/images/v2_printer.png',
      icon: <IconPrinter />,
      desc: 'Connect any ESC/POS Bluetooth printer for instant restaurant KOT & store receipts.'
    },
    {
      id: 'barcode',
      title: 'Camera Barcode Scanner',
      sub: 'Real-Time Stock Alerts',
      image: '/assets/images/v2_barcode.png',
      icon: <IconQrCode />,
      desc: 'Scan barcode items using mobile camera with auto stock depletion alerts.'
    },
    {
      id: 'khata',
      title: 'Digital Udhaar Khata',
      sub: 'Credit & Debit Ledger',
      image: '/assets/images/v2_khata.png',
      icon: <IconUsers />,
      desc: 'Track customer credit balances, send automated payment reminders, and keep clean accounts.'
    },
    {
      id: 'reports',
      title: 'GSTR-1 & Net Profit',
      sub: '1-Click Financial Export',
      image: '/assets/images/v2_reports.png',
      icon: <IconBarChart3 />,
      desc: 'Export daily sales, net profit margins, GST return files, and expense reports to Excel.'
    },
    {
      id: 'offline',
      title: '100% Offline Working',
      sub: 'Zero Internet Needed',
      image: '/assets/images/v2_kirana.png',
      icon: <IconCloud />,
      desc: 'Complete billing engine runs locally on device memory with encrypted Drive backup.'
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
    { name: 'Kirana & Supermarket', sub: 'Barcode Inventory', icon: <IconShoppingCart /> },
    { name: 'Restaurant & Cafe', sub: 'KOT Printing', icon: <IconUtensils /> },
    { name: 'Medical & Pharmacy', sub: 'Batch & Expiry', icon: <IconPill /> },
    { name: 'Milk & Dairy Store', sub: 'Daily Credit Ledger', icon: <IconMilk /> },
    { name: 'Salons & Services', sub: 'Job Cards & Billing', icon: <IconScissors /> },
    { name: 'Hardware & Garments', sub: 'Multi-Item Billing', icon: <IconStore /> },
  ];

  return (
    <div className="merishop-react-container" style={{ position: 'relative' }}>
      {/* INTERACTIVE STYLISH WATER RIPPLE CANVAS */}
      <canvas 
        ref={canvasRef} 
        id="water-canvas" 
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.55 }}
      />

      <style jsx global>{`
        :root {
          --color-orange: #FF5722;
          --color-red-vivid: #FE3E29;
          --color-aqua: #00D2FF;
          --color-gold: #FFD700;
          --bg-dark: #06060A;
          --bg-card: rgba(16, 16, 24, 0.85);
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
            radial-gradient(circle at 50% 10%, rgba(254, 62, 41, 0.18) 0%, transparent 55%),
            radial-gradient(circle at 80% 60%, rgba(0, 210, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 20% 80%, rgba(254, 62, 41, 0.14) 0%, transparent 50%);
        }

        @keyframes floatLevitate {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(1.5deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 15px 35px rgba(254,62,41,0.4)) drop-shadow(0 0 20px rgba(0,210,255,0.3)); }
          50% { filter: drop-shadow(0 25px 65px rgba(254,62,41,0.85)) drop-shadow(0 0 40px rgba(0,210,255,0.6)); }
        }

        /* WATER FLUID REFLECTION EFFECT */
        @keyframes waterFluidFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .glow-stroke-effect {
          background: linear-gradient(145deg, rgba(20, 20, 32, 0.9) 0%, rgba(10, 14, 25, 0.95) 100%);
          box-shadow: 0 0 25px rgba(254, 62, 41, 0.18), inset 0 0 15px rgba(0, 210, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glow-stroke-effect:hover {
          box-shadow: 0 0 65px rgba(254, 62, 41, 0.75), 0 0 35px rgba(0, 210, 255, 0.5), inset 0 0 25px rgba(0, 210, 255, 0.3) !important;
          border-color: var(--color-aqua) !important; transform: translateY(-8px);
        }

        nav.navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(6, 6, 10, 0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-card); padding: 0 40px; height: 76px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .brand-logo-wrap { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .nav-logo-img { height: 46px; width: auto; object-fit: contain; filter: drop-shadow(0 0 10px rgba(0,210,255,0.4)); }
        .burbujeo-tag {
          background: linear-gradient(135deg, var(--color-red-vivid) 0%, #00D2FF 100%);
          color: #FFF; font-family: var(--font-display);
          font-size: 1.3rem; font-weight: 700; padding: 2px 12px; border-radius: 6px; letter-spacing: 0.05em;
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.5);
        }
        
        .nav-links { display: flex; gap: 32px; font-family: var(--font-body); font-size: 0.88rem; font-weight: 600; }
        .nav-links a { color: rgba(255,255,255,0.75); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--color-aqua); }

        .btn-download-app {
          background: linear-gradient(135deg, var(--color-red-vivid) 0%, var(--color-orange) 50%, #00D2FF 100%);
          background-size: 200% 200%; animation: waterFluidFlow 6s ease infinite;
          color: #FFF; font-family: var(--font-body); font-weight: 700; font-size: 0.88rem;
          padding: 12px 26px; border-radius: 30px; text-decoration: none; border: none;
          box-shadow: 0 4px 20px rgba(254, 62, 41, 0.4), 0 0 20px rgba(0, 210, 255, 0.3);
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.25s ease; cursor: pointer;
        }
        .btn-download-app:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(0, 210, 255, 0.8); }
        @media(max-width: 900px){ .nav-links { display: none; } }

        .hero {
          position: relative; min-height: 100vh; padding: 130px 40px 60px 40px;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1400px; margin: 0 auto;
        }
        .hero-left { max-width: 640px; z-index: 10; }
        
        .pill-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0, 210, 255, 0.08); border: 1px solid rgba(0, 210, 255, 0.3);
          color: var(--color-aqua); font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700;
          padding: 6px 16px; border-radius: 40px; margin-bottom: 24px; text-transform: uppercase;
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.2);
        }

        .hero-h1 {
          font-family: var(--font-display); font-size: clamp(4.5rem, 11vw, 9rem);
          font-weight: 700; line-height: 0.85; text-transform: uppercase; margin-bottom: 24px; color: #FFF;
        }
        .hero-h1 span {
          background: linear-gradient(135deg, #FF6B4A 0%, #FE3E29 40%, #00D2FF 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .hero-p { font-size: 1.2rem; line-height: 1.6; color: rgba(255,255,255,0.78); margin-bottom: 36px; max-width: 560px; }
        .hero-p b { color: var(--color-aqua); }

        .hero-actions { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 40px; }
        .btn-ghost-hero {
          background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-card);
          color: #FFF; font-weight: 700; font-size: 0.92rem; padding: 14px 28px; border-radius: 30px;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.25s ease;
          cursor: pointer;
        }
        .btn-ghost-hero:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(0, 210, 255, 0.5); color: var(--color-aqua); }

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

        /* STYLISH MULTI-LAYER LIQUID WATER WAVE DIVIDER */
        .liquid-wave-wrap {
          width: 100%; height: 180px; overflow: hidden; position: relative; z-index: 10; margin-top: -30px;
        }
        .liquid-wave-wrap svg {
          position: absolute; width: 100%; height: 100%;
        }
        .wave-layer-1 { fill: rgba(0, 210, 255, 0.3); animation: waveScaleLoop 7s infinite ease-in-out; }
        .wave-layer-2 { fill: var(--color-red-vivid); animation: waveScaleLoop 10s infinite ease-in-out reverse; }
        @keyframes waveScaleLoop {
          0%, 100% { transform: scaleY(1); }
          33% { transform: scaleY(1.12); }
          66% { transform: scaleY(0.92); }
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
        .bento-feature-card:hover { transform: translateY(-8px); border-color: var(--color-aqua); box-shadow: 0 20px 50px rgba(0,210,255,0.3); }
        .bento-card-img-wrap { width: 100%; height: 230px; position: relative; overflow: hidden; background: rgba(8, 8, 12, 0.6); padding: 12px; }
        .bento-card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 14px;
          transition: transform 0.5s ease;
        }
        .bento-feature-card:hover .bento-card-img-wrap img { transform: scale(1.08); }
        
        .bento-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .bento-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .bento-card-icon { color: var(--color-aqua); display: flex; align-items: center; }
        .bento-card-title { font-size: 1.25rem; font-weight: 700; color: #FFF; }
        .bento-card-sub { font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-orange); margin-bottom: 10px; text-transform: uppercase; }
        .bento-card-desc { font-size: 0.88rem; color: rgba(255,255,255,0.65); line-height: 1.5; }

        /* 3D FLOATING SHOWCASE GALLERY WITH IMAGES */
        .app-gallery-section { max-width: 1400px; margin: 0 auto; padding: 40px 40px 100px 40px; position: relative; z-index: 10; }
        .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        @media(max-width: 900px){ .gallery-grid { grid-template-columns: 1fr; } }

        .gallery-card {
          background: var(--bg-card); border: 1px solid var(--border-card);
          border-radius: 24px; overflow: hidden; backdrop-filter: blur(20px);
          transition: all 0.35s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .gallery-card:hover { transform: translateY(-8px); border-color: var(--color-aqua); box-shadow: 0 20px 50px rgba(0,210,255,0.3); }
        .gallery-card-img-wrap { width: 100%; height: 320px; position: relative; overflow: hidden; padding: 12px; background: rgba(8, 8, 12, 0.6); }
        .gallery-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 16px; }
        .gallery-card-info { padding: 24px; text-align: center; }
        .gallery-card-info h4 { font-family: var(--font-display); font-size: 1.8rem; text-transform: uppercase; color: #FFF; margin-bottom: 6px; }
        .gallery-card-info p { font-size: 0.85rem; color: rgba(255,255,255,0.65); }

        .demo-section {
          background: rgba(12, 12, 18, 0.95); border-top: 1px solid var(--border-card); border-bottom: 1px solid var(--border-card);
          padding: 80px 40px; position: relative; z-index: 10;
        }
        .demo-wrap { max-width: 1400px; margin: 0 auto; }
        .demo-header { margin-bottom: 40px; }
        .demo-header .tag { color: var(--color-aqua); fontFamily: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
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
        .cat-icon-svg { margin-bottom: 14px; color: var(--color-aqua); display: flex; align-items: center; }
        .cat-name { font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; }
        .cat-sub { font-size: 0.75rem; color: rgba(255,255,255,0.5); }

        /* PERFECTLY CENTERED STATS STRIP */
        .stats-strip-container {
          background: rgba(16, 16, 24, 0.95); border-top: 1px solid var(--border-card);
          border-bottom: 1px solid var(--border-card); width: 100%; padding: 48px 20px;
        }
        .stats-strip-inner {
          max-width: 1400px; margin: 0 auto;
          display: flex; justify-content: center; align-items: center;
          text-align: center; flex-wrap: wrap; gap: 48px;
        }
        .stat-box { text-align: center; min-width: 180px; }
        .stat-box .val { font-family: var(--font-display); font-size: 3rem; font-weight: 700; color: var(--color-orange); line-height: 1; margin-bottom: 6px; }
        .stat-box .lbl { font-family: var(--font-mono); font-size: 0.78rem; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.05em; }

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
          <div className="burbujeo-tag glow-stroke-effect">MERISHOP</div>
        </Link>
        <div className="nav-links">
          <a href="#features">Features Matrix</a>
          <a href="#gallery">3D Floating Showcase</a>
          <a href="#demo">Live Printer Simulator</a>
          <a href="#categories">Business Types</a>
          <a href="#faq">FAQ</a>
          <Link href="/merishop/privacy">Privacy Policy</Link>
        </div>
        <a href="https://play.google.com/store/apps/details?id=com.aroventech.merishop" target="_blank" rel="noopener noreferrer" className="btn-download-app">
          <span>DOWNLOAD APP</span>
          <IconDownload />
        </a>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-left">
          <div className="pill-badge">
            <IconDroplet /> STYLISH LIQUID ENGINE — MERISHOP POS
          </div>
          <h1 className="hero-h1">AAPKI DUKAAN KA<br /><span>POORA HISAAB</span></h1>
          <p className="hero-p">
            GST Billing, Bluetooth Thermal Receipts, Barcode Stock Tracker aur Udhaar Khata — <b>100% Offline Engine</b>.
          </p>
          <div className="hero-actions">
            <a href="https://play.google.com/store/apps/details?id=com.aroventech.merishop" target="_blank" rel="noopener noreferrer" className="btn-download-app" style={{ padding: '16px 36px', fontSize: '1.02rem' }}>
              <span>FREE APP DOWNLOAD NOW</span>
              <IconDownload />
            </a>
            <a href="#demo" className="btn-ghost-hero">
              <span>TEST PRINTER DEMO <IconArrowDown /></span>
            </a>
          </div>
          <div className="trust-strip">
            <div className="trust-item">
              <IconCheckCircle />
              <b>100% Offline</b> Works Without Internet
            </div>
            <div className="trust-item">
              <IconGlobe />
              <b>Made in India</b> For Indian Businesses
            </div>
            <div className="trust-item">
              <IconShieldCheck />
              <b>Secure & Private</b> Your Data, Your Control
            </div>
          </div>
        </div>

        {/* 3D FLOATING HERO MOCKUP STAGE */}
        <div className="hero-right-stage">
          <img 
            src="/assets/images/v2_hero.png" 
            alt="MeriShop 3D POS Terminal" 
            className="hero-mockup-img" 
            ref={mockupRef}
          />
        </div>
      </header>

      {/* MULTI-LAYER LIQUID WATER WAVE DIVIDER */}
      <div className="liquid-wave-wrap">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path className="wave-layer-1" d="M0,60 C320,130 420,10 650,70 C900,130 1120,20 1440,60 L1440,180 L0,180 Z"></path>
          <path className="wave-layer-2" d="M0,90 C250,20 500,140 750,80 C1000,10 1250,120 1440,80 L1440,180 L0,180 Z"></path>
        </svg>
      </div>

      {/* RICH FLOATING 3D BENTO FEATURES SECTION WITH IMAGES */}
      <section className="features-section" id="features">
        <div className="sec-header">
          <h2>POWERFUL POS MODULES</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>// HIGH-RESOLUTION 3D VISUALIZED POS FEATURES</p>
        </div>

        <div className="bento-image-grid">
          {bentoFeatures.map((feat) => (
            <div key={feat.id} className="bento-feature-card glow-stroke-effect">
              <div className="bento-card-img-wrap">
                <img src={feat.image} alt={feat.title} />
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

      {/* 3D FLOATING SHOWCASE GALLERY WITH IMAGES */}
      <section className="app-gallery-section" id="gallery">
        <div className="sec-header">
          <h2>3D FLOATING INTERFACES SHOWCASE</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>// SEAMLESS LEVITATING MOBILE RETAIL OS SCREENSHOTS</p>
        </div>

        <div className="gallery-grid">
          {appScreenshots.map((item, idx) => (
            <div key={idx} className="gallery-card glow-stroke-effect">
              <div className="gallery-card-img-wrap">
                <img src={item.image} alt={item.title} />
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-aqua)', marginBottom: 16 }}>1. TAP ITEMS TO ADD</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => addPosItem('Masala Chai', 20)} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span><IconPlus /> Masala Chai</span> <b>₹20</b>
                </button>
                <button onClick={() => addPosItem('Samosa Chat', 30)} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span><IconPlus /> Samosa Chat</span> <b>₹30</b>
                </button>
                <button onClick={() => addPosItem('Cold Coffee', 50)} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span><IconPlus /> Cold Coffee</span> <b>₹50</b>
                </button>
                <button onClick={resetBill} className="btn-ghost-hero" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--color-orange)', color: 'var(--color-orange)' }}>
                  <IconRotateCcw /> RESET
                </button>
              </div>
            </div>

            <div className="demo-box glow-stroke-effect">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-aqua)', marginBottom: 16 }}>2. LIVE RECEIPT PREVIEW</div>
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
              <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              </div>
              <button onClick={triggerReceiptTear} className="btn-download-app" style={{ width: '100%', justifyContent: 'center', padding: 16 }}>
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

      {/* PERFECTLY CENTERED STATS STRIP */}
      <div className="stats-strip-container">
        <div className="stats-strip-inner">
          <div className="stat-box"><div className="val">100%</div><div className="lbl">OFFLINE WORKING</div></div>
          <div className="stat-box"><div className="val">10,000+</div><div className="lbl">HAPPY MERCHANTS</div></div>
          <div className="stat-box"><div className="val">₹50 CR+</div><div className="lbl">TRANSACTIONS MONTHLY</div></div>
          <div className="stat-box"><div className="val">PAN INDIA</div><div className="lbl">GROWING TOGETHER</div></div>
          <div className="stat-box"><div className="val">100% SAFE</div><div className="lbl">ENCRYPTED BACKUP</div></div>
        </div>
      </div>

      {/* FAQ SECTION FOR ON-PAGE & SERP SEO */}
      <section className="faq-section" id="faq" style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: 'var(--color-aqua)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>FREQUENTLY ASKED QUESTIONS</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', textTransform: 'uppercase' }}>SABSE JYADA POOCHE GAYE SAWAAL (FAQ)</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="faq-card glow-stroke-effect" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: 8, fontWeight: 700 }}>❓ Kya MeriShop internet ke bina (100% Offline) chalta hai?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.6 }}>Haan! MeriShop ka poora billing engine aapke phone memory me 100% offline run karta hai. Billing, invoice generation, Bluetooth printing aur stock tracking ke liye internet ki bilkul zaroorat nahi hai.</p>
          </div>

          <div className="faq-card glow-stroke-effect" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: 8, fontWeight: 700 }}>🖨️ Konsa Bluetooth Thermal Printer MeriShop se connect hota hai?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.6 }}>MeriShop sabhi standard 58mm (2 inch) aur 80mm (3 inch) ESC/POS Bluetooth thermal printers ke sath instantly pair ho jata hai. Restaurants ke liye KOT order print auto-generate hota hai.</p>
          </div>

          <div className="faq-card glow-stroke-effect" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: 8, fontWeight: 700 }}>📄 Kya MeriShop se GST billing aur WhatsApp invoice share kar sakte hain?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.6 }}>Bilkul! Aap GST aur Non-GST dono tarah ke bills bana sakte hain. Customized shop logo, HSN code aur item breakdown ke sath instant PDF WhatsApp par customer ko 1-click me bhej sakte hain.</p>
          </div>

          <div className="faq-card glow-stroke-effect" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: 8, fontWeight: 700 }}>📊 GSTR-1 aur Net Profit report kaise export hoti hai?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.6 }}>MeriShop me 1-click financial reports module hai jisse aap daily total sales, net profit margins aur GSTR-1 ready GST return files Excel me export kar sakte hain.</p>
          </div>
        </div>
      </section>

      {/* GOOGLE SCHEMA.ORG JSON-LD STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "MeriShop: GST Billing & POS",
                "operatingSystem": "Android",
                "applicationCategory": "BusinessApplication",
                "downloadUrl": "https://play.google.com/store/apps/details?id=com.aroventech.merishop",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "1250"
                },
                "author": {
                  "@type": "Organization",
                  "name": "ArovenTech",
                  "url": "https://www.aroventech.site"
                }
              }
            ]
          })
        }}
      />

      {/* FOOTER */}
      <footer>
        <img src="/assets/images/logo.png" alt="MeriShop Logo" className="footer-logo-img" />
        <p>&copy; 2026 ArovenTech. Developed by Shyam Chaturvedi. All rights reserved. | <Link href="/merishop/privacy" style={{ color: 'var(--color-orange)', textDecoration: 'none' }}>Privacy Policy</Link></p>
      </footer>
    </div>
  );
}
