'use client';

import { useState, useEffect, useRef } from 'react';

const ADMIN_PIN = '8282';

export default function AdminWhatsAppChatPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [chats, setChats] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'agent', 'ai', 'bill', 'udhaar'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Template Modal Form Inputs
  const [templateType, setTemplateType] = useState('bill'); // 'bill', 'udhaar', 'eshop', 'coupon'
  const [billNo, setBillNo] = useState('MS1001');
  const [billAmount, setBillAmount] = useState('250');
  const [udhaarAmount, setUdhaarAmount] = useState('500');
  const [couponCode, setCouponCode] = useState('SAVE10');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLock = sessionStorage.getItem('admin_whatsapp_unlocked');
      if (savedLock === 'true') {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleUnlockPin = (e) => {
    e.preventDefault();
    if (enteredPin.trim() === ADMIN_PIN) {
      setIsUnlocked(true);
      setPinError(false);
      sessionStorage.setItem('admin_whatsapp_unlocked', 'true');
    } else {
      setPinError(true);
    }
  };

  const handleLockPage = () => {
    setIsUnlocked(false);
    setEnteredPin('');
    sessionStorage.removeItem('admin_whatsapp_unlocked');
  };

  const fetchChats = async () => {
    if (!isUnlocked) return;
    try {
      const res = await fetch('/api/whatsapp-webhook/chats');
      const data = await res.json();
      if (data.success) {
        setChats(data.chats || []);
        if (!selectedPhone && data.chats.length > 0) {
          setSelectedPhone(data.chats[0].phone);
        }
      }
    } catch (e) {
      console.error('Failed to fetch chats:', e);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchChats();
      const interval = setInterval(fetchChats, 3000);
      return () => clearInterval(interval);
    }
  }, [isUnlocked, selectedPhone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedPhone]);

  const activeChat = chats.find((c) => c.phone === selectedPhone);

  // Auto-Categorizer Helper: Detects message type (Invoice, Udhaar, Tech Support, Promo)
  const getCategoryTag = (text) => {
    if (!text) return { label: '💬 General', color: '#64748b' };
    const q = text.toLowerCase();
    if (q.includes('invoice') || q.includes('bill') || q.includes('₹') || q.includes('items purchased')) {
      return { label: '🧾 Invoice Bill', color: '#10b981' };
    }
    if (q.includes('udhaar') || q.includes('khata') || q.includes('reminder') || q.includes('pending')) {
      return { label: '🔔 Udhaar Reminder', color: '#f59e0b' };
    }
    if (q.includes('printer') || q.includes('print') || q.includes('bluetooth') || q.includes('otg') || q.includes('usb')) {
      return { label: '🖨️ Tech Support', color: '#06b6d4' };
    }
    if (q.includes('coupon') || q.includes('offer') || q.includes('discount') || q.includes('eshop') || q.includes('catalog')) {
      return { label: '🎁 Promo Offer', color: '#ec4899' };
    }
    return { label: '💬 Support Chat', color: '#8b5cf6' };
  };

  // 🚀 PRIORITY SORTING: LIVE AGENT CHATS ALWAYS FLOAT TO THE TOP IN RED NEON HIGHLIGHT!
  const filteredChats = chats
    .filter((c) => {
      const matchesSearch =
        c.phone.includes(searchQuery) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      if (filterType === 'agent') return c.isAgentActive;
      if (filterType === 'ai') return !c.isAgentActive;
      if (filterType === 'bill') return c.lastMessage && (c.lastMessage.toLowerCase().includes('bill') || c.lastMessage.toLowerCase().includes('invoice'));
      if (filterType === 'udhaar') return c.lastMessage && (c.lastMessage.toLowerCase().includes('udhaar') || c.lastMessage.toLowerCase().includes('khata'));
      return true;
    })
    .sort((a, b) => {
      // 1. Priority #1: Live Agent active chats ALWAYS float to top!
      if (a.isAgentActive && !b.isAgentActive) return -1;
      if (!a.isAgentActive && b.isAgentActive) return 1;

      // 2. Priority #2: Last message timestamp
      const lastA = a.messages.length > 0 ? a.messages[a.messages.length - 1].timestamp : 0;
      const lastB = b.messages.length > 0 ? b.messages[b.messages.length - 1].timestamp : 0;
      return lastB - lastA;
    });

  // Dynamic AI Smart Reply Suggestions Generator
  const getAiSmartSuggestions = () => {
    if (!activeChat || !activeChat.messages || activeChat.messages.length === 0) return [];

    const customerMsgs = activeChat.messages.filter((m) => m.sender === 'customer');
    const lastCustomerText = customerMsgs.length > 0 ? customerMsgs[customerMsgs.length - 1].text.toLowerCase() : '';

    const suggestions = [];

    if (lastCustomerText.includes('printer') || lastCustomerText.includes('print') || lastCustomerText.includes('bluetooth') || lastCustomerText.includes('usb')) {
      suggestions.push({ label: '🖨️ Printer Bluetooth Setup', text: 'Printer connect karne ke liye Phone Settings me Bluetooth Pair karein (PIN 0000/1234). App Settings -> Bluetooth Printer -> Scan karke connect karein!' });
      suggestions.push({ label: '⚡ USB OTG Printer Check', text: 'USB Thermal Printer ke liye Android Settings -> OTG Connection ON karein aur OTG Cable se connect karein!' });
    } else if (lastCustomerText.includes('bill') || lastCustomerText.includes('gst') || lastCustomerText.includes('invoice')) {
      suggestions.push({ label: '⚡ Fast Billing Steps', text: 'Fast Bill banane ke liye Home Screen par New Sale tap karein, items select/scan karke Create Bill dabayein!' });
      suggestions.push({ label: '🧾 Tax Invoice GST', text: 'GST Tax Invoice ke liye bill create karte waqt GST 5%, 12%, ya 18% select karein!' });
    } else if (lastCustomerText.includes('udhaar') || lastCustomerText.includes('khata') || lastCustomerText.includes('reminder')) {
      suggestions.push({ label: '👥 Auto 5-Day Udhaar Reminder', text: 'MeriShop app har 5 din me automatic grahak ko pending balance + UPI payment link WhatsApp reminder bhejta hai!' });
      suggestions.push({ label: '💳 Share UPI Payment Link', text: 'Grahak ko direct UPI payment link se pay karne ke liye bolen: upi://pay?pa=aroventech@upi' });
    } else if (lastCustomerText.includes('coupon') || lastCustomerText.includes('offer')) {
      suggestions.push({ label: '🎁 Special 10% Discount Code', text: 'Aapke agle order ke liye Special 10% OFF Coupon Code: SAVE10. Checkout par apply karein!' });
    } else {
      suggestions.push({ label: '👋 Professional Greeting', text: 'Namaste ji! Main MeriShop Support Manager speak kar raha hoon. Bataiye aapko app me kya dikkat aa rahi hai?' });
      suggestions.push({ label: '📲 Send Play Store Link', text: 'Aap Play Store se MeriShop FREE POS App download kar sakte hain: https://play.google.com/store/apps/details?id=com.aroventech.merishop' });
    }

    suggestions.push({ label: '👤 Live Executive Support', text: 'Aapka issue resolve karne ke liye humari Senior Support Executive Team bilkul live aagai hai. Bataiye kaise help karein?' });

    return suggestions;
  };

  const handleSendReply = async (customText) => {
    const textToSend = customText || replyText;
    if (!textToSend.trim() || !selectedPhone) return;

    setSending(true);
    try {
      const res = await fetch('/api/whatsapp-webhook/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: selectedPhone,
          messageText: textToSend.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (!customText) setReplyText('');
        fetchChats();
      } else {
        alert('Failed to send WhatsApp message: ' + JSON.stringify(data));
      }
    } catch (e) {
      alert('Error sending message: ' + e.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendGeneratedTemplate = async () => {
    let generated = '';
    if (templateType === 'bill') {
      generated = `🧾 *OFFICIAL BILL INVOICE #${billNo}*\n━━━━━━━━━━━━━━━━━━━\nDate: ${new Date().toLocaleDateString('en-IN')}\n\n💰 *Total Bill Amount:* ₹${billAmount}\n\nThank you for shopping with us! 🙏`;
    } else if (templateType === 'udhaar') {
      generated = `🔔 *PAYMENT REMINDER*\n━━━━━━━━━━━━━━━━━━━\nNamaste! Aapka total pending udhaar balance: *₹${udhaarAmount}* hai.\n\n💳 *Pay via UPI:* upi://pay?pa=aroventech@upi&am=${udhaarAmount}\n\nKripya karke balance clear karein. Dhanyawad!`;
    } else if (templateType === 'eshop') {
      generated = `🛒 *ONLINE E-SHOP CATALOG*\n━━━━━━━━━━━━━━━━━━━\nGhar baithe online items dekhne aur order karne ke liye link par click karein:\n\n👉 https://www.aroventech.site/merishop/MSCHAUBEYSHOP01`;
    } else if (templateType === 'coupon') {
      generated = `🎁 *SPECIAL DISCOUNT COUPON*\n━━━━━━━━━━━━━━━━━━━\nAapke agle order ke liye Special Coupon Code:\n\n🔥 *${couponCode}*\n\nOnline checkout par ${couponCode} apply karke 10% instant discount paayein!`;
    }

    if (generated) {
      await handleSendReply(generated);
      setShowTemplateModal(false);
    }
  };

  const handleEndChatSession = async () => {
    if (!selectedPhone) return;
    const closingMessage = 'Namaste ji! Aapka support session resolve ho gaya hai. MeriShop POS se judne ke liye dhanyawad! Kripya dobara zaroorat padne par bejhijhak message karein. 🙏';

    setSending(true);
    try {
      await fetch('/api/whatsapp-webhook/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: selectedPhone,
          messageText: closingMessage,
        }),
      });

      await fetch('/api/whatsapp-webhook/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_session',
          recipientPhone: selectedPhone,
        }),
      });

      fetchChats();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleToggleSession = async () => {
    if (!selectedPhone) return;
    try {
      await fetch('/api/whatsapp-webhook/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_session',
          recipientPhone: selectedPhone,
        }),
      });
      fetchChats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNewNumber = async () => {
    if (!newNumber.trim()) return;
    let clean = newNumber.replaceAll(/[^\d]/g, '');
    if (clean.length === 10) clean = '91' + clean;

    try {
      await fetch('/api/whatsapp-webhook/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_chat',
          recipientPhone: clean,
        }),
      });
      setSelectedPhone(clean);
      setNewNumber('');
      setShowAddModal(false);
      fetchChats();
    } catch (e) {
      console.error(e);
    }
  };

  const insertFormatting = (prefix, suffix) => {
    setReplyText((prev) => prev + prefix + 'text' + suffix);
  };

  // ADVANCED SECURITY PIN LOCK SCREEN
  if (!isUnlocked) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', fontFamily: 'Inter, system-ui, sans-serif', color: '#f8fafc' }}>
        <form onSubmit={handleUnlockPin} style={{ backgroundColor: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px 44px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', width: '360px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px auto', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
            🔐
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', background: 'linear-gradient(90deg, #34d399, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Enterprise WhatsApp Desk
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 28px 0' }}>Enter 4-Digit Security PIN Code</p>

          <input
            type="password"
            maxLength={4}
            placeholder="••••"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              border: pinError ? '2px solid #ef4444' : '1px solid #334155',
              borderRadius: '12px',
              padding: '14px',
              color: '#fff',
              fontSize: '22px',
              textAlign: 'center',
              letterSpacing: '10px',
              outline: 'none',
              marginBottom: '16px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
            }}
          />

          {pinError && <div style={{ color: '#f87171', fontSize: '12px', marginBottom: '14px', fontWeight: '600' }}>❌ Invalid PIN Code! Access Denied.</div>}

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            Unlock Console 🔓
          </button>
        </form>
      </div>
    );
  }

  const liveAgentCount = chats.filter((c) => c.isAgentActive).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#090d16', color: '#f8fafc' }}>
      
      {/* 🚀 GLASSMORPHIC HIGH-TECH ENTERPRISE NAVBAR */}
      <header style={{ height: '64px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
            💬
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', fontWeight: '800', letterSpacing: '-0.3px', background: 'linear-gradient(90deg, #f8fafc, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ArovenTech High-Tech WhatsApp CRM <span style={{ fontSize: '10px', backgroundColor: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '12px', WebkitTextFillColor: '#fff', marginLeft: '6px', fontWeight: 'bold' }}>PRO v3.5</span>
            </h1>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Helpline: +91 82829 38658</span>
              <span>•</span>
              <span style={{ color: '#34d399', fontWeight: 'bold' }}>● Webhook Active 200 OK</span>
            </div>
          </div>
        </div>

        {/* Analytics Badges & Template Launcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#94a3b8' }}>Chats:</span>
            <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{chats.length}</span>
          </div>

          <div style={{ backgroundColor: liveAgentCount > 0 ? 'rgba(239, 68, 68, 0.2)' : '#1e293b', border: liveAgentCount > 0 ? '1px solid #ef4444' : '1px solid #334155', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: liveAgentCount > 0 ? '#f87171' : '#94a3b8', fontWeight: liveAgentCount > 0 ? 'bold' : 'normal' }}>Live Agent Required:</span>
            <span style={{ fontWeight: 'bold', color: liveAgentCount > 0 ? '#ef4444' : '#10b981' }}>{liveAgentCount}</span>
          </div>

          <button
            onClick={() => setShowTemplateModal(true)}
            style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)' }}
          >
            ⚡ Template Builder
          </button>

          <button
            onClick={() => setShowRightDrawer(!showRightDrawer)}
            style={{ backgroundColor: '#334155', color: '#cbd5e1', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
          >
            {showRightDrawer ? '📋 Hide Info' : '📋 Customer Info'}
          </button>

          <button
            onClick={handleLockPage}
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}
          >
            🔒 Lock Desk
          </button>
        </div>
      </header>

      {/* ⚡ URGENT LIVE AGENT TOP ALERT BANNER */}
      {liveAgentCount > 0 && (
        <div style={{ backgroundColor: '#dc2626', color: '#fff', padding: '8px 24px', fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(220,38,38,0.5)', zIndex: 15 }}>
          <span>🚨 URGENT ACTION REQUIRED: {liveAgentCount} Customer requested Live Support Executive Handover! (Floated to the top in RED glow)</span>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>AI Paused for active chats</span>
        </div>
      )}

      {/* ⚡ HIGH-TECH TEMPLATE BUILDER MODAL */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '28px', width: '440px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>⚡ 1-Click WhatsApp Template Generator</h3>
              <button onClick={() => setShowTemplateModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Template Selector Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '10px' }}>
              <button onClick={() => setTemplateType('bill')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: templateType === 'bill' ? '#10b981' : 'transparent', color: '#fff' }}>🧾 Bill Invoice</button>
              <button onClick={() => setTemplateType('udhaar')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: templateType === 'udhaar' ? '#f59e0b' : 'transparent', color: '#fff' }}>🔔 Udhaar</button>
              <button onClick={() => setTemplateType('eshop')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: templateType === 'eshop' ? '#06b6d4' : 'transparent', color: '#fff' }}>🛒 E-Shop</button>
              <button onClick={() => setTemplateType('coupon')} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: templateType === 'coupon' ? '#ec4899' : 'transparent', color: '#fff' }}>🎁 Coupon</button>
            </div>

            {/* Template Form Inputs */}
            {templateType === 'bill' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Invoice Number:</label>
                <input type="text" value={billNo} onChange={(e) => setBillNo(e.target.value)} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Total Amount (₹):</label>
                <input type="text" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
              </div>
            )}

            {templateType === 'udhaar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Pending Balance (₹):</label>
                <input type="text" value={udhaarAmount} onChange={(e) => setUdhaarAmount(e.target.value)} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
              </div>
            )}

            {templateType === 'eshop' && (
              <div style={{ fontSize: '13px', color: '#cbd5e1', padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                Sends shop online catalog website URL: <b>https://www.aroventech.site/merishop/MSCHAUBEYSHOP01</b>
              </div>
            )}

            {templateType === 'coupon' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Coupon Code:</label>
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }} />
              </div>
            )}

            <button
              onClick={handleSendGeneratedTemplate}
              style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Generate & Send SMS 🚀
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* 📋 LEFT SIDEBAR: Searchable & Priority Filtered Conversations List */}
        <div style={{ width: '350px', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
          
          {/* Search & Add Bar */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', backgroundColor: '#1e293b' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="🔍 Search phone or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px', outline: 'none' }}
              />
              <button
                onClick={() => setShowAddModal(!showAddModal)}
                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + New
              </button>
            </div>

            {/* High-Tech Filter Chips */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
              <button onClick={() => setFilterType('all')} style={{ padding: '5px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: filterType === 'all' ? '#10b981' : '#0f172a', color: filterType === 'all' ? '#fff' : '#94a3b8', whiteSpace: 'nowrap' }}>All ({chats.length})</button>
              <button onClick={() => setFilterType('agent')} style={{ padding: '5px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: filterType === 'agent' ? '#ef4444' : '#0f172a', color: filterType === 'agent' ? '#fff' : '#94a3b8', whiteSpace: 'nowrap' }}>🔴 Live ({liveAgentCount})</button>
              <button onClick={() => setFilterType('ai')} style={{ padding: '5px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: filterType === 'ai' ? '#3b82f6' : '#0f172a', color: filterType === 'ai' ? '#fff' : '#94a3b8', whiteSpace: 'nowrap' }}>🟢 AI ({chats.length - liveAgentCount})</button>
              <button onClick={() => setFilterType('bill')} style={{ padding: '5px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: filterType === 'bill' ? '#059669' : '#0f172a', color: filterType === 'bill' ? '#fff' : '#94a3b8', whiteSpace: 'nowrap' }}>🧾 Bills</button>
              <button onClick={() => setFilterType('udhaar')} style={{ padding: '5px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: filterType === 'udhaar' ? '#d97706' : '#0f172a', color: filterType === 'udhaar' ? '#fff' : '#94a3b8', whiteSpace: 'nowrap' }}>🔔 Udhaar</button>
            </div>
          </div>

          {/* Modal / Quick Add Number */}
          {showAddModal && (
            <div style={{ padding: '12px 16px', backgroundColor: '#334155', borderBottom: '1px solid #475569', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter 10-digit number..."
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                style={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #64748b', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px' }}
              />
              <button
                onClick={handleAddNewNumber}
                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
          )}

          {/* 🚀 PRIORITY FLOATING CONVERSATIONS CARDS (RED HIGHLIGHT FOR LIVE AGENT) */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredChats.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No chats found matching criteria.
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = chat.phone === selectedPhone;
                const initial = chat.phone.slice(-2);
                const category = getCategoryTag(chat.lastMessage);
                const isLive = chat.isAgentActive;

                return (
                  <div
                    key={chat.phone}
                    onClick={() => setSelectedPhone(chat.phone)}
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid #1e293b',
                      cursor: 'pointer',
                      background: isLive
                        ? isSelected
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(185, 28, 28, 0.45))'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(153, 27, 27, 0.25))'
                        : isSelected
                        ? 'rgba(30, 41, 59, 0.7)'
                        : 'transparent',
                      borderLeft: isLive
                        ? '5px solid #ef4444'
                        : isSelected
                        ? '4px solid #10b981'
                        : '4px solid transparent',
                      boxShadow: isLive ? '0 0 12px rgba(239, 68, 68, 0.3)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isLive ? '#ef4444' : isSelected ? '#10b981' : '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', position: 'relative', boxShadow: isLive ? '0 0 10px rgba(239,68,68,0.6)' : 'none' }}>
                        {initial}
                        <span style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isLive ? '#ef4444' : '#10b981', border: '2px solid #0f172a' }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontWeight: '800', fontSize: '14px', color: isLive ? '#fca5a5' : '#f8fafc' }}>
                            +{chat.phone}
                          </span>
                          <span style={{ fontSize: '10px', color: isLive ? '#fca5a5' : '#64748b' }}>{chat.lastTime}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                          <div style={{ fontSize: '12px', color: isLive ? '#fecaca' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, fontWeight: isLive ? '600' : 'normal' }}>
                            {chat.lastMessage || 'No messages'}
                          </div>

                          {isLive ? (
                            <span style={{ fontSize: '9px', backgroundColor: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 0 8px rgba(239,68,68,0.5)', animation: 'pulse 1.5s infinite' }}>
                              🚨 LIVE AGENT
                            </span>
                          ) : (
                            <span style={{ fontSize: '9px', backgroundColor: category.color, color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                              {category.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 💬 CENTER MAIN CHAT WINDOW */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#090d16' }}>
          {selectedPhone && activeChat ? (
            <>
              {/* Header Bar */}
              <div style={{ padding: '14px 24px', borderBottom: '1px solid #1e293b', backgroundColor: activeChat.isAgentActive ? 'rgba(220, 38, 38, 0.15)' : '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: activeChat.isAgentActive ? '#ef4444' : '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', boxShadow: activeChat.isAgentActive ? '0 0 12px rgba(239,68,68,0.5)' : 'none' }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#f8fafc' }}>
                      Customer: +{activeChat.phone}
                    </h3>
                    <span style={{ fontSize: '11px', color: activeChat.isAgentActive ? '#f87171' : '#34d399', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {activeChat.isAgentActive ? '🚨 URGENT: Live Agent Session Active (AI Auto-Reply PAUSED)' : '🟢 AI Auto-Reply Active'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeChat.isAgentActive && (
                    <button
                      onClick={handleEndChatSession}
                      style={{
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
                      }}
                    >
                      🔴 END CHAT SESSION (Enable AI)
                    </button>
                  )}

                  <button
                    onClick={handleToggleSession}
                    style={{
                      backgroundColor: activeChat.isAgentActive ? '#0284c7' : '#ef4444',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {activeChat.isAgentActive ? '🔄 Pause Agent' : '🔴 Start Agent Takeover'}
                  </button>

                  <button
                    onClick={fetchChats}
                    style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* 🤖 AI SMART SUGGESTIONS & TEMPLATE TOOLBAR */}
              <div style={{ padding: '10px 24px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🤖 AI Smart Suggested Replies (1-Click Fill & Send):</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {getAiSmartSuggestions().map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendReply(sug.text)}
                      style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #0284c7',
                        color: '#38bdf8',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        transition: 'all 0.15s',
                      }}
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MESSAGES STREAM WITH DELIVERY STATUS & TIMESTAMPS */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                {activeChat.messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  const isAgent = msg.sender === 'agent';

                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isCustomer ? 'flex-start' : 'flex-end',
                        maxWidth: '68%',
                        backgroundColor: isCustomer ? '#1e293b' : isAgent ? '#059669' : '#1e1b4b',
                        border: isCustomer ? '1px solid #334155' : isAgent ? '1px solid #10b981' : '1px solid #4338ca',
                        color: '#f8fafc',
                        padding: '12px 18px',
                        borderRadius: isCustomer ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div style={{ fontSize: '10px', color: isCustomer ? '#94a3b8' : isAgent ? '#a7f3d0' : '#c7d2fe', fontWeight: 'bold', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{isCustomer ? '👤 Customer (Exact WhatsApp SMS)' : isAgent ? '👨‍💼 Support Executive (You)' : '🤖 AI Auto-Reply'}</span>
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                      
                      <div style={{ fontSize: '9px', color: isCustomer ? '#64748b' : '#a7f3d0', textAlign: 'right', marginTop: '6px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                        <span>{msg.time}</span>
                        {!isCustomer && <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>✓✓ Delivered</span>}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* RICH FORMATTING HELPER BAR & INPUT */}
              <div style={{ padding: '12px 24px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Formatting Quick Toolbar */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => insertFormatting('*', '*')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>*Bold*</button>
                  <button onClick={() => insertFormatting('_', '_')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontStyle: 'italic' }}>_Italic_</button>
                  <button onClick={() => setReplyText(prev => prev + ' 🙏 ')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>🙏 Namaste</button>
                  <button onClick={() => setReplyText(prev => prev + ' ⚡ ')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>⚡ Quick</button>
                  <button onClick={() => setReplyText(prev => prev + ' 🖨️ ')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>🖨️ Printer</button>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Type 1-on-1 manual reply... (Sending automatically pauses AI)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    style={{
                      flex: 1,
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '24px',
                      padding: '14px 22px',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                  <button
                    onClick={() => handleSendReply()}
                    disabled={sending || !replyText.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '24px',
                      padding: '14px 28px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: sending ? 'wait' : 'pointer',
                      opacity: sending || !replyText.trim() ? 0.6 : 1,
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    {sending ? 'Sending...' : 'Send SMS 🚀'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px' }}>
              Select a customer from the left sidebar to start live chatting!
            </div>
          )}
        </div>

        {/* 📊 RIGHT CUSTOMER INFO DRAWER */}
        {showRightDrawer && selectedPhone && (
          <div style={{ width: '280px', borderLeft: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', color: '#34d399', letterSpacing: '0.5px' }}>
              📋 Customer Profile
            </div>

            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                👤
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#f8fafc' }}>
                +{activeChat?.phone}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Status: {activeChat?.isAgentActive ? '🔴 Live Agent Mode' : '🟢 AI Auto-Reply'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '6px' }}>
                ✍️ Internal Customer Notes:
              </div>
              <textarea
                placeholder="Write private notes about this customer (e.g. Printer issue resolved, wholesale buyer)..."
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href={`tel:+${activeChat?.phone}`}
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center', backgroundColor: '#334155', color: '#38bdf8', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
              >
                📞 Direct Phone Call
              </a>
              <a
                href={`https://wa.me/${activeChat?.phone}`}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center', backgroundColor: '#059669', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
              >
                💬 Open in WhatsApp App
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
