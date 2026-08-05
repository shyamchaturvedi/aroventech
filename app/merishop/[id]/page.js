'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = 'https://zmrxufpijlvwjazhtpyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const gradients = [
  'linear-gradient(135deg,#10B981,#059669)',
  'linear-gradient(135deg,#F59E0B,#D97706)',
  'linear-gradient(135deg,#6366F1,#4F46E5)',
  'linear-gradient(135deg,#06B6D4,#0891B2)',
  'linear-gradient(135deg,#EC4899,#DB2777)',
  'linear-gradient(135deg,#8B5CF6,#7C3AED)'
];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}
function gradFor(p) { return gradients[hashStr(String(p.product_id || p.name || '')) % gradients.length]; }
function fmtPrice(n) {
  const v = Number(n) || 0;
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function stockOf(p) { return Number(p.stock) || 0; }

function Thumb({ p }) {
  const [imgError, setImgError] = useState(false);
  const monogram = String(p.name || '?').charAt(0).toUpperCase();
  return (
    <div className="thumb" style={{ background: gradFor(p) }}>
      {p.image_url && !imgError ? (
        <img src={p.image_url} alt={p.name} loading="lazy" onError={() => setImgError(true)} />
      ) : (
        <div className="monogram">{monogram}</div>
      )}
    </div>
  );
}

export default function EShopCustomerPage() {
  const params = useParams();
  const shopId = params.id ? params.id : '';
  const [resolvedShopId, setResolvedShopId] = useState('');

  const [shopProfile, setShopProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEshopActive, setIsEshopActive] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deliveryMode, setDeliveryMode] = useState('home_delivery'); // 'home_delivery' or 'pickup'
  const [cart, setCart] = useState({}); // productId: quantity
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [placedTotal, setPlacedTotal] = useState(0);
  const [placedName, setPlacedName] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = (msg, type = '') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  };

  // Load persisted cart from localStorage
  useEffect(() => {
    if (!shopId) return;
    try {
      const saved = JSON.parse(localStorage.getItem('merishop_cart_' + shopId)) || {};
      if (typeof saved === 'object' && saved !== null) setCart(saved);
    } catch (e) {}
  }, [shopId]);

  // Persist cart to localStorage
  useEffect(() => {
    if (!shopId) return;
    try { localStorage.setItem('merishop_cart_' + shopId, JSON.stringify(cart)); } catch (e) {}
  }, [cart, shopId]);

  useEffect(() => {
    if (shopId) fetchShopData();
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setLoadError('');

      const firebaseProjId = 'merishop-e3d9b';
      let finalShopId = shopId;

      let firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjId}/databases/(default)/documents/shops/${finalShopId}`;
      let firestoreRes = await fetch(firestoreUrl);

      if (!firestoreRes.ok && finalShopId !== finalShopId.toUpperCase()) {
        finalShopId = finalShopId.toUpperCase();
        firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjId}/databases/(default)/documents/shops/${finalShopId}`;
        firestoreRes = await fetch(firestoreUrl);
      }

      if (!firestoreRes.ok) {
        setIsEshopActive(false);
        setLoading(false);
        return;
      }

      const firestoreDoc = await firestoreRes.json();
      const fields = firestoreDoc.fields || {};

      const activeFlag = (fields.isEshopPremium ? fields.isEshopPremium.booleanValue : false) ||
        (fields.isEshopActive ? fields.isEshopActive.booleanValue : false);
      if (!activeFlag) {
        setIsEshopActive(false);
        setLoading(false);
        return;
      }

      setIsEshopActive(true);
      setResolvedShopId(finalShopId);

      // Fetch Shop Profile
      const { data: profileData } = await supabase
        .from('shop_profiles')
        .select('*')
        .eq('shop_id', finalShopId)
        .single();

      if (profileData) {
        setShopProfile(profileData);
      }

      // Fetch Products
      const { data: productsData } = await supabase
        .from('shop_inventory')
        .select('*')
        .eq('shop_id', finalShopId)
        .order('name', { ascending: true });

      if (productsData) {
        setProducts(productsData);
      }
    } catch (err) {
      console.error(err);
      setLoadError('Unable to load shop catalog. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // 🚫 FILTER OUT OF STOCK PRODUCTS: Only show products with stock > 0
  const inStockProducts = products.filter((p) => stockOf(p) > 0);

  const categories = ['All', ...Array.from(new Set(inStockProducts.map((p) => p.category || 'General')))];

  const filteredProducts = inStockProducts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || (p.category || 'General') === selectedCategory;
    const matchesQuery = !searchQuery || (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const cartItems = Object.entries(cart)
    .map(([pid, qty]) => {
      const product = products.find((p) => String(p.product_id) === String(pid));
      if (!product) return null;
      const stock = stockOf(product);
      if (stock <= 0 || qty <= 0) return null;
      return { product, qty: Math.min(qty, stock) };
    })
    .filter(Boolean);

  const getCartTotal = () => cartItems.reduce((total, item) => total + (Number(item.product.price) || 0) * item.qty, 0);
  const getCartCount = () => cartItems.reduce((count, item) => count + item.qty, 0);

  const addToCart = (product, delta) => {
    const id = String(product.product_id);
    const stock = stockOf(product);
    const current = cart[id] || 0;
    const target = current + delta;

    if (target > stock && stock > 0) {
      showToast(`Only ${stock} ${product.unit || 'Pcs'} in stock`, 'error');
    }

    setCart((prev) => {
      const cur = prev[id] || 0;
      const t = cur + delta;
      if (t <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      if (t > stock) {
        if (stock <= 0) return prev;
        return { ...prev, [id]: stock };
      }
      return { ...prev, [id]: t };
    });
  };

  const getUpiUrl = () => {
    if (!shopProfile || !shopProfile.upi_id) return '';
    const name = shopProfile.name || 'Merchant';
    const amount = getCartTotal();
    return `upi://pay?pa=${shopProfile.upi_id}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  };

  const getQrCodeImageUrl = () => {
    const upiUrl = getUpiUrl();
    if (!upiUrl) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) { showToast('Please enter your name', 'error'); return; }
    if (!/^\d{10}$/.test(customerPhone.trim())) { showToast('Enter a valid 10-digit phone number', 'error'); return; }
    if (cartItems.length === 0) { showToast('Your basket is empty', 'error'); return; }

    setPlacing(true);
    try {
      const itemsList = cartItems.map(({ product, qty }) => ({
        product_id: String(product.product_id),
        name: product.name,
        price: Number(product.price) || 0,
        quantity: qty,
        unit: product.unit || 'Pcs',
      }));
      const totalAmt = itemsList.reduce((s, it) => s + it.price * it.quantity, 0);
      const orderId = `ORD-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const { error } = await supabase.from('online_orders').insert([
        {
          id: orderId,
          shop_id: resolvedShopId,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          address: customerAddress.trim(),
          delivery_mode: deliveryMode,
          items: itemsList,
          total_amount: totalAmt,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setPlacedOrderId(orderId);
      setPlacedTotal(totalAmt);
      setPlacedName(customerName.trim());
      setOrderPlaced(true);
      setCart({});
      setCartOpen(true);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  const getWhatsAppMessageUrl = () => {
    if (!shopProfile || !shopProfile.contact) return '';
    const phone = shopProfile.contact.replace(/\D/g, '');
    if (!phone) return '';
    const text = `Hello ${shopProfile.name || 'Shop'}, I have placed an order (${placedOrderId}) for ${fmtPrice(placedTotal)}. Name: ${placedName}. Please confirm my order!`;
    return `https://wa.me/91${phone.length === 10 ? phone : phone.slice(-10)}?text=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setCartOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  const avatarLetter = shopProfile && shopProfile.name ? shopProfile.name.charAt(0).toUpperCase() : 'M';
  const contact = shopProfile ? shopProfile.contact : null;
  const contactHref = contact && /^[\d+\-() ]+$/.test(contact) ? 'tel:' + contact.replace(/[^\d+]/g, '') : null;

  return (
    <div className="eshop-page min-h-screen">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        .eshop-page {
          --primary: #10B981;
          --primary-dark: #059669;
          --primary-gradient: linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%);
          --accent-gold: #F59E0B;
          --bg-dark: #0F172A;
          --bg-light: #F8FAFC;
          --card-bg: #FFFFFF;
          --border-color: #E2E8F0;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --font-heading: 'Outfit', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          background: var(--bg-light);
          color: var(--text-main);
          font-family: var(--font-body);
          min-height: 100vh;
          -webkit-tap-highlight-color: transparent;
        }
        .eshop-page *, .eshop-page *::before, .eshop-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .eshop-page img { max-width: 100%; display: block; }

        /* Native App Bar */
        .eshop-header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .eshop-appbar {
          max-width: 1200px; margin: 0 auto;
          padding: 12px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .shop-brand { display: flex; align-items: center; gap: 14px; }
        .shop-avatar {
          width: 46px; height: 46px; border-radius: 14px;
          background: var(--primary-gradient); color: #fff;
          font-family: var(--font-heading); font-weight: 800; font-size: 1.3rem;
          display: grid; place-items: center;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
        }
        .shop-info h1 {
          font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800;
          color: var(--text-main);
        }
        .shop-live-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.76rem; color: var(--primary-dark); font-weight: 700;
        }
        .live-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--primary);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
          animation: pulse-ring 1.8s infinite;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .header-cart-btn {
          position: relative;
          width: 48px; height: 48px; border-radius: 14px;
          background: #F1F5F9; border: 1px solid var(--border-color);
          display: grid; place-items: center; color: var(--text-main);
          cursor: pointer; transition: all 0.2s ease;
        }
        .header-cart-btn:active { transform: scale(0.92); }
        .cart-badge {
          position: absolute; top: -6px; right: -6px;
          min-width: 22px; height: 22px; padding: 0 6px;
          border-radius: 999px; background: #EF4444; color: #fff;
          font-size: 0.75rem; font-weight: 800; display: grid; place-items: center;
          border: 2px solid #fff; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
        }

        /* Native App Hero Banner */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .hero-banner {
          margin-top: 16px; border-radius: 24px;
          background: var(--primary-gradient); color: #fff;
          padding: 24px 20px; position: relative; overflow: hidden;
          box-shadow: 0 16px 36px rgba(16, 185, 129, 0.25);
        }
        .hero-banner::after {
          content: ''; position: absolute; right: -50px; top: -50px;
          width: 220px; height: 220px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.12); pointer-events: none;
        }
        .verified-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255, 255, 255, 0.22); border: 1px solid rgba(255, 255, 255, 0.35);
          padding: 5px 12px; border-radius: 999px;
          font-size: 0.7rem; font-weight: 800; letter-spacing: 0.5px;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .hero-banner h2 {
          font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800;
          line-height: 1.2; text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .hero-banner .hero-sub {
          font-size: 0.88rem; opacity: 0.95; margin-top: 4px; font-weight: 500;
        }
        .contact-action-chips {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;
        }
        .action-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 7px 14px; border-radius: 12px; color: #fff; text-decoration: none;
          font-size: 0.78rem; font-weight: 700; transition: all 0.2s ease;
        }
        .action-chip:active { transform: scale(0.95); }

        /* Native Search & Category Bars */
        .search-container { margin: 20px 0 14px; position: relative; }
        .search-container input {
          width: 100%; padding: 15px 20px 15px 50px;
          border-radius: 16px; background: var(--card-bg);
          border: 1px solid var(--border-color); color: var(--text-main);
          font-size: 0.95rem; font-weight: 600; outline: none;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: all 0.2s ease;
        }
        .search-container input:focus {
          border-color: var(--primary); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
        }
        .search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          width: 20px; height: 20px; color: var(--text-muted); pointer-events: none;
        }

        .category-scroll {
          display: flex; gap: 8px; overflow-x: auto; padding: 4px 2px 14px;
          scrollbar-width: none;
        }
        .category-scroll::-webkit-scrollbar { display: none; }
        .category-pill {
          flex-shrink: 0; padding: 9px 18px; border-radius: 999px;
          background: var(--card-bg); border: 1px solid var(--border-color);
          color: var(--text-muted); font-size: 0.82rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .category-pill:active { transform: scale(0.94); }
        .category-pill.active {
          background: var(--primary-gradient); color: #fff; border-color: transparent;
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
        }

        .catalog-meta {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px; font-size: 0.82rem; color: var(--text-muted); font-weight: 600;
        }

        /* Native App Style Product Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px; padding-bottom: 140px;
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }

        .product-card {
          background: var(--card-bg); border: 1px solid var(--border-color);
          border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.2s ease;
        }
        .product-card:active { transform: scale(0.98); }

        .thumb {
          position: relative; aspect-ratio: 1 / 0.85;
          display: grid; place-items: center; overflow: hidden;
        }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .monogram {
          font-family: var(--font-heading); font-weight: 800; font-size: 2.8rem;
          color: rgba(255,255,255,0.95); text-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .card-content { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .card-category { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--primary-dark); letter-spacing: 0.5px; }
        .card-title { font-weight: 800; font-size: 0.95rem; color: var(--text-main); line-height: 1.35; height: 2.7em; overflow: hidden; }
        .card-unit { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }

        .card-bottom {
          margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 6px;
        }
        .card-price { font-family: var(--font-heading); font-weight: 800; font-size: 1.2rem; color: var(--text-main); }

        .add-cart-btn {
          padding: 8px 18px; border-radius: 12px; background: var(--primary-gradient);
          color: #fff; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer;
          box-shadow: 0 5px 14px rgba(16, 185, 129, 0.35); transition: all 0.15s ease;
        }
        .add-cart-btn:active { transform: scale(0.92); }

        .quantity-controller {
          display: flex; align-items: center; border: 2px solid var(--primary);
          border-radius: 12px; overflow: hidden; background: #fff;
        }
        .quantity-btn {
          width: 30px; height: 32px; border: none; background: none; color: var(--primary);
          font-size: 1.1rem; font-weight: 800; cursor: pointer; display: grid; place-items: center;
        }
        .quantity-btn:active { background: rgba(16, 185, 129, 0.15); }
        .quantity-value { padding: 0 6px; font-weight: 800; font-size: 0.9rem; color: var(--primary-dark); }

        /* Floating App Bar */
        .floating-cart-bar {
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          width: calc(100% - 32px); max-width: 550px; z-index: 1000;
          background: #0F172A; color: #fff; border-radius: 20px;
          padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.4); cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .floating-cart-bar:active { transform: translate(-50%, 2px); }
        .cart-bar-info { display: flex; align-items: center; gap: 12px; }
        .cart-bar-total { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #10B981; }
        .cart-bar-count { font-size: 0.75rem; opacity: 0.8; }
        .cart-bar-action {
          display: flex; align-items: center; gap: 6px;
          background: var(--primary-gradient); padding: 9px 18px; border-radius: 12px;
          font-weight: 800; font-size: 0.85rem; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        /* Cart Sheet Drawer */
        .cart-backdrop {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px); z-index: 2000; opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .cart-backdrop.open { opacity: 1; pointer-events: auto; }

        .cart-drawer {
          position: fixed; bottom: 0; left: 50%; transform: translate(-50%, 100%);
          width: 100%; max-width: 650px; max-height: 90vh; background: #fff;
          border-radius: 28px 28px 0 0; z-index: 2001; display: flex; flex-direction: column;
          box-shadow: 0 -20px 60px rgba(0,0,0,0.2); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cart-drawer.open { transform: translate(-50%, 0); }

        .drawer-header {
          padding: 18px 20px; border-bottom: 1px solid var(--border-color);
          display: flex; align-items: center; justify-content: space-between;
        }
        .drawer-header h3 { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; }
        .drawer-close {
          width: 34px; height: 34px; border-radius: 50%; background: #F1F5F9;
          border: none; font-size: 1.1rem; cursor: pointer; display: grid; place-items: center;
        }

        .drawer-body { padding: 18px 20px; overflow-y: auto; flex: 1; }

        .cart-item-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 0; border-bottom: 1px solid #F1F5F9;
        }
        .cart-item-info h4 { font-weight: 700; font-size: 0.92rem; }
        .cart-item-info p { font-size: 0.78rem; color: var(--text-muted); }

        .delivery-tab-group {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0;
        }
        .delivery-tab {
          padding: 12px; border-radius: 14px; border: 2px solid var(--border-color);
          text-align: center; font-weight: 700; font-size: 0.85rem; cursor: pointer;
        }
        .delivery-tab.active { border-color: var(--primary); background: rgba(16, 185, 129, 0.08); color: var(--primary-dark); }

        .checkout-form { margin-top: 14px; display: flex; flex-direction: column; gap: 10px; }
        .form-input {
          width: 100%; padding: 14px 16px; border-radius: 14px;
          border: 1px solid var(--border-color); font-size: 0.92rem; font-weight: 600; outline: none;
        }
        .form-input:focus { border-color: var(--primary); }

        .qr-section {
          background: #F8FAFC; border: 1px dashed var(--primary); border-radius: 18px;
          padding: 16px; text-align: center; margin: 16px 0;
        }
        .qr-image { width: 170px; height: 170px; margin: 10px auto; border-radius: 14px; }

        .drawer-footer {
          padding: 18px 20px; border-top: 1px solid var(--border-color); background: #fff;
        }
        .place-order-btn {
          width: 100%; padding: 15px; border-radius: 16px; background: var(--primary-gradient);
          color: #fff; font-weight: 800; font-size: 1rem; border: none; cursor: pointer;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .place-order-btn:active { transform: scale(0.98); }

        /* Toast Container */
        .toast-container { position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); z-index: 3000; display: flex; flex-direction: column; gap: 8px; }
        .toast-item { background: #0F172A; color: #fff; padding: 10px 18px; border-radius: 999px; font-weight: 700; font-size: 0.82rem; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
      `}} />

      {/* Native Header Bar */}
      <header className="eshop-header">
        <div className="eshop-appbar">
          <div className="shop-brand">
            <div className="shop-avatar">{avatarLetter}</div>
            <div className="shop-info">
              <h1>{shopProfile ? shopProfile.name : 'MeriShop Store'}</h1>
              <div className="shop-live-badge">
                <span className="live-dot"></span>
                <span>Open Now • Live Catalog</span>
              </div>
            </div>
          </div>
          <button className="header-cart-btn" onClick={() => setCartOpen(true)}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="22" height="22"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3a1 1 0 00.7 1.7H19M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </button>
        </div>
      </header>

      <main className="container">
        {/* Store Hero Banner */}
        <section className="hero-banner">
          <div className="verified-tag">✓ VERIFIED MERISHOP STORE</div>
          <h2>{shopProfile ? shopProfile.name : 'MeriShop Online Store'}</h2>
          <p className="hero-sub">Order directly from our catalog — We serve you fast!</p>
          
          <div className="contact-action-chips">
            {shopProfile && shopProfile.address && (
              <span className="action-chip">📍 {shopProfile.address}</span>
            )}
            {contactHref && (
              <a href={contactHref} className="action-chip">📞 Call {shopProfile.contact}</a>
            )}
            {shopProfile && shopProfile.upi_id && (
              <span className="action-chip">💳 UPI: {shopProfile.upi_id}</span>
            )}
          </div>
        </section>

        {/* Search Bar */}
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            type="text"
            placeholder="Search in-stock products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Scroll Tabs */}
        <div className="category-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="catalog-meta">
          <span>Showing <b>{filteredProducts.length}</b> in-stock products</span>
        </div>

        {/* Product Catalog Grid (IN-STOCK ONLY) */}
        <div className="products-grid">
          {filteredProducts.map((p) => {
            const qty = cart[String(p.product_id)] || 0;
            return (
              <div className="product-card" key={p.product_id}>
                <Thumb p={p} />
                <div className="card-content">
                  <span className="card-category">{p.category || 'General'}</span>
                  <h3 className="card-title">{p.name}</h3>
                  <span className="card-unit">{p.unit || 'Pcs'} • {stockOf(p)} in stock</span>
                  
                  <div className="card-bottom">
                    <span className="card-price">{fmtPrice(p.price)}</span>
                    
                    {qty === 0 ? (
                      <button className="add-cart-btn" onClick={() => addToCart(p, 1)}>+ ADD</button>
                    ) : (
                      <div className="quantity-controller">
                        <button className="quantity-btn" onClick={() => addToCart(p, -1)}>−</button>
                        <span className="quantity-value">{qty}</span>
                        <button className="quantity-btn" onClick={() => addToCart(p, 1)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {getCartCount() > 0 && !orderPlaced && (
        <div className="floating-cart-bar" onClick={() => setCartOpen(true)}>
          <div className="cart-bar-info">
            <div>
              <div className="cart-bar-total">{fmtPrice(getCartTotal())}</div>
              <div className="cart-bar-count">{getCartCount()} items in your basket</div>
            </div>
          </div>
          <div className="cart-bar-action">
            <span>View Cart</span>
            <span>➔</span>
          </div>
        </div>
      )}

      {/* Checkout Drawer & Sheet */}
      <div className={`cart-backdrop ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}></div>
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>{orderPlaced ? 'Order Placed!' : 'Your Shopping Basket'}</h3>
          <button className="drawer-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="drawer-body">
          {orderPlaced ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: 10 }}>Order Confirmed!</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
                Thanks <b>{placedName}</b>! Your order of <b>{fmtPrice(placedTotal)}</b> is submitted to shop.
              </p>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 12, marginTop: 14, fontWeight: 700 }}>
                Order ID: {placedOrderId}
              </div>

              {getWhatsAppMessageUrl() && (
                <a
                  href={getWhatsAppMessageUrl()}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#25D366', color: '#fff', padding: '14px 24px',
                    borderRadius: 14, fontWeight: 800, textDecoration: 'none', marginTop: 18
                  }}
                >
                  💬 Send Order Update on WhatsApp
                </a>
              )}
            </div>
          ) : (
            <>
              {cartItems.map(({ product, qty }) => (
                <div className="cart-item-row" key={product.product_id}>
                  <div className="cart-item-info">
                    <h4>{product.name}</h4>
                    <p>{fmtPrice(product.price)} × {qty} = <b>{fmtPrice((Number(product.price) || 0) * qty)}</b></p>
                  </div>
                  <div className="quantity-controller">
                    <button className="quantity-btn" onClick={() => addToCart(product, -1)}>−</button>
                    <span className="quantity-value">{qty}</span>
                    <button className="quantity-btn" onClick={() => addToCart(product, 1)}>+</button>
                  </div>
                </div>
              ))}

              <div className="delivery-tab-group">
                <div
                  className={`delivery-tab ${deliveryMode === 'home_delivery' ? 'active' : ''}`}
                  onClick={() => setDeliveryMode('home_delivery')}
                >
                  🚀 Home Delivery
                </div>
                <div
                  className={`delivery-tab ${deliveryMode === 'pickup' ? 'active' : ''}`}
                  onClick={() => setDeliveryMode('pickup')}
                >
                  🏬 Store Pickup
                </div>
              </div>

              {shopProfile && shopProfile.upi_id && (
                <div className="qr-section">
                  <p style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>Scan & Pay Instantly via UPI</p>
                  <img src={getQrCodeImageUrl()} alt="UPI QR Code" className="qr-image" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan using GPay, PhonePe, or Paytm</p>
                </div>
              )}

              <div className="checkout-form">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  type="tel"
                  className="form-input"
                  placeholder="10-Digit Mobile Number *"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                />
                {deliveryMode === 'home_delivery' && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Delivery Address (House/Street) *"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {!orderPlaced && (
          <div className="drawer-footer">
            <button className="place-order-btn" onClick={handlePlaceOrder} disabled={placing || cartItems.length === 0}>
              {placing ? 'Submitting Order…' : `Confirm & Place Order (${fmtPrice(getCartTotal())})`}
            </button>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div className="toast-item" key={t.id}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
