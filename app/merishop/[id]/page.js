'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = 'https://zmrxufpijlvwjazhtpyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EShopCustomerPage() {
  const params = useParams();
  const shopId = params.id ? params.id : '';
  const [resolvedShopId, setResolvedShopId] = useState('');

  const [shopProfile, setShopProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEshopActive, setIsEshopActive] = useState(true); // Control flag from Firebase
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({}); // productId: { product, quantity }
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Fetch stock and shop profile from Supabase after validating with Firebase
  useEffect(() => {
    if (shopId) {
      fetchShopData();
    }
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      
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
      setProducts(stockData || []);
    } catch (e) {
      console.error('Error fetching shop data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = new Set(products.map((p) => p.category || 'General'));
    return ['All', ...Array.from(categories)];
  };

  const updateCartQty = (product, delta) => {
    const id = product.product_id;
    setCart((prev) => {
      const current = prev[id];
      const newQty = (current ? current.quantity : 0) + delta;

      if (newQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }

      return {
        ...prev,
        [id]: {
          product,
          quantity: newQty,
        },
      };
    });
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((count, item) => count + item.quantity, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    try {
      const itemsList = Object.values(cart).map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const totalAmt = getCartTotal();
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const { error } = await supabase.from('online_orders').insert([
        {
          id: orderId,
          shop_id: resolvedShopId,
          customer_name: customerName,
          customer_phone: customerPhone,
          items: itemsList,
          total_amount: totalAmt,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setPlacedOrderId(orderId);
      setOrderPlaced(true);
      setCart({});
      setShowOrderModal(false);
    } catch (e) {
      alert('Error placing order: ' + e.message);
    }
  };

  // Generate dynamic UPI Payment URI for QR code
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

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (p.category || 'General') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-[#E27D2F]/20 selection:text-[#E27D2F] relative">
      <style dangerouslySetInnerHTML={{ __html: `
        /* --- Premium E-Store Custom Styling --- */
        body {
          background-color: #F8F9FB !important;
          color: #2D2322 !important;
          font-family: 'Poppins', 'Outfit', sans-serif !important;
        }
        
        /* Dark Header matching real App Topbar */
        header {
          background: #1A1A1A !important;
          color: white !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 100 !important;
          padding: 14px 20px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .header-container {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.15rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #FFFFFF !important;
          flex: 1;
          text-align: center;
          margin-left: 28px;
        }

        /* Buttons & Inputs */
        input[type="text"], input[type="tel"] {
          width: 100%;
          background: #FFFFFF !important;
          border: 1px solid #EADCC9 !important;
          border-radius: 14px !important;
          padding: 12px 16px !important;
          color: #2D2322 !important;
          font-size: 0.9rem !important;
          outline: none !important;
          transition: all 0.2s ease !important;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05) !important;
        }

        input[type="text"]:focus, input[type="tel"]:focus {
          border-color: #E27D2F !important;
          box-shadow: 0 0 0 3px rgba(226, 125, 47, 0.15) !important;
        }

        /* Category Selector Pills */
        .category-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin: 16px 0;
          scrollbar-width: none;
        }
        .category-container::-webkit-scrollbar {
          display: none;
        }

        .category-tab-btn {
          background: #FFFFFF !important;
          color: #7C6E6B !important;
          border: 1px solid #EADCC9 !important;
          padding: 6px 16px !important;
          border-radius: 20px !important;
          font-size: 0.8rem !important;
          font-weight: 500 !important;
          cursor: pointer;
          white-space: nowrap;
        }

        .category-tab-btn.active {
          background: #E27D2F !important;
          color: #FFFFFF !important;
          border-color: #E27D2F !important;
          box-shadow: 0 4px 10px rgba(226, 125, 47, 0.2) !important;
        }

        /* Product Cards Grid */
        .product-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .product-card {
          background: #FFFFFF !important;
          border: 1px solid rgba(234, 220, 201, 0.4) !important;
          border-radius: 16px !important;
          padding: 16px !important;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease !important;
          box-shadow: 0 2px 12px rgba(234, 220, 201, 0.08) !important;
        }

        .product-card:hover {
          transform: translateY(-2px) !important;
          border-color: #F5C082 !important;
          box-shadow: 0 4px 16px rgba(226, 125, 47, 0.06) !important;
        }

        .product-info .category {
          font-size: 0.65rem;
          background: #FFF5ED !important;
          color: var(--primary-dark);
          padding: 1px 6px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 4px;
          font-weight: 600;
        }

        /* Qty controls */
        .qty-controls-box {
          display: flex;
          align-items: center;
          background: #FFF5ED !important;
          border: 1px solid rgba(226, 125, 47, 0.15) !important;
          border-radius: 20px !important;
          padding: 2px !important;
        }

        .qty-control-btn {
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: white !important;
          border: none !important;
          border-radius: 50% !important;
          font-weight: bold !important;
          font-size: 0.9rem !important;
          cursor: pointer !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }

        .qty-control-btn.minus { color: #B1550C !important; }
        .qty-control-btn.plus { color: #E27D2F !important; }

        /* Verified Badge */
        .verified-badge {
          background: rgba(46, 125, 50, 0.08) !important;
          color: #2E7D32 !important;
          border: 1px solid rgba(46, 125, 50, 0.2) !important;
          font-size: 0.7rem !important;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          display: inline-block;
        }

        /* Merchant Card Banner */
        .merchant-banner-card {
          background: #FFFFFF !important;
          border: 1px solid #EADCC9 !important;
          border-radius: 20px !important;
          padding: 20px !important;
          margin-bottom: 16px !important;
          box-shadow: 0 4px 20px rgba(45, 35, 34, 0.05) !important;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }

        .shop-logo-circle {
          width: 60px;
          height: 60px;
          background: #FFF5ED !important;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .shop-logo-icon {
          color: #E27D2F !important;
          width: 32px;
          height: 32px;
        }

        .shop-info-text {
          flex: 1;
        }

        .shop-info-text h2 {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.4rem !important;
          font-weight: 850 !important;
          color: #E27D2F !important;
          line-height: 1.2;
        }

        .shop-info-text p {
          font-size: 0.8rem !important;
          color: #7C6E6B !important;
          margin-top: 4px;
          font-weight: 500;
        }

        .date-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 0.75rem;
          color: #7C6E6B !important;
          font-weight: 500;
        }

        /* Details Card */
        .details-card {
          background: #FFFFFF !important;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(45, 35, 34, 0.04) !important;
          border: 1px solid rgba(234, 220, 201, 0.5) !important;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #2D2322;
        }

        .detail-row svg {
          width: 18px;
          height: 18px;
          color: #E27D2F;
          flex-shrink: 0;
        }

        .detail-row span {
          font-weight: 500;
        }

        /* Soft Banner */
        .status-banner {
          background: #FFF5ED !important;
          border: 1px solid rgba(226, 125, 47, 0.2) !important;
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-banner-icon {
          color: #E27D2F !important;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .status-banner-text h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #B1550C;
        }

        .status-banner-text p {
          font-size: 0.75rem;
          color: #7C6E6B;
          margin-top: 1px;
        }

        /* Floating Bottom Cart Pill */
        .floating-cart-pill {
          position: fixed !important;
          bottom: 24px !important;
          left: 16px !important;
          right: 16px !important;
          max-width: 500px !important;
          margin: 0 auto !important;
          padding: 12px 16px !important;
          background: rgba(30, 30, 30, 0.95) !important;
          border: 1px solid rgba(226, 125, 47, 0.3) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border-radius: 20px !important;
          box-shadow: 0 8px 30px rgba(226, 125, 47, 0.15) !important;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 99 !important;
        }

        /* Order Modal styling */
        .modal-overlay {
          position: fixed !important;
          inset: 0 !important;
          background: rgba(45, 35, 34, 0.5) !important;
          backdrop-filter: blur(4px) !important;
          z-index: 1000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px !important;
        }

        .modal-card {
          background: #FFFFFF !important;
          border: 1px solid #EADCC9 !important;
          border-radius: 24px !important;
          padding: 24px !important;
          width: 100% !important;
          max-width: 400px !important;
          box-shadow: 0 12px 30px rgba(45, 35, 34, 0.15) !important;
          color: #2D2322 !important;
        }
      ` }} />

      {/* Header */}
      <header className="sticky top-0 bg-[#1A1A1A] text-white z-30">
        <div className="max-w-xl mx-auto px-4 h-14 flex justify-between items-center">
          <div style={{ width: '24px' }}></div> {/* spacer */}
          <h1 className="header-title" id="headerShopName">
            {isEshopActive && shopProfile ? shopProfile.name : 'MY STORE'}
          </h1>
          <button onClick={fetchShopData} className="text-white hover:text-[#E27D2F] p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative max-w-xl mx-auto px-4 py-4 pb-32 z-10">
        
        {loading ? (
          <div className="text-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E27D2F] mx-auto" />
            <p className="text-slate-500 mt-4 text-sm font-medium">Connecting to live database...</p>
          </div>
        ) : !isEshopActive ? (
          /* Store Suspended / Inactive Screen */
          <div className="text-center py-20 bg-white border border-[#EADCC9] rounded-3xl p-10 max-w-md mx-auto mt-16 shadow-lg">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl border border-red-200">
              🔒
            </div>
            <h2 className="text-xl font-extrabold text-[#2D2322]">
              Store Inactive or Suspended
            </h2>
            <p className="text-[#7C6E6B] mt-3 text-sm leading-relaxed">
              This E-Shop link is currently disabled by the administrator or the storekeeper's subscription has expired.
            </p>
            <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
              If you are the store owner, please renew your E-Shop addon plan in the billing screen.
            </div>
          </div>
        ) : (
          <>
            {/* Shop Info Header Card */}
            {shopProfile && (
              <div className="merchant-banner-card">
                <div className="shop-logo-circle">
                  <svg className="shop-logo-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4v2h16V4zm2 4H2v2l1 10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2l1-10V8zm-4 12H6l-.9-9h13.8l-.9 9zm-10-7h2v5H8v-5zm6 0h2v5h-2v-5z"/></svg>
                </div>
                <div className="shop-info-text">
                  <span className="verified-badge">Verified Merchant</span>
                  <h2 className="text-xl font-extrabold text-[#E27D2F] mt-1">{shopProfile.name}</h2>
                  <p>Aapka Apna Digital Register</p>
                </div>
                <div className="date-badge">
                  {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            )}

            {/* Details Card */}
            {shopProfile && (
              <div className="details-card">
                {shopProfile.address && (
                  <div className="detail-row">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{shopProfile.address}</span>
                  </div>
                )}
                {shopProfile.contact && (
                  <div className="detail-row">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span className="font-semibold">{shopProfile.contact}</span>
                  </div>
                )}
                <div className="detail-row">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  <span>{shopProfile.upi_id ? `UPI ID: ${shopProfile.upi_id}` : 'Payment Mode: Cash on Delivery'}</span>
                </div>
              </div>
            )}

            {/* Active E-Shop connection banner */}
            <div className="status-banner">
              <svg className="status-banner-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div className="status-banner-text">
                <h4>E-Shop Catalog Live</h4>
                <p>Real-time stock synced directly from merchant device</p>
              </div>
            </div>

            {orderPlaced ? (
              <div className="text-center py-16 bg-white border border-[#EADCC9] rounded-3xl p-10 max-w-md mx-auto mt-10 shadow-lg">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full mb-6 font-bold text-2xl">
                  ✓
                </div>
                <h2 className="text-xl font-extrabold text-[#2D2322]">
                  Order Placed Successfully!
                </h2>
                <p className="text-slate-500 mt-2 text-sm font-medium">
                  Order ID: <span className="text-[#E27D2F] font-mono font-bold tracking-wider">{placedOrderId}</span>
                </p>
                <p className="text-[#7C6E6B] mt-3 text-xs leading-relaxed max-w-[280px] mx-auto">
                  The shopkeeper has received your digital order and will prepare/print your bill shortly.
                </p>
                <button 
                  onClick={() => setOrderPlaced(false)}
                  className="mt-8 w-full py-3 bg-[#E27D2F] hover:bg-[#B1550C] text-white font-bold rounded-full transition-all duration-200 shadow-md shadow-[#E27D2F]/20 active:scale-[0.98]"
                >
                  Order More Items
                </button>
              </div>
            ) : (
              <>
                {/* Search & Category Filter */}
                <div className="mb-4 space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search items in stock..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E27D2F] transition-colors">
                      🔍
                    </span>
                  </div>
                  
                  {/* Category selector */}
                  {!loading && (
                    <div className="category-container">
                      {getCategories().map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Products List Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#EADCC9] rounded-3xl p-8">
                    <p className="text-[#7C6E6B] font-bold text-md">No items available in stock</p>
                    <p className="text-slate-400 text-xs mt-1">Try updating your filters or search query.</p>
                  </div>
                ) : (
                  <div className="product-grid">
                    {filteredProducts.map((p) => {
                      const cartItem = cart[p.product_id];
                      const qty = cartItem ? cartItem.quantity : 0;

                      return (
                        <div 
                          key={p.product_id}
                          className="product-card"
                        >
                          <div className="flex-1 pr-4">
                            <span className="category">
                              {p.category || 'General'}
                            </span>
                            <h3 className="text-md font-bold mt-1 text-[#2D2322]">
                              {p.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[#E27D2F] font-extrabold text-md">₹{p.price}</p>
                              {p.unit && <p className="text-slate-400 text-[11px] font-medium">per {p.unit}</p>}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {qty > 0 ? (
                              <div className="qty-controls-box">
                                <button 
                                  onClick={() => updateCartQty(p, -1)}
                                  className="qty-control-btn minus"
                                >
                                  -
                                </button>
                                <span className="px-3 font-extrabold text-sm text-[#E27D2F]">{qty}</span>
                                <button 
                                  onClick={() => updateCartQty(p, 1)}
                                  className="qty-control-btn plus"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => updateCartQty(p, 1)}
                                className="bg-[#E27D2F] text-white px-5 py-2 rounded-full font-bold text-xs"
                              >
                                Add
                              </button>
                            )}
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
      </main>

      {/* Floating Glassmorphic Cart Panel */}
      {isEshopActive && getCartCount() > 0 && (
        <div className="floating-cart-pill">
          <div>
            <p className="text-xs text-slate-350 font-bold uppercase tracking-wider">{getCartCount()} Items Selected</p>
            <p className="text-lg font-black text-[#E27D2F] mt-0.5">Total: ₹{getCartTotal()}</p>
          </div>
          <button
            onClick={() => setShowOrderModal(true)}
            className="bg-[#E27D2F] hover:bg-[#B1550C] text-white px-5 py-3 rounded-full font-bold text-xs tracking-wide transition-all duration-200 active:scale-95"
          >
            Place Digital Order
          </button>
        </div>
      )}

      {/* Order Details & UPI QR Code Dialog Modal */}
      {isEshopActive && showOrderModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-md font-bold text-[#2D2322]">Complete Order Details</h3>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-900 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Render dynamic Merchant UPI QR Code for instant scanning */}
            {shopProfile && shopProfile.upi_id && (
              <div className="mb-4 p-3 bg-slate-50 border border-[#EADCC9] rounded-xl text-center flex flex-col items-center">
                <p className="text-[10px] text-[#E27D2F] uppercase tracking-wider font-extrabold mb-2">
                  Scan & Pay Instantly
                </p>
                <div className="w-[140px] h-[140px] bg-white p-1 rounded-lg border border-[#EADCC9]">
                  <img
                    src={getQrCodeImageUrl()}
                    alt="UPI Payment QR Code"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 max-w-[280px]">
                  Scan using GPay, PhonePe, or Paytm. Enter total amount <span className="text-[#E27D2F] font-bold">₹{getCartTotal()}</span> & complete details.
                </p>
              </div>
            )}
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="E.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="w-1/2 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-550 text-xs font-bold uppercase transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#E27D2F] hover:bg-[#B1550C] text-white rounded-xl text-xs font-bold uppercase transition shadow-md shadow-[#E27D2F]/20"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
