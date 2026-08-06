'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const ADMIN_PIN = '8282';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, color = 'currentColor', stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IcoMessage = () => <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
const IcoSend = () => <Ico d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />;
const IcoUsers = () => <Ico d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcoZap = () => <Ico d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoBell = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />;
const IcoReceipt = () => <Ico d="M14 2H6a2 2 0 0 0-2 2v16l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2zM16 13H8M16 9H8M10 17H8" />;
const IcoSearch = () => <Ico d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" />;
const IcoMegaphone = () => <Ico d="M3 11l19-9-9 19-2-8-8-2z" />;
const IcoChevronRight = () => <Ico d="m9 18 6-6-6-6" />;
const IcoX = () => <Ico d="M18 6 6 18M6 6l12 12" />;
const IcoCheck = () => <Ico d="M20 6 9 17l-5-5" />;
const IcoUpload = () => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IcoDownload = () => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const IcoPulse = () => <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const IcoShield = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoBot = () => <Ico d="M12 8V4H8M12 8h4l.5-.5A2.5 2.5 0 0 1 21 10v1a2.5 2.5 0 0 1-2.5 2.5H20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2h-.5A2.5 2.5 0 0 1 1 11v-1a2.5 2.5 0 0 1 4.5-1.5L6 8h6zM9 17v2M15 17v2" />;
const IcoStar = () => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />;
const IcoAlertTriangle = () => <Ico d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
const IcoSparkles = () => <Ico d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />;
const IcoRefresh = () => <Ico d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />;
const IcoLock = () => <Ico d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" />;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const tag = (text = '') => {
  const q = text.toLowerCase();
  if (q.includes('🧾') || q.includes('invoice') || q.includes('bill') || q.includes('₹')) return { label: '🧾 Invoice', bg: '#064e3b', color: '#34d399' };
  if (q.includes('🔔 udhaar') || q.includes('udhaar') || q.includes('baki rakam') || q.includes('reminder')) return { label: '⏰ Udhaar', bg: '#451a03', color: '#fb923c' };
  if (q.includes('📢')) return { label: '📢 Campaign', bg: '#1e1b4b', color: '#a78bfa' };
  if (q.includes('printer') || q.includes('print') || q.includes('bluetooth')) return { label: '🖨️ Tech', bg: '#0c4a6e', color: '#38bdf8' };
  if (q.includes('coupon') || q.includes('offer') || q.includes('discount')) return { label: '🎁 Promo', bg: '#500724', color: '#f472b6' };
  return { label: '💬 Support', bg: '#1e1b4b', color: '#a78bfa' };
};

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { day: '2-digit', month: 'short' });
};

const msgBubble = (m) => {
  if (m.sender === 'customer') return { bg: 'linear-gradient(135deg,#1e293b,#0f172a)', border: '1px solid #334155', align: 'flex-start', labelColor: '#94a3b8', label: 'Customer' };
  if (m.sender === 'ai') return { bg: 'linear-gradient(135deg,#0f2027,#0a3d62)', border: '1px solid #1e40af', align: 'flex-start', labelColor: '#60a5fa', label: '🤖 AI Rohit' };
  return { bg: 'linear-gradient(135deg,#14532d,#065f46)', border: '1px solid #16a34a', align: 'flex-end', labelColor: '#4ade80', label: '👤 Agent' };
};

// ─── Campaign Panel ───────────────────────────────────────────────────────────
function CampaignPanel({ onClose }) {
  const [phones, setPhones] = useState('');
  const [message, setMessage] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileRef = useRef();

  const downloadTemplate = () => {
    const csv = 'Phone Number\n9876543210\n9123456789\n8000000000';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'campaign_numbers_template.csv'; a.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const numbers = text.split(/[\n,;]+/).map(n => n.replace(/\D/g, '').trim()).filter(n => n.length >= 10);
      setPhones(numbers.join('\n'));
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    const phoneList = phones.split(/[\n,;]+/).map(p => p.trim()).filter(p => p.replace(/\D/g, '').length >= 10);
    if (!phoneList.length) return alert('Koi bhi valid number nahi diya!');
    if (!message.trim()) return alert('Message likho pehle!');

    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/whatsapp-webhook/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'campaign_blast', phones: phoneList, message: message.trim(), campaignName: campaignName || 'Campaign' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    }
    setSending(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'linear-gradient(135deg,#0a0f1e,#0d1f3c)', border: '1px solid #1e40af', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', padding: '28px', boxShadow: '0 25px 60px rgba(0,0,255,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '22px', fontWeight: 700 }}>📢 Bulk SMS Campaign</h2>
            <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '13px' }}>Excel upload karke hazaaron customers ko instant offer SMS bhejo</p>
          </div>
          <button onClick={onClose} style={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#94a3b8', padding: '8px', cursor: 'pointer' }}><IcoX /></button>
        </div>

        {/* Campaign Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>CAMPAIGN NAME (Optional)</label>
          <input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. Diwali Sale 2024, Monthly Offer..." style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>

        {/* Phone Numbers Section */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ color: '#94a3b8', fontSize: '12px' }}>PHONE NUMBERS (ek line mein ek number)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={downloadTemplate} style={{ background: '#1e3a5f', border: '1px solid #1e40af', borderRadius: '8px', color: '#60a5fa', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IcoDownload /> Template Download
              </button>
              <button onClick={() => fileRef.current.click()} style={{ background: '#14532d', border: '1px solid #16a34a', borderRadius: '8px', color: '#4ade80', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IcoUpload /> CSV/Excel Upload
              </button>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.txt" style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
          </div>
          {uploadedFile && <p style={{ color: '#4ade80', fontSize: '12px', marginBottom: '6px' }}>✅ File loaded: {uploadedFile}</p>}
          <textarea
            value={phones}
            onChange={e => setPhones(e.target.value)}
            placeholder="9876543210&#10;9123456789&#10;8000000000&#10;...ya CSV upload karo upar se"
            rows={6}
            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: '#e2e8f0', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace' }}
          />
          <p style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>{phones.split(/[\n,;]+/).filter(p => p.replace(/\D/g, '').length >= 10).length} valid numbers detected</p>
        </div>

        {/* Message */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>SMS MESSAGE</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Namaste ji! 🎉 Hamari aaj ki special offer: 20% OFF sab items par! Sirf aaj ke liye. Abhi order karein: https://..."
            rows={5}
            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: '#e2e8f0', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <p style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>{message.length} characters</p>
        </div>

        {/* Quick Templates */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '8px' }}>QUICK TEMPLATES</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: '🎉 Festival Offer', text: 'Namaste ji! 🎉 Is festive season par special discount: Sab items par 15% OFF. Abhi visit karein ya order karein! - Aapka Apna Dukan' },
              { label: '📦 New Stock', text: 'Namaste ji! 📦 Naaya stock aa gaya hai. Fresh aur latest items available hain. Aaj hi aayein! - Aapka Apna Dukan' },
              { label: '🔔 Udhaar Yaad', text: 'Namaste ji! 🙏 Aapka hamare yahan kuch baki hai. Kripya payment kar dein. Dhanyawad! - Aapka Apna Dukan' },
            ].map(t => (
              <button key={t.label} onClick={() => setMessage(t.text)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div style={{ background: result.error ? '#450a0a' : '#052e16', border: `1px solid ${result.error ? '#ef4444' : '#16a34a'}`, borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
            {result.error ? (
              <p style={{ color: '#ef4444', margin: 0 }}>❌ Error: {result.error}</p>
            ) : (
              <div style={{ color: '#4ade80' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 700 }}>✅ Campaign Sent!</p>
                <p style={{ margin: 0, fontSize: '13px' }}>📤 Sent: {result.sent} | ❌ Failed: {result.failed}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={sending}
          style={{ width: '100%', background: sending ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8,#7c3aed)', border: 'none', borderRadius: '12px', color: '#fff', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {sending ? '⏳ Sending campaign...' : <><IcoMegaphone /> Send Campaign to {phones.split(/[\n,;]+/).filter(p => p.replace(/\D/g, '').length >= 10).length} Numbers</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main CRM Panel ───────────────────────────────────────────────────────────
export default function AdminWhatsAppChatPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCampaign, setShowCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'invoices' | 'udhaar'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_wa_unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (enteredPin.trim() === ADMIN_PIN) {
      setIsUnlocked(true); setPinError(false);
      sessionStorage.setItem('admin_wa_unlocked', 'true');
    } else { setPinError(true); }
  };

  const fetchChats = useCallback(async () => {
    if (!isUnlocked) return;
    try {
      const res = await fetch('/api/whatsapp-webhook/chats');
      const data = await res.json();
      if (data.success) {
        setChats(data.chats || []);
        if (!selectedPhone && data.chats.length > 0) setSelectedPhone(data.chats[0].phone);
      }
    } catch (_) {}
  }, [isUnlocked, selectedPhone]);

  useEffect(() => {
    if (isUnlocked) {
      fetchChats();
      const interval = setInterval(fetchChats, 3000);
      return () => clearInterval(interval);
    }
  }, [isUnlocked, fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedPhone]);

  const activeChat = chats.find(c => c.phone === selectedPhone);

  // Stats
  const liveAgentCount = chats.filter(c => c.isAgentActive).length;
  const todayMsgs = chats.reduce((acc, c) => acc + (c.messages?.filter(m => Date.now() - m.timestamp < 86400000)?.length || 0), 0);
  const invoiceChats = chats.filter(c => c.messages?.some(m => m.text?.includes('🧾') || m.text?.includes('Invoice')));
  const udhaarChats = chats.filter(c => c.messages?.some(m => m.text?.includes('Udhaar') || m.text?.includes('baki rakam')));

  // Filtered + sorted
  const filteredChats = chats
    .filter(c => {
      const q = searchQuery.toLowerCase();
      if (q && !c.phone.includes(q) && !(c.lastMessage || '').toLowerCase().includes(q)) return false;
      if (filterType === 'agent') return c.isAgentActive;
      if (filterType === 'ai') return !c.isAgentActive;
      if (filterType === 'invoice') return c.messages?.some(m => m.text?.includes('🧾') || m.text?.includes('Invoice'));
      if (filterType === 'udhaar') return c.messages?.some(m => m.text?.includes('Udhaar'));
      return true;
    })
    .sort((a, b) => {
      if (a.isAgentActive && !b.isAgentActive) return -1;
      if (!a.isAgentActive && b.isAgentActive) return 1;
      const tA = a.messages?.at(-1)?.timestamp || 0;
      const tB = b.messages?.at(-1)?.timestamp || 0;
      return tB - tA;
    });

  // AI Suggestions
  const getAiSuggestions = () => {
    const last = activeChat?.messages?.filter(m => m.sender === 'customer')?.at(-1)?.text?.toLowerCase() || '';
    const base = [
      { label: '👋 Greeting', text: 'Namaste ji! 🙏 MeriShop Support Executive yahan hai. Bataiye kya madad chahiye?' },
      { label: '🖨️ Printer Help', text: 'Printer ke liye: Phone Settings → Bluetooth → Pair karein (PIN: 0000). App → Settings → Bluetooth Printer → Scan.' },
      { label: '📲 App Download', text: 'MeriShop FREE app download: https://play.google.com/store/apps/details?id=com.aroventech.merishop' },
      { label: '✅ Issue Resolved', text: 'Aapki problem resolve ho gayi hai! Koi aur madad chahiye toh anytime message karein. Dhanyawad! 🙏' },
    ];
    if (last.includes('printer') || last.includes('print')) {
      base.unshift({ label: '🔵 BT Printer Steps', text: 'Bluetooth Printer: Settings → Bluetooth → Add Device → Connect. App me Settings → Printer → Bluetooth Scan karein.' });
    }
    if (last.includes('bill') || last.includes('gst')) {
      base.unshift({ label: '🧾 Billing Steps', text: 'Bill banane ke liye: New Sale → Items add karein → GST select karein → Create Bill tap karein. Receipt auto-print hoga!' });
    }
    if (last.includes('udhaar') || last.includes('khata')) {
      base.unshift({ label: '💳 Udhaar Info', text: 'MeriShop app auto har 5 din mein pending balance + UPI link WhatsApp par bhejta hai automatically!' });
    }
    return base;
  };

  const handleSend = async (customText) => {
    const text = (customText || replyText).trim();
    if (!text || !selectedPhone) return;
    setSending(true);
    try {
      await fetch('/api/whatsapp-webhook/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientPhone: selectedPhone, messageText: text }),
      });
      if (!customText) setReplyText('');
      await fetchChats();
    } catch (_) {}
    setSending(false);
  };

  const handleToggleAgent = async () => {
    if (!selectedPhone) return;
    await fetch('/api/whatsapp-webhook/chats', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientPhone: selectedPhone, action: 'toggle_session' }),
    });
    await fetchChats();
  };

  // ─── Lock Screen ────────────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#020617,#0a0f1e,#020617)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: 'linear-gradient(135deg,#0a0f1e,#0d1f3c)', border: '1px solid #1e40af', borderRadius: '24px', padding: '48px 40px', width: '100%', maxWidth: '420px', boxShadow: '0 0 80px rgba(29,78,216,0.3)', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <IcoShield />
          </div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>MeriShop CRM</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 32px' }}>Admin Access Only — Enter PIN to unlock</p>
          <form onSubmit={handleUnlock}>
            <input
              type="password" value={enteredPin} onChange={e => setEnteredPin(e.target.value)} placeholder="Enter Admin PIN"
              style={{ width: '100%', background: '#0f172a', border: `2px solid ${pinError ? '#ef4444' : '#334155'}`, borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '20px', textAlign: 'center', letterSpacing: '6px', boxSizing: 'border-box', marginBottom: '12px' }}
              autoFocus
            />
            {pinError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>❌ Wrong PIN. Try again.</p>}
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', border: 'none', borderRadius: '12px', color: '#fff', padding: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
              🔓 Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Main CRM Layout ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#020617', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>
      {showCampaign && <CampaignPanel onClose={() => setShowCampaign(false)} />}

      {/* ── TOP HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg,#0a0f1e,#0d1f3c)', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcoMessage />
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 800 }}>MeriShop CRM</h1>
            <p style={{ margin: 0, color: '#4ade80', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
              Live WhatsApp Desk
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { label: 'Total Chats', value: chats.length, color: '#60a5fa', icon: '💬' },
            { label: 'Live Agents', value: liveAgentCount, color: '#f87171', icon: '🚨', pulse: liveAgentCount > 0 },
            { label: "Today's Messages", value: todayMsgs, color: '#34d399', icon: '📩' },
            { label: 'Invoices', value: invoiceChats.length, color: '#fb923c', icon: '🧾' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0f172a', border: `1px solid ${s.pulse ? '#ef4444' : '#1e293b'}`, borderRadius: '10px', padding: '8px 14px', textAlign: 'center', animation: s.pulse ? 'border-pulse 1s infinite' : 'none' }}>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: s.color }}>{s.icon} {s.value}</p>
              <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>{s.label}</p>
            </div>
          ))}
          <button onClick={() => setShowCampaign(true)} style={{ background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IcoMegaphone /> Campaign
          </button>
          <button onClick={fetchChats} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#94a3b8', padding: '10px', cursor: 'pointer' }}>
            <IcoRefresh />
          </button>
        </div>
      </div>

      {/* ── LIVE AGENT ALERT BANNER ── */}
      {liveAgentCount > 0 && (
        <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#991b1b)', borderBottom: '1px solid #ef4444', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slide-in 0.3s ease' }}>
          <IcoAlertTriangle />
          <span style={{ color: '#fecaca', fontWeight: 700, fontSize: '14px' }}>🚨 URGENT: {liveAgentCount} customer{liveAgentCount > 1 ? 's' : ''} requesting Live Human Agent support!</span>
          <button onClick={() => setFilterType('agent')} style={{ marginLeft: 'auto', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', padding: '5px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>View Now</button>
        </div>
      )}

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: '320px', flexShrink: 0, background: '#0a0f1e', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Search */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}><IcoSearch /></div>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search number or message..." style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '9px 12px 9px 38px', color: '#e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', borderBottom: '1px solid #1e293b', flexShrink: 0, overflowX: 'auto' }}>
            {[
              { id: 'all', label: '🌐 All' },
              { id: 'agent', label: '🚨 Agent' },
              { id: 'invoice', label: '🧾 Invoice' },
              { id: 'udhaar', label: '⏰ Udhaar' },
              { id: 'ai', label: '🤖 AI Only' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilterType(f.id)} style={{ background: filterType === f.id ? 'linear-gradient(135deg,#1d4ed8,#7c3aed)' : '#0f172a', border: `1px solid ${filterType === f.id ? '#1d4ed8' : '#1e293b'}`, borderRadius: '8px', color: filterType === f.id ? '#fff' : '#94a3b8', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredChats.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                <IcoMessage />
                <p style={{ marginTop: '12px', fontSize: '13px' }}>No chats found</p>
              </div>
            ) : filteredChats.map(chat => {
              const isSelected = selectedPhone === chat.phone;
              const isLive = chat.isAgentActive;
              const lastMsg = chat.messages?.at(-1);
              const t = tag(chat.lastMessage || '');
              return (
                <div
                  key={chat.phone}
                  onClick={() => setSelectedPhone(chat.phone)}
                  style={{
                    padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #0f172a',
                    background: isSelected ? 'linear-gradient(135deg,#0f1f3d,#0a1628)' : isLive ? 'linear-gradient(135deg,#1c0808,#2d0a0a)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #1d4ed8' : isLive ? '3px solid #ef4444' : '3px solid transparent',
                    animation: isLive ? 'agent-pulse 2s infinite' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '42px', height: '42px', background: isLive ? 'linear-gradient(135deg,#dc2626,#7f1d1d)' : 'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                        {isLive ? '🚨' : '👤'}
                      </div>
                      {isLive && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', border: '2px solid #1c0808', animation: 'pulse 1s infinite' }}></span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ color: isLive ? '#fca5a5' : '#e2e8f0', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>
                          +{chat.phone}
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>{formatTime(lastMsg?.timestamp)}</span>
                      </div>
                      <p style={{ margin: '0 0 5px', color: '#94a3b8', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chat.lastMessage || 'No message yet'}
                      </p>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ background: t.bg, color: t.color, fontSize: '10px', padding: '2px 7px', borderRadius: '20px', fontWeight: 600 }}>{t.label}</span>
                        {isLive && <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '10px', padding: '2px 7px', borderRadius: '20px', fontWeight: 700 }}>🚨 LIVE AGENT</span>}
                        <span style={{ color: '#64748b', fontSize: '10px', marginLeft: 'auto' }}>{chat.messages?.length || 0} msgs</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CHAT WINDOW ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#020617' }}>
          {!activeChat ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: '#64748b' }}>
              <div style={{ width: '80px', height: '80px', background: '#0f172a', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoMessage /></div>
              <h2 style={{ margin: 0, color: '#334155', fontSize: '18px' }}>Select a conversation</h2>
              <p style={{ margin: 0, fontSize: '13px' }}>Choose a customer from the left sidebar to start chatting</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ background: 'linear-gradient(135deg,#0a0f1e,#0d1f3c)', borderBottom: '1px solid #1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <div style={{ width: '44px', height: '44px', background: activeChat.isAgentActive ? 'linear-gradient(135deg,#dc2626,#7f1d1d)' : 'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {activeChat.isAgentActive ? '🚨' : '👤'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>+{selectedPhone}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: activeChat.isAgentActive ? '#fca5a5' : '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: activeChat.isAgentActive ? '#ef4444' : '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                    {activeChat.isAgentActive ? '🚨 Live Agent Active — AI Paused' : '🤖 AI Auto-Reply Active'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleToggleAgent}
                    style={{ background: activeChat.isAgentActive ? '#14532d' : '#7f1d1d', border: `1px solid ${activeChat.isAgentActive ? '#16a34a' : '#ef4444'}`, borderRadius: '10px', color: activeChat.isAgentActive ? '#4ade80' : '#fca5a5', padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                  >
                    {activeChat.isAgentActive ? '✅ End Live Session' : '🚨 Activate Live Agent'}
                  </button>
                  <span style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', color: '#64748b', padding: '8px 12px', fontSize: '12px' }}>
                    {activeChat.messages?.length || 0} messages
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(activeChat.messages || []).map((m, i) => {
                  const b = msgBubble(m);
                  const t2 = tag(m.text);
                  return (
                    <div key={m.id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: b.align }}>
                      <div style={{ maxWidth: '75%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexDirection: b.align === 'flex-end' ? 'row-reverse' : 'row' }}>
                          <span style={{ fontSize: '10px', color: b.labelColor, fontWeight: 600 }}>{b.label}</span>
                          <span style={{ background: t2.bg, color: t2.color, fontSize: '9px', padding: '1px 6px', borderRadius: '20px' }}>{t2.label}</span>
                          <span style={{ fontSize: '10px', color: '#475569' }}>{m.time}</span>
                        </div>
                        <div style={{ background: b.bg, border: b.border, borderRadius: b.align === 'flex-end' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '10px 14px' }}>
                          <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{m.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* ── AI Suggestions Bar ── */}
              <div style={{ background: '#0a0f1e', borderTop: '1px solid #1e293b', padding: '10px 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <IcoSparkles />
                  <span style={{ color: '#7c3aed', fontSize: '11px', fontWeight: 700 }}>AI SMART SUGGESTIONS</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {getAiSuggestions().map((s, i) => (
                    <button key={i} onClick={() => { setReplyText(s.text); inputRef.current?.focus(); }} style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: '20px', color: '#60a5fa', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 }}
                      onMouseEnter={e => { e.target.style.background = '#1e3a5f'; e.target.style.borderColor = '#1d4ed8'; }}
                      onMouseLeave={e => { e.target.style.background = '#0f172a'; e.target.style.borderColor = '#1e3a5f'; }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Reply Box ── */}
              <div style={{ background: '#0a0f1e', borderTop: '1px solid #1e293b', padding: '12px 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <textarea
                    ref={inputRef}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type your reply... (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#e2e8f0', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'inherit' }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={sending || !replyText.trim()}
                    style={{ background: sending || !replyText.trim() ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8,#7c3aed)', border: 'none', borderRadius: '12px', color: '#fff', padding: '14px 18px', cursor: sending || !replyText.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  >
                    <IcoSend />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes agent-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } 50% { box-shadow: 0 0 12px 2px rgba(239,68,68,0.3); } }
        @keyframes border-pulse { 0%, 100% { border-color: #ef4444; } 50% { border-color: #7f1d1d; } }
        @keyframes slide-in { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
