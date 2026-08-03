'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = 'https://zmrxufpijlvwjazhtpyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const gradients = [
  'linear-gradient(135deg,#16C060,#0B8A41)',
  'linear-gradient(135deg,#F5A623,#F97316)',
  'linear-gradient(135deg,#6366F1,#8B5CF6)',
  'linear-gradient(135deg,#06B6D4,#3B82F6)',
  'linear-gradient(135deg,#EC4899,#F97316)',
  'linear-gradient(135deg,#22C55E,#0EA5E9)'
];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}
function gradFor(p) { return gradients[hashStr(String(p.product_id || '')) % gradients.length]; }
function fmtPrice(n) {
  const v = Number(n) || 0;
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function stockOf(p) { return Number(p.stock) || 0; }

function Thumb({ p }) {
  const [imgError, setImgError] = useState(false);
  const inStock = stockOf(p) > 0;
  const monogram = String(p.name || '?').charAt(0).toUpperCase();
  return (
    <div className="thumb" style={{ background: gradFor(p) }}>
      {p.image_url && !imgError ? (
        <img src={p.image_url} alt={p.name} loading="lazy" onError={() => setImgError(true)} />
      ) : (
        <div className="monogram">{monogram}</div>
      )}
      <span className={`stock-badge ${inStock ? 'in' : 'out'}`}>{inStock ? '● In stock' : 'Out of stock'}</span>
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
  const [isEshopActive, setIsEshopActive] = useState(true); // Control flag from Firebase
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({}); // productId: quantity
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
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

  // Load persisted cart from localStorage (keyed by shop id)
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

  // Fetch stock and shop profile from Supabase after validating with Firebase
  useEffect(() => {
    if (shopId) fetchShopData();
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setLoadError('');

      // 1. Verify E-Shop Status with Firebase Firestore REST API
      const firebaseProjId = 'merishop-e3d9b';
      let finalShopId = shopId;

      let firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjId}/databases/(default)/documents/shops/${finalShopId}`;
      let firestoreRes = await fetch(firestoreUrl);

      // Fallback: If original case fails and shopId is not already uppercase, try uppercase (for custom IDs like mschaubeyshop01 -> MSCHAUBEYSHOP01)
      if (!firestoreRes.ok && finalShopId !== finalShopId.toUpperCase()) {
        finalShopId = finalShopId.toUpperCase();
        firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjId}/databases/(default)/documents/shops/${finalShopId}`;
        firestoreRes = await fetch(firestoreUrl);
      }

      if (!firestoreRes.ok) {
        // Document not found in Firebase Firestore
        setIsEshopActive(false);
        setLoading(false);
        return;
      }

      const firestoreDoc = await firestoreRes.json();
      const fields = firestoreDoc.fields || {};

      // Check if either isEshopPremium or isEshopActive is true in Firebase
      const activeFlag = (fields.isEshopPremium ? fields.isEshopPremium.booleanValue : false) ||
        (fields.isEshopActive ? fields.isEshopActive.booleanValue : false);
      if (!activeFlag) {
        setIsEshopActive(false);
        setLoading(false);
        return;
      }

      setIsEshopActive(true);
      setResolvedShopId(finalShopId);

      // 2. Fetch Shop Profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('shop_profiles')
        .select('*')
        .eq('shop_id', finalShopId)
        .single();

      if (!profileError && profileData) {
        setShopProfile(profileData);
      }

      // 3. Fetch Products from Supabase
      const { data: stockData, error: stockError } = await supabase
        .from('shop_inventory')
        .select('*')
        .eq('shop_id', finalShopId);

      if (stockError) throw stockError;

      // Only show products that are in stock (stock > 0)
      const inStockProducts = (stockData || []).filter(p => p && p.name && Number(p.stock) > 0);
      setProducts(inStockProducts);

      // Auto-clean cart: remove items no longer available or out-of-stock
      setCart(prevCart => {
        const inStockIds = new Set(inStockProducts.map(p => String(p.product_id)));
        const cleanedCart = { ...prevCart };
        let cleaned = false;
        Object.keys(cleanedCart).forEach(pid => {
          if (!inStockIds.has(pid)) {
            delete cleanedCart[pid];
            cleaned = true;
          }
        });
        if (cleaned) {
          showToast('Kuch items out of stock ho gaye — cart updated.', 'error');
        }
        return cleanedCart;
      });
    } catch (e) {
      console.error('Error fetching shop data:', e);
      setLoadError('Failed to load the store. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = new Set(products.map((p) => (p.category || 'General').trim()).filter(Boolean));
    return ['All', ...Array.from(categories)];
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery.trim() || (p.name || '').toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (p.category || 'General').trim() === selectedCategory;
    // products are already filtered to in-stock only
    return matchesSearch && matchesCategory;
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
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  // Lock body scroll + Escape key while the cart sheet is open
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
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        .eshop-page {
          --primary: #0EA64E;
          --primary-dark: #0B8A41;
          --primary-grad: linear-gradient(135deg, #16C060 0%, #0EA64E 55%, #0B8A41 100%);
          --bg: #F5F6F8;
          --card: #FFFFFF;
          --border: #ECEEF1;
          --text: #171C22;
          --text-dim: #5B6470;
          --text-faint: #9099A6;
          --radius: 16px;
          --shadow-card: 0 1px 2px rgba(20, 30, 45, 0.05), 0 6px 18px rgba(20, 30, 45, 0.05);
          --shadow-pop: 0 12px 40px rgba(20, 30, 45, 0.16);
          --safe-bottom: env(safe-area-inset-bottom, 0px);
          --font-display: 'Plus Jakarta Sans', sans-serif;
          --font-sans: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-sans);
          min-height: 100vh;
          line-height: 1.5;
          box-sizing: border-box;
        }
        .eshop-page *, .eshop-page *::before, .eshop-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .eshop-page img { max-width: 100%; display: block; }
        .eshop-page button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        .eshop-page input { font-family: inherit; }

        /* ============ Header (app-bar) ============ */
        .eshop-page header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          border-bottom: 1px solid var(--border);
        }
        .eshop-page .appbar {
          max-width: 1100px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .eshop-page .shop-id {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .eshop-page .shop-avatar {
          width: 42px; height: 42px;
          border-radius: 13px;
          background: var(--primary-grad);
          color: #fff;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 6px 16px rgba(14, 166, 78, 0.35);
        }
        .eshop-page .shop-id .meta { min-width: 0; }
        .eshop-page .shop-id h1 {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.02rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .eshop-page .open-line {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          color: var(--text-dim);
        }
        .eshop-page .live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 0 0 rgba(14, 166, 78, 0.5);
          animation: eshop-pulse 2s infinite;
        }
        @keyframes eshop-pulse {
          0% { box-shadow: 0 0 0 0 rgba(14, 166, 78, 0.5); }
          70% { box-shadow: 0 0 0 7px rgba(14, 166, 78, 0); }
          100% { box-shadow: 0 0 0 0 rgba(14, 166, 78, 0); }
        }
        .eshop-page .cart-btn {
          position: relative;
          width: 44px; height: 44px;
          border-radius: 13px;
          background: var(--card);
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          color: var(--text);
          transition: transform 0.15s ease;
        }
        .eshop-page .cart-btn:hover { transform: translateY(-1px); }
        .eshop-page .cart-btn svg { width: 21px; height: 21px; }
        .eshop-page .cart-count-badge {
          position: absolute;
          top: -5px; right: -5px;
          min-width: 20px; height: 20px;
          padding: 0 5px;
          border-radius: 999px;
          background: var(--primary-grad);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          display: grid;
          place-items: center;
          border: 2px solid #fff;
        }

        /* ============ Store banner ============ */
        .eshop-page .wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px; }

        .eshop-page .banner {
          margin-top: 16px;
          border-radius: 20px;
          background: var(--primary-grad);
          padding: 20px;
          color: #fff;
          box-shadow: 0 12px 30px rgba(14, 166, 78, 0.28);
          position: relative;
          overflow: hidden;
        }
        .eshop-page .banner::after {
          content: '';
          position: absolute;
          right: -40px; top: -50px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
        }
        .eshop-page .banner::before {
          content: '';
          position: absolute;
          right: 40px; bottom: -60px;
          width: 130px; height: 130px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.10);
        }
        .eshop-page .banner .b-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.35);
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          margin-bottom: 10px;
          position: relative; z-index: 1;
        }
        .eshop-page .banner h2 {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1.15;
          position: relative; z-index: 1;
          word-break: break-word;
        }
        .eshop-page .banner .b-sub { font-size: 0.85rem; color: rgba(255,255,255,0.92); margin-top: 4px; position: relative; z-index: 1; }
        .eshop-page .banner .b-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
          position: relative; z-index: 1;
        }
        .eshop-page .b-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.16);
          border: 1px solid rgba(255,255,255,0.28);
          padding: 7px 12px;
          border-radius: 11px;
          font-size: 0.76rem;
          font-weight: 600;
          max-width: 100%;
        }
        .eshop-page .b-chip svg { width: 14px; height: 14px; flex-shrink: 0; }
        .eshop-page .b-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .eshop-page .b-chip a { color: inherit; text-decoration: none; }

        /* ============ Search ============ */
        .eshop-page .search-box {
          position: relative;
          margin: 20px 0 4px;
        }
        .eshop-page .search-box svg {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          width: 19px; height: 19px;
          color: var(--text-faint);
          pointer-events: none;
        }
        .eshop-page .search-box input {
          width: 100%;
          padding: 13px 16px 13px 46px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.92rem;
          outline: none;
          box-shadow: var(--shadow-card);
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }
        .eshop-page .search-box input::placeholder { color: var(--text-faint); }
        .eshop-page .search-box input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(14, 166, 78, 0.12); }

        /* ============ Category chips ============ */
        .eshop-page .cat-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 12px 2px 8px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .eshop-page .cat-tabs::-webkit-scrollbar { display: none; }
        .eshop-page .cat-tab {
          flex-shrink: 0;
          padding: 8px 16px;
          border-radius: 999px;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text-dim);
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: var(--shadow-card);
          transition: all 0.2s ease;
        }
        .eshop-page .cat-tab.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
          box-shadow: 0 6px 14px rgba(14, 166, 78, 0.3);
        }

        .eshop-page .meta-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 8px 0 14px;
          font-size: 0.78rem;
          color: var(--text-faint);
        }
        .eshop-page .meta-line strong { color: var(--text-dim); }

        /* ============ Product grid ============ */
        .eshop-page .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding-bottom: 120px;
        }

        .eshop-page .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-card);
          animation: eshop-fadeUp 0.35s ease both;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .eshop-page .card:active { transform: scale(0.98); }
        @keyframes eshop-fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .eshop-page .thumb {
          position: relative;
          aspect-ratio: 1 / 0.82;
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .eshop-page .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .eshop-page .thumb .monogram {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 2.6rem;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.18);
        }
        .eshop-page .stock-badge {
          position: absolute;
          top: 8px; left: 8px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 0.64rem;
          font-weight: 700;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .eshop-page .stock-badge.in { background: rgba(255,255,255,0.85); color: var(--primary-dark); }
        .eshop-page .stock-badge.out { background: rgba(30,30,30,0.6); color: #fff; }

        .eshop-page .card-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .eshop-page .card-cat { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: var(--text-faint); }
        .eshop-page .card-title {
          font-weight: 700;
          font-size: 0.92rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.4em;
        }
        .eshop-page .card-unit { font-size: 0.74rem; color: var(--text-faint); }

        .eshop-page .card-foot {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .eshop-page .price { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; color: var(--text); }

        .eshop-page .add-btn {
          padding: 8px 16px;
          border-radius: 11px;
          background: var(--primary);
          color: #fff;
          font-weight: 800;
          font-size: 0.8rem;
          box-shadow: 0 5px 12px rgba(14, 166, 78, 0.3);
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .eshop-page .add-btn:hover { background: var(--primary-dark); }
        .eshop-page .add-btn.disabled {
          background: #F1F2F4;
          color: var(--text-faint);
          box-shadow: none;
          cursor: not-allowed;
        }

        .eshop-page .qty-control {
          display: flex;
          align-items: center;
          gap: 2px;
          border: 1.5px solid var(--primary);
          border-radius: 11px;
          overflow: hidden;
          background: #fff;
        }
        .eshop-page .qty-btn {
          width: 30px; height: 30px;
          display: grid;
          place-items: center;
          color: var(--primary);
          font-size: 1.15rem;
          font-weight: 800;
        }
        .eshop-page .qty-btn:hover { background: rgba(14, 166, 78, 0.08); }
        .eshop-page .qty-val {
          min-width: 24px;
          text-align: center;
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--primary-dark);
        }

        /* Skeleton */
        .eshop-page .skel { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .eshop-page .skel-img { aspect-ratio: 1/0.82; background: linear-gradient(100deg, #F0F1F3 40%, #E7E9EC 50%, #F0F1F3 60%); background-size: 200% 100%; animation: eshop-shimmer 1.3s infinite; }
        .eshop-page .skel-line { height: 13px; margin: 12px; border-radius: 8px; background: linear-gradient(100deg, #F0F1F3 40%, #E7E9EC 50%, #F0F1F3 60%); background-size: 200% 100%; animation: eshop-shimmer 1.3s infinite; }
        .eshop-page .skel-line.short { width: 42%; }
        @keyframes eshop-shimmer { to { background-position: -200% 0; } }

        /* States */
        .eshop-page .state { text-align: center; padding: 60px 16px; color: var(--text-faint); }
        .eshop-page .state-icon {
          width: 68px; height: 68px;
          margin: 0 auto 16px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-card);
          display: grid;
          place-items: center;
        }
        .eshop-page .state-icon svg { width: 32px; height: 32px; color: var(--primary); }
        .eshop-page .state h3 { font-family: var(--font-display); color: var(--text); font-weight: 800; font-size: 1.15rem; margin-bottom: 6px; }
        .eshop-page .state p { font-size: 0.85rem; max-width: 360px; margin: 0 auto; }
        .eshop-page .state .tiny { font-size: 0.72rem; margin-top: 14px; color: var(--text-faint); }
        .eshop-page .state .retry-btn {
          margin-top: 20px;
          display: inline-flex;
          padding: 12px 24px;
          border-radius: 12px;
          background: var(--primary);
          color: #fff;
          font-weight: 800;
          font-size: 0.88rem;
          box-shadow: 0 8px 20px rgba(14, 166, 78, 0.3);
        }
        .eshop-page .state .retry-btn:hover { background: var(--primary-dark); }

        .eshop-page .spinner {
          width: 40px; height: 40px;
          margin: 0 auto 18px;
          border: 3px solid rgba(14, 166, 78, 0.15);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: eshop-spin 0.7s linear infinite;
        }
        @keyframes eshop-spin { to { transform: rotate(360deg); } }

        /* ============ Footer ============ */
        .eshop-page footer {
          border-top: 1px solid var(--border);
          background: var(--card);
          padding: 22px 16px calc(22px + var(--safe-bottom));
          text-align: center;
          margin-top: 8px;
        }
        .eshop-page footer .f-brand { font-family: var(--font-display); font-weight: 800; color: var(--text-dim); font-size: 0.9rem; }
        .eshop-page footer .f-brand span { color: var(--primary); }
        .eshop-page footer p { font-size: 0.72rem; color: var(--text-faint); margin-top: 4px; }

        /* ============ Bottom cart bar ============ */
        .eshop-page .bar {
          position: fixed;
          left: 12px; right: 12px;
          bottom: calc(12px + var(--safe-bottom));
          z-index: 150;
          background: var(--primary-grad);
          color: #fff;
          border-radius: 18px;
          box-shadow: 0 14px 40px rgba(14, 166, 78, 0.42);
          padding: 10px 12px;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          max-width: 620px;
          margin: 0 auto;
          transition: transform 0.25s ease;
          display: none;
        }
        .eshop-page .bar.show { display: flex; animation: eshop-barIn 0.3s cubic-bezier(0.21, 1.02, 0.73, 1); }
        @keyframes eshop-barIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .eshop-page .bar .b-icon {
          width: 40px; height: 40px;
          border-radius: 13px;
          background: rgba(255,255,255,0.18);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          position: relative;
        }
        .eshop-page .bar .b-icon svg { width: 20px; height: 20px; }
        .eshop-page .bar .b-count {
          position: absolute;
          top: -4px; right: -4px;
          min-width: 18px; height: 18px;
          padding: 0 4px;
          border-radius: 999px;
          background: #fff;
          color: var(--primary-dark);
          font-size: 0.68rem;
          font-weight: 800;
          display: grid;
          place-items: center;
        }
        .eshop-page .bar .b-info { flex: 1; min-width: 0; }
        .eshop-page .bar .b-total { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; }
        .eshop-page .bar .b-note { font-size: 0.72rem; opacity: 0.9; }
        .eshop-page .bar .b-go {
          background: #fff;
          color: var(--primary-dark);
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.82rem;
          white-space: nowrap;
        }

        /* ============ Bottom sheet (cart) ============ */
        .eshop-page .overlay {
          position: fixed; inset: 0;
          background: rgba(10, 15, 25, 0.5);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 200;
        }
        .eshop-page .overlay.open { opacity: 1; pointer-events: auto; }

        .eshop-page .sheet {
          position: fixed;
          left: 0; right: 0;
          bottom: 0;
          z-index: 201;
          max-width: 520px;
          margin: 0 auto;
          background: var(--bg);
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -20px 60px rgba(10, 15, 25, 0.25);
          transform: translateY(105%);
          transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
          display: flex;
          flex-direction: column;
          max-height: 88vh;
          overflow: hidden;
        }
        .eshop-page .sheet.open { transform: translateY(0); }

        .eshop-page .sheet-handle {
          width: 40px; height: 4px;
          border-radius: 999px;
          background: #D8DCE2;
          margin: 10px auto 0;
        }
        .eshop-page .sheet-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px 10px;
          border-bottom: 1px solid var(--border);
        }
        .eshop-page .sheet-head h2 { font-family: var(--font-display); font-size: 1.05rem; font-weight: 800; }
        .eshop-page .sheet-head .close-x {
          width: 32px; height: 32px;
          border-radius: 10px;
          background: var(--card);
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          font-size: 1rem;
          color: var(--text-dim);
        }

        .eshop-page .sheet-body { flex: 1; overflow-y: auto; padding: 16px 18px; -webkit-overflow-scrolling: touch; }

        .eshop-page .cart-items { display: flex; flex-direction: column; gap: 10px; }
        .eshop-page .cart-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--shadow-card);
        }
        .eshop-page .cart-row .thumb {
          width: 46px; height: 46px;
          border-radius: 11px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1rem;
          color: rgba(255,255,255,0.95);
        }
        .eshop-page .cart-row .info { flex: 1; min-width: 0; }
        .eshop-page .cart-row .info h4 { font-size: 0.84rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .eshop-page .cart-row .info p { font-size: 0.72rem; color: var(--text-faint); }

        .eshop-page .checkout { margin-top: 16px; }
        .eshop-page .checkout h3 {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        .eshop-page .field { margin-bottom: 10px; }
        .eshop-page .field input {
          width: 100%;
          padding: 13px 15px;
          border-radius: 13px;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.9rem;
          outline: none;
          box-shadow: var(--shadow-card);
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }
        .eshop-page .field input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(14, 166, 78, 0.12); }

        .eshop-page .upi-box {
          margin-bottom: 14px;
          padding: 14px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          text-align: center;
        }
        .eshop-page .upi-box p {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--primary-dark);
          margin-bottom: 10px;
        }
        .eshop-page .upi-box .qr {
          width: 150px; height: 150px;
          margin: 0 auto;
          background: #fff;
          padding: 6px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .eshop-page .upi-box .qr img { width: 100%; height: 100%; }
        .eshop-page .upi-box small { display: block; font-size: 0.7rem; color: var(--text-faint); margin-top: 8px; }

        .eshop-page .sheet-foot {
          padding: 14px 18px calc(16px + var(--safe-bottom));
          border-top: 1px solid var(--border);
          background: var(--card);
        }
        .eshop-page .total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }
        .eshop-page .total-row .lbl { font-size: 0.84rem; color: var(--text-dim); }
        .eshop-page .total-row .amt { font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; }

        .eshop-page .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          background: var(--primary-grad);
          color: #fff;
          font-weight: 800;
          font-size: 0.98rem;
          box-shadow: 0 8px 24px rgba(14, 166, 78, 0.35);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .eshop-page .submit-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
        .eshop-page .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .eshop-page .submit-btn svg { width: 18px; height: 18px; }

        /* Success */
        .eshop-page .success-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 34px 0 20px;
        }
        .eshop-page .success-ring {
          width: 82px; height: 82px;
          border-radius: 50%;
          background: rgba(14, 166, 78, 0.1);
          border: 2px solid rgba(14, 166, 78, 0.35);
          display: grid;
          place-items: center;
          margin-bottom: 18px;
          animation: eshop-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .eshop-page .success-ring svg { width: 40px; height: 40px; color: var(--primary); }
        @keyframes eshop-pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .eshop-page .success-view h2 { font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; margin-bottom: 8px; }
        .eshop-page .success-view p { color: var(--text-dim); font-size: 0.85rem; max-width: 320px; margin: 0 auto; }
        .eshop-page .success-view .order-id {
          margin-top: 12px;
          display: inline-block;
          background: rgba(14, 166, 78, 0.1);
          color: var(--primary-dark);
          font-weight: 800;
          font-size: 0.8rem;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(14, 166, 78, 0.3);
        }

        /* Toast */
        .eshop-page .toast-wrap {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 300;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: calc(100% - 32px);
          max-width: 400px;
          pointer-events: none;
        }
        .eshop-page .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(23, 28, 34, 0.95);
          color: #fff;
          font-size: 0.84rem;
          font-weight: 600;
          box-shadow: var(--shadow-pop);
          animation: eshop-toastIn 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
        }
        .eshop-page .toast.success { border-left: 3px solid #34D399; }
        .eshop-page .toast.error { border-left: 3px solid #F87171; }
        .eshop-page .toast svg { width: 18px; height: 18px; flex-shrink: 0; }
        .eshop-page .toast.success svg { color: #34D399; }
        .eshop-page .toast.error svg { color: #F87171; }
        @keyframes eshop-toastIn { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }

        /* ============ Responsive ============ */
        @media (min-width: 600px) {
          .eshop-page .grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
          .eshop-page .card-title { font-size: 0.95rem; }
        }
        @media (min-width: 960px) {
          .eshop-page .grid { grid-template-columns: repeat(4, 1fr); }
          .eshop-page .appbar { padding: 14px 20px; }
        }
        @media (min-width: 1100px) {
          .eshop-page .sheet { border-radius: 26px 26px 0 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .eshop-page *, .eshop-page *::before, .eshop-page *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }
        }
      ` }} />

      {/* ============ Header (app-bar) ============ */}
      <header>
        <div className="appbar">
          <div className="shop-id">
            <div className="shop-avatar">{avatarLetter}</div>
            <div className="meta">
              <h1>{isEshopActive && shopProfile ? shopProfile.name : 'Online Store'}</h1>
              <div className="open-line">
                <span className="live-dot"></span>
                <span>{isEshopActive ? 'Open now · live catalog' : 'Store offline'}</span>
              </div>
            </div>
          </div>
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3a1 1 0 00.7 1.7H19M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
            <span className="cart-count-badge">{getCartCount()}</span>
          </button>
        </div>
      </header>

      <div className="wrap">

        {loading ? (
          /* ============ Loading skeletons ============ */
          <div className="grid" style={{ paddingTop: '16px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skel" key={i}>
                <div className="skel-img"></div>
                <div className="skel-line"></div>
                <div className="skel-line short"></div>
              </div>
            ))}
          </div>
        ) : !isEshopActive ? (
          /* ============ Store inactive / suspended ============ */
          <div className="state" style={{ paddingTop: '80px' }}>
            <div className="state-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 4h.01m-6.9 7h13.8a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0L3.2 18a2 2 0 001.7 3z"/></svg>
            </div>
            <h3>Store Inactive or Suspended</h3>
            <p>This E-Shop link is currently disabled by the administrator or the storekeeper's subscription has expired.</p>
            <p className="tiny">If you are the store owner, please renew your E-Shop addon plan in the billing screen.</p>
          </div>
        ) : loadError ? (
          /* ============ Error state ============ */
          <div className="state" style={{ paddingTop: '80px' }}>
            <div className="state-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.9 5h13.8a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0L3.2 17a2 2 0 001.7 3z"/></svg>
            </div>
            <h3>Couldn't load the store</h3>
            <p>{loadError}</p>
            <button className="retry-btn" onClick={fetchShopData}>Try Again</button>
          </div>
        ) : (
          <>
            {/* ============ Store banner ============ */}
            <section className="banner">
              <div className="b-tag">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 12, height: 12 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Verified store
              </div>
              <h2>{shopProfile && shopProfile.name ? shopProfile.name : 'My Store'}</h2>
              <p className="b-sub">{shopProfile && shopProfile.tagline ? shopProfile.tagline : 'Order from our catalog — we serve you fast.'}</p>
              <div className="b-chips">
                <span className="b-chip">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>{shopProfile && shopProfile.address ? shopProfile.address : 'Local store'}</span>
                </span>
                <span className="b-chip">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {contactHref ? <a href={contactHref}>{contact}</a> : <span>{contact || 'Call to order'}</span>}
                </span>
                <span className="b-chip">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  <span>{shopProfile && shopProfile.upi_id ? shopProfile.upi_id : 'Cash on delivery'}</span>
                </span>
              </div>
            </section>

            {orderPlaced ? (
              /* ============ Order placed (success card) ============ */
              <div className="state" style={{ paddingTop: '80px' }}>
                <div className="success-ring">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3>Order Placed Successfully!</h3>
                <p>Thanks, {placedName}! Your order of <b>{fmtPrice(placedTotal)}</b> is confirmed. The store will contact you soon.</p>
                <span className="order-id">Order ID: {placedOrderId}</span>
                <div>
                  <button
                    onClick={() => { setOrderPlaced(false); setCartOpen(false); }}
                    className="retry-btn"
                  >
                    Order More Items
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ============ Search ============ */}
                <div className="search-box">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input
                    type="search"
                    placeholder="Search items… e.g. Sugar, Tea, Oil"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* ============ Category chips ============ */}
                <div className="cat-tabs">
                  {getCategories().map((cat) => (
                    <button
                      key={cat}
                      className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="meta-line">
                  <span>
                    <strong>{filteredProducts.length}</strong> item{filteredProducts.length === 1 ? '' : 's'} available
                  </span>
                </div>

                {/* ============ Catalog ============ */}
                {filteredProducts.length === 0 ? (
                  <div className="state" style={{ paddingTop: '40px' }}>
                    <div className="state-icon">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3a3 3 0 01-6 0H4"/></svg>
                    </div>
                    <h3>{products.length === 0 ? 'No items yet' : 'Nothing found'}</h3>
                    <p>
                      {products.length === 0
                        ? "The store hasn't added products to its online catalog. Check back soon!"
                        : 'Try a different keyword or category.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid">
                    {filteredProducts.map((p, i) => {
                      const inStock = stockOf(p) > 0;
                      const qty = cart[String(p.product_id)] || 0;
                      return (
                        <div className="card" style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }} key={p.product_id}>
                          <Thumb p={p} />
                          <div className="card-body">
                            <div className="card-cat">{p.category || 'General'}</div>
                            <div className="card-title">{p.name}</div>
                            <div className="card-unit">{p.unit || 'Pcs'}{inStock ? ` · ${stockOf(p)} left` : ''}</div>
                            <div className="card-foot">
                              <div className="price">{fmtPrice(p.price)}</div>
                              {inStock ? (
                                qty === 0 ? (
                                  <button className="add-btn" onClick={() => addToCart(p, 1)}>ADD</button>
                                ) : (
                                  <div className="qty-control">
                                    <button className="qty-btn" onClick={() => addToCart(p, -1)} aria-label="Decrease">−</button>
                                    <span className="qty-val">{qty}</span>
                                    <button className="qty-btn" onClick={() => addToCart(p, 1)} aria-label="Increase">+</button>
                                  </div>
                                )
                              ) : (
                                <button className="add-btn disabled" disabled>Unavailable</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ============ Footer ============ */}
      <footer>
        <div className="f-brand">Powered by <span>MeriShop</span> POS</div>
        <p>Order now — the store gets your request instantly.</p>
      </footer>

      {/* ============ Bottom cart bar ============ */}
      {isEshopActive && !orderPlaced && getCartCount() > 0 && (
        <div className="bar show" onClick={() => setCartOpen(true)}>
          <div className="b-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3a1 1 0 00.7 1.7H19M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
            <span className="b-count">{getCartCount()}</span>
          </div>
          <div className="b-info">
            <div className="b-total">{fmtPrice(getCartTotal())}</div>
            <div className="b-note">{getCartCount()}{getCartCount() === 1 ? ' item' : ' items'} in basket</div>
          </div>
          <div className="b-go">View Cart →</div>
        </div>
      )}

      {/* ============ Cart bottom sheet ============ */}
      {isEshopActive && (
        <>
          <div className={`overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}></div>
          <div className={`sheet ${cartOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Cart">
            <div className="sheet-handle"></div>
            <div className="sheet-head">
              <h2>{orderPlaced ? 'Order Confirmed' : 'Your Basket'}</h2>
              <button className="close-x" onClick={() => setCartOpen(false)} aria-label="Close">✕</button>
            </div>

            {orderPlaced ? (
              <>
                <div className="sheet-body">
                  <div className="success-view">
                    <div className="success-ring">
                      <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h2>Order Placed!</h2>
                    <p>Thanks, {placedName}! Your order of {fmtPrice(placedTotal)} is confirmed. The store will contact you on {customerPhone || 'your phone'}.</p>
                    <span className="order-id">Order ID: {placedOrderId}</span>
                  </div>
                </div>
                <div className="sheet-foot">
                  <button
                    className="submit-btn"
                    onClick={() => { setOrderPlaced(false); setCartOpen(false); }}
                  >
                    Done — Back to Catalog
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="sheet-body">
                  {cartItems.length === 0 ? (
                    <div className="state" style={{ padding: '30px 8px' }}>
                      <div className="state-icon" style={{ width: 56, height: 56, borderRadius: 18 }}>
                        <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ width: 26, height: 26 }}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3a1 1 0 00.7 1.7H19M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/></svg>
                      </div>
                      <h3>Basket is empty</h3>
                      <p>Add items from the catalog to place an order.</p>
                    </div>
                  ) : (
                    <>
                      <div className="cart-items">
                        {cartItems.map(({ product, qty }) => (
                          <div className="cart-row" key={product.product_id}>
                            <div className="thumb" style={{ background: gradFor(product) }}>
                              {String(product.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="info">
                              <h4>{product.name}</h4>
                              <p>{fmtPrice(product.price)} × {qty} = <b>{fmtPrice((Number(product.price) || 0) * qty)}</b></p>
                            </div>
                            <div className="qty-control">
                              <button className="qty-btn" onClick={() => addToCart(product, -1)} aria-label="Decrease">−</button>
                              <span className="qty-val">{qty}</span>
                              <button className="qty-btn" onClick={() => addToCart(product, 1)} aria-label="Increase">+</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {shopProfile && shopProfile.upi_id && (
                        <div className="upi-box">
                          <p>Scan & Pay Instantly</p>
                          <div className="qr">
                            <img src={getQrCodeImageUrl()} alt="UPI Payment QR Code" />
                          </div>
                          <small>Scan using GPay, PhonePe, or Paytm. Pay <b>{fmtPrice(getCartTotal())}</b> & complete details below.</small>
                        </div>
                      )}

                      <div className="checkout">
                        <h3>Delivery details</h3>
                        <div className="field">
                          <input
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <input
                            type="tel"
                            placeholder="10-digit mobile number"
                            autoComplete="tel"
                            inputMode="numeric"
                            maxLength="10"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="sheet-foot">
                  <div className="total-row">
                    <span className="lbl">Order total</span>
                    <span className="amt">{fmtPrice(getCartTotal())}</span>
                  </div>
                  <button
                    className="submit-btn"
                    onClick={handlePlaceOrder}
                    disabled={placing || cartItems.length === 0}
                  >
                    {placing ? (
                      'Placing order…'
                    ) : (
                      <>
                        <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ============ Toasts ============ */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div className={`toast ${t.type}`} key={t.id}>
            {t.type === 'error' ? (
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>
            ) : (
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            )}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
