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
  const shopId = params.id;

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
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjId}/databases/(default)/documents/shops/${shopId}`;
      
      const firestoreRes = await fetch(firestoreUrl);
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

      // 2. Fetch Shop Profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('shop_profiles')
        .select('*')
        .eq('shop_id', shopId)
        .single();

      if (!profileError && profileData) {
        setShopProfile(profileData);
      }

      // 3. Fetch Products from Supabase
      const { data: stockData, error: stockError } = await supabase
        .from('shop_inventory')
        .select('*')
        .eq('shop_id', shopId);

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
          shop_id: shopId,
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
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      {/* Dynamic Background Mesh Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[130px] animate-pulse" />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-[#0A0F1D]/80 backdrop-blur-xl border-b border-slate-800/80 z-30">
        <div className="max-w-4xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-cyan-500/10">
              MS
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {isEshopActive && shopProfile ? shopProfile.name : 'Live E-Catalog Store'}
              </h1>
              <p className="text-xs text-cyan-400 font-mono tracking-wider">Store ID: {shopId}</p>
            </div>
          </div>
          
          {isEshopActive && (
            <button 
              onClick={fetchShopData}
              className="px-4 py-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Refresh
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative max-w-4xl mx-auto px-4 py-6 pb-32 z-10">
        
        {loading ? (
          <div className="text-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto" />
            <p className="text-slate-400 mt-4 text-sm font-medium">Loading store details...</p>
          </div>
        ) : !isEshopActive ? (
          /* Store Suspended / Inactive Screen */
          <div className="text-center py-20 bg-[#0E1527]/30 border border-slate-850 rounded-3xl p-10 max-w-md mx-auto mt-16 backdrop-blur-md shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border border-red-500/20">
              🔒
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-red-400 to-amber-300 bg-clip-text text-transparent">
              Store Inactive or Suspended
            </h2>
            <p className="text-slate-400 mt-3.5 text-sm leading-relaxed">
              This E-Shop link is currently disabled by the administrator or the storekeeper's subscription has expired.
            </p>
            <div className="mt-8 pt-6 border-t border-slate-850 text-xs text-slate-500">
              If you are the store owner, please renew your E-Shop addon plan in the billing screen.
            </div>
          </div>
        ) : (
          <>
            {/* Shop Info Header Card */}
            {shopProfile && (
              <div className="mb-8 p-6 bg-[#0E1527]/50 border border-slate-800/70 backdrop-blur-md rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent blur-md pointer-events-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase bg-[#18233C] text-cyan-400 rounded-md border border-cyan-400/10">
                      Verified Merchant
                    </span>
                    <h2 className="text-2xl font-black text-white pt-1">{shopProfile.name}</h2>
                    {shopProfile.address && (
                      <p className="text-slate-400 text-sm flex items-start gap-1.5">
                        <span className="text-slate-500">📍</span> {shopProfile.address}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:items-end justify-center md:text-right space-y-1 md:space-y-1.5 border-t md:border-t-0 border-slate-850 pt-3 md:pt-0">
                    {shopProfile.contact && (
                      <p className="text-slate-300 text-sm font-semibold flex items-center gap-1.5 md:justify-end">
                        <span className="text-cyan-400">📞</span> {shopProfile.contact}
                      </p>
                    )}
                    {shopProfile.upi_id && (
                      <div className="flex items-center gap-2 md:justify-end text-xs text-emerald-400 font-mono bg-emerald-500/5 px-3 py-1 rounded-xl border border-emerald-500/10 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        UPI: {shopProfile.upi_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {orderPlaced ? (
              <div className="text-center py-16 bg-[#0E1527]/40 border border-slate-800/80 rounded-3xl p-10 max-w-md mx-auto mt-10 backdrop-blur-md shadow-2xl">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-emerald-500/25">
                  ✓
                </div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                  Order Placed Successfully!
                </h2>
                <p className="text-slate-400 mt-3 text-sm font-medium">
                  Order ID: <span className="text-cyan-300 font-mono font-bold tracking-wider">{placedOrderId}</span>
                </p>
                <p className="text-slate-500 mt-3 text-xs leading-relaxed max-w-[280px] mx-auto">
                  The shopkeeper has received your digital order and will prepare/print your bill shortly.
                </p>
                <button 
                  onClick={() => setOrderPlaced(false)}
                  className="mt-8 w-full py-4 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-slate-950 font-extrabold rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-400/10 active:scale-[0.98]"
                >
                  Order More Items
                </button>
              </div>
            ) : (
              <>
                {/* Search & Category Filter */}
                <div className="mb-8 space-y-5">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search items in stock..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0E1527]/40 border border-slate-800 focus:border-cyan-400/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/5 transition-all duration-300 placeholder:text-slate-650 shadow-inner"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300">
                      🔍
                    </span>
                  </div>
                  
                  {/* Category selector */}
                  {!loading && (
                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                      {getCategories().map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                            selectedCategory === cat
                              ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/10'
                              : 'bg-[#0E1527]/30 text-slate-400 border-slate-850 hover:border-slate-700/80 hover:text-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Products List Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-[#0E1527]/10 border border-slate-900 rounded-3xl p-8">
                    <p className="text-slate-500 font-extrabold text-lg">No items available in stock</p>
                    <p className="text-slate-600 text-xs mt-1">Try updating your filters or search query.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredProducts.map((p) => {
                      const cartItem = cart[p.product_id];
                      const qty = cartItem ? cartItem.quantity : 0;

                      return (
                        <div 
                          key={p.product_id}
                          className="group bg-[#0E1527]/30 hover:bg-[#0E1527]/60 border border-slate-850 hover:border-slate-800 rounded-3xl p-5 flex justify-between items-center transition-all duration-300 shadow-lg hover:shadow-2xl hover:translate-y-[-2px] backdrop-blur-sm"
                        >
                          <div className="flex-1 pr-4">
                            <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-black bg-[#101930] border border-cyan-500/10 px-2.5 py-1 rounded-lg">
                              {p.category || 'General'}
                            </span>
                            <h3 className="text-md font-bold mt-3.5 text-slate-200 group-hover:text-white transition-colors">
                              {p.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                              <p className="text-emerald-400 font-black text-md">₹{p.price}</p>
                              {p.unit && <p className="text-slate-500 text-xs font-semibold">per {p.unit}</p>}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {qty > 0 ? (
                              <div className="flex items-center bg-[#070B14] border border-slate-850 rounded-2xl p-1.5 shadow-inner">
                                <button 
                                  onClick={() => updateCartQty(p, -1)}
                                  className="w-8 h-8 flex items-center justify-center text-red-400 font-black hover:bg-slate-900 rounded-xl transition active:scale-90"
                                >
                                  -
                                </button>
                                <span className="px-3.5 font-extrabold text-sm text-slate-200">{qty}</span>
                                <button 
                                  onClick={() => updateCartQty(p, 1)}
                                  className="w-8 h-8 flex items-center justify-center text-emerald-400 font-black hover:bg-slate-900 rounded-xl transition active:scale-90"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => updateCartQty(p, 1)}
                                className="bg-slate-900 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-indigo-500 hover:text-slate-950 border border-slate-850 hover:border-transparent text-slate-200 font-bold px-5 py-2.5 rounded-2xl text-xs transition-all duration-300 active:scale-95"
                              >
                                Add to Cart
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
        <div className="fixed bottom-6 left-4 right-4 max-w-lg mx-auto p-4 bg-[#0A0F1D]/90 border border-slate-800/80 backdrop-blur-lg rounded-3xl z-45 shadow-2xl shadow-cyan-400/5 transition-all duration-500">
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{getCartCount()} Items Selected</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">Total: ₹{getCartTotal()}</p>
            </div>
            <button
              onClick={() => setShowOrderModal(true)}
              className="bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-slate-950 px-6 py-3.5 rounded-2xl font-extrabold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-cyan-400/10 active:scale-95"
            >
              Place Digital Order
            </button>
          </div>
        </div>
      )}

      {/* Order Details & UPI QR Code Dialog Modal */}
      {isEshopActive && showOrderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0F1D] border border-slate-800/80 rounded-3xl p-6 w-full max-w-md shadow-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold tracking-tight text-white">Complete Order Details</h3>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-white text-md font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Render dynamic Merchant UPI QR Code for instant scanning */}
            {shopProfile && shopProfile.upi_id && (
              <div className="mb-6 p-4 bg-slate-900/30 border border-slate-850 rounded-2xl text-center flex flex-col items-center">
                <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-black mb-2.5">
                  Scan & Pay Instantly
                </p>
                <div className="w-[180px] h-[180px] bg-white p-2 rounded-xl shadow-lg border border-slate-800">
                  <img
                    src={getQrCodeImageUrl()}
                    alt="UPI Payment QR Code"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-3 max-w-[280px]">
                  Scan using GPay, PhonePe, or Paytm. Enter total amount <span className="text-emerald-400 font-extrabold">₹{getCartTotal()}</span> & complete details.
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
                  className="w-full bg-[#070B14] border border-slate-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-cyan-400 text-sm placeholder:text-slate-700 transition"
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
                  className="w-full bg-[#070B14] border border-slate-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-cyan-400 text-sm placeholder:text-slate-700 transition"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="w-1/2 py-3.5 border border-slate-800 hover:bg-slate-800/50 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-slate-950 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-cyan-400/10"
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
