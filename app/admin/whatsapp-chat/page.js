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
const IcoExternalLink = () => <Ico d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />;

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

  const parseNumbers = (raw) => raw
    .split(/[\n\r,;|\t]+/).flatMap(l => l.split(/\s+/))
    .map(p => p.replace(/\D/g, '').trim()).filter(p => p.length >= 10);

  const handleSend = async () => {
    const phoneList = parseNumbers(phones);
    if (!phoneList.length) return alert('Koi bhi valid number nahi diya!');
    if (!message.trim()) return alert('Message likho pehle!');

    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/whatsapp-webhook/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'campaign_blast', phonesRaw: phones, message: message.trim(), campaignName: campaignName || 'Campaign' }),
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>CAMPAIGN NAME (Optional)</label>
          <input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. Diwali Sale 2024, Monthly Offer..." style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>

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
          <p style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>{parseNumbers(phones).length} valid numbers detected</p>
        </div>

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
          <div style={{ background: result.error ? '#450a0a' : '#052e16', border: `1px solid ${result.error ? '#ef4444' : '#16a34a'}`, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            {result.error ? (
              <p style={{ color: '#f87171', margin: 0, fontSize: '14px', fontWeight: 600 }}>❌ {result.error}</p>
            ) : (
              <div>
                <p style={{ color: '#4ade80', margin: '0 0 4px', fontSize: '15px', fontWeight: 700 }}>✅ Campaign Sent!</p>
                <p style={{ color: '#e2e8f0', margin: 0, fontSize: '13px' }}>📊 Sent: {result.sent} | ❌ Failed: {result.failed} / Total: {result.total}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={sending}
          style={{ width: '100%', background: sending ? '#1e293b' : 'linear-gradient(135deg,#7c3aed,#1d4ed8)', border: 'none', borderRadius: '12px', color: '#fff', padding: '14px', fontSize: '16px', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {sending ? '⏳ Sending Campaign...' : <><IcoSend /> Send Campaign to {parseNumbers(phones).length} Numbers</>}
        </button>
      </div>
    </div>
  );
}

// ─── Single SMS Panel ────────────────────────────────────────────────────────
function SingleSmsPanel({ onClose, defaultPhone = '' }) {
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const cleanDigits = (phone || '').replace(/\D/g, '');

  const handleSendMetaAPI = async () => {
    if (cleanDigits.length < 10) return alert('Valid 10-digit number dalo!');
    if (!message.trim()) return alert('Message likho pehle!');
    setSending(true); setResult(null);
    try {
      const res = await fetch('/api/whatsapp-webhook/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_single', phone: cleanDigits, message: message.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setSending(false);
  };

  const handleOpenDirectWhatsApp = () => {
    if (cleanDigits.length < 10) return alert('Valid 10-digit number dalo!');
    if (!message.trim()) return alert('Message likho pehle!');
    const fullPhone = cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message.trim())}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'linear-gradient(135deg,#0a0f1e,#0d1f3c)', border: '1px solid #16a34a', borderRadius: '20px', width: '100%', maxWidth: '520px', padding: '28px', boxShadow: '0 25px 60px rgba(0,200,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 700 }}>📱 Single WhatsApp Send</h2>
            <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '13px' }}>Kisi bhi number par instant message bhejo</p>
          </div>
          <button onClick={onClose} style={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#94a3b8', padding: '8px', cursor: 'pointer' }}><IcoX /></button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>CUSTOMER PHONE NUMBER</label>
          <input
            value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="9876543210 (10 digit)" type="tel"
            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '12px 14px', color: '#e2e8f0', fontSize: '16px', boxSizing: 'border-box', letterSpacing: '1px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>MESSAGE</label>
          <textarea
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Yahan apna message likho..."
            rows={5}
            style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: '#e2e8f0', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            {[
              { l: '👋 Greeting', t: 'Namaste ji! 🙏 MeriShop Support Executive yahan hai. Bataiye kya madad chahiye?' },
              { l: '🧾 Invoice Ready', t: 'Namaste ji! Aapka invoice ready hai. Koi sawaal ho toh zaroor bataiye. Dhanyawad! 🙏' },
              { l: '🔔 Udhaar Reminder', t: 'Namaste ji! 🙏 Aapka hamare yahan kuch baki rakam hai. Kripya payment kar dein. Dhanyawad!' },
            ].map(t => (
              <button key={t.l} onClick={() => setMessage(t.t)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', padding: '5px 10px', cursor: 'pointer', fontSize: '11px' }}>{t.l}</button>
            ))}
          </div>
        </div>

        {result && (
          <div style={{ background: result.success ? '#052e16' : '#450a0a', border: `1px solid ${result.success ? '#16a34a' : '#ef4444'}`, borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
            {result.success ? (
              <p style={{ color: '#4ade80', margin: 0, fontSize: '13px', fontWeight: 600 }}>
                ✅ WhatsApp Message Delivered — +91{cleanDigits}
              </p>
            ) : (
              <div>
                <p style={{ color: '#f87171', margin: 0, fontSize: '13px', fontWeight: 600 }}>
                  ⚠️ Meta Cloud API Delivery Restriction
                </p>
                <p style={{ color: '#cbd5e1', margin: '4px 0 0', fontSize: '12px' }}>
                  {result.error || 'Number needs to send 1 WhatsApp message to your Meta number first.'}
                </p>
                <button
                  onClick={handleOpenDirectWhatsApp}
                  style={{ marginTop: '8px', background: '#25d366', border: 'none', borderRadius: '6px', color: '#fff', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <IcoExternalLink /> 📲 Open Direct WhatsApp Chat to Send
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSendMetaAPI} disabled={sending}
            style={{ flex: 1, background: sending ? '#1e293b' : 'linear-gradient(135deg,#16a34a,#059669)', border: 'none', borderRadius: '12px', color: '#fff', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {sending ? '⏳ Sending...' : <><IcoSend /> Meta Cloud Send</>}
          </button>
          
          <button
            onClick={handleOpenDirectWhatsApp}
            style={{ background: 'linear-gradient(135deg,#128c7e,#25d366)', border: 'none', borderRadius: '12px', color: '#fff', padding: '14px 18px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            title="Open WhatsApp app with pre-filled message"
          >
            <IcoExternalLink /> 1-Tap WA
          </button>
        </div>
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
  const [showSingleSms, setShowSingleSms] = useState(false);
  const [singleSmsDefaultPhone, setSingleSmsDefaultPhone] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
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

  const liveAgentCount = chats.filter(c => c.isAgentActive).length;
  const todayMsgs = chats.reduce((acc, c) => acc + (c.messages?.filter(m => Date.now() - m.timestamp < 86400000)?.length || 0), 0);
  const invoiceChats = chats.filter(c => c.messages?.some(m => m.text?.includes('🧾') || m.text?.includes('Invoice')));
  const udhaarChats = chats.filter(c => c.messages?.some(m => m.text?.includes('Udhaar') || m.text?.includes('baki rakam')));

  const filteredChats = chats.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.phone.includes(q) || c.lastMessage?.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filterType === 'agent') return c.isAgentActive;
    if (filterType === 'invoice') return c.messages?.some(m => m.text?.includes('🧾') || m.text?.includes('Invoice'));
    if (filterType === 'udhaar') return c.messages?.some(m => m.text?.includes('Udhaar') || m.text?.includes('baki rakam'));
    if (filterType === 'ai') return !c.isAgentActive;
    return true;
  });

  const getSmartSuggestions = () => {
    if (!activeChat || !activeChat.messages?.length) return [];
    const lastMsg = activeChat.messages[activeChat.messages.length - 1];
    const last = (lastMsg?.text || '').toLowerCase();
    const base = [
      { label: '👋 Greeting', text: 'Namaste ji! 🙏 MeriShop Support Executive yahan hai. Bataiye kya madad chahiye?' },
      { label: '📦 App Download', text: 'MeriShop App Play Store se download karein: https://play.google.com/store/apps/details?id=com.aroventech.merishop' },
    ];
    if (last.includes('printer') || last.includes('bluetooth') || last.includes('print')) {
      base.unshift({ label: '🖨️ Printer Help', text: 'Bluetooth Printer pairing ke liye: Phone Settings → Bluetooth ON karein → Printer select karein PIN 0000/1234 dalo. Phir MeriShop app me Print Scan dabayein.' });
    }
    if (last.includes('bill') || last.includes('invoice')) {
      base.unshift({ label: '🧾 Invoice Info', text: 'Aapka Invoice ready hai. Koi item change karna ho toh app mein Edit Bill option select karein.' });
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

  if (!isUnlocked) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#020617,#0a0f1e,#020617)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <IcoLock />
          </div>
          <h1 style={{ color: '#fff', margin: '0 0 6px', fontSize: '22px', fontWeight: 800 }}>MeriShop CRM</h1>
          <p style={{ color: '#94a3b8', margin: '0 0 32px', fontSize: '14px' }}>Live WhatsApp Executive Desk</p>
          <form onSubmit={handleUnlock}>
            <input
              value={enteredPin} onChange={e => { setEnteredPin(e.target.value); setPinError(false); }}
              type="password" maxLength={6} placeholder="Enter Admin PIN"
              style={{ width: '100%', background: '#0f172a', border: `2px solid ${pinError ? '#ef4444' : '#334155'}`, borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '22px', textAlign: 'center', letterSpacing: '8px', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            {pinError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>❌ Invalid Admin PIN</p>}
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', border: 'none', borderRadius: '12px', color: '#fff', padding: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
              🔓 Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>
      {showCampaign && <CampaignPanel onClose={() => setShowCampaign(false)} />}
      {showSingleSms && <SingleSmsPanel onClose={() => setShowSingleSms(false)} defaultPhone={singleSmsDefaultPhone} />}

      {/* ── TOP HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg,#0a0f1e,#0d1f3c)', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcoMessage />
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 800 }}>MeriShop CRM</h1>
            <p style={{ margin: 0, color: '#4ade80', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
              Live WhatsApp Desk
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { label: 'Total Chats', value: chats.length, color: '#60a5fa', icon: '💬' },
            { label: 'Live Agents', value: liveAgentCount, color: '#f87171', icon: '🚨', pulse: liveAgentCount > 0 },
            { label: "Today's Messages", value: todayMsgs, color: '#34d399', icon: '📩' },
            { label: 'Invoices', value: invoiceChats.length, color: '#fb923c', icon: '🧾' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0f172a', border: `1px solid ${s.pulse ? '#ef4444' : '#1e293b'}`, borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: s.color }}>{s.icon} {s.value}</p>
              <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>{s.label}</p>
            </div>
          ))}
          <button onClick={() => setShowSingleSms(true)} style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IcoSend /> Single SMS
          </button>
          <button onClick={() => setShowCampaign(true)} style={{ background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IcoMegaphone /> Campaign
          </button>
          <button onClick={fetchChats} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#94a3b8', padding: '10px', cursor: 'pointer' }}>
            <IcoRefresh />
          </button>
        </div>
      </div>

      {/* ── MAIN CHAT INTERFACE ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div style={{ width: '360px', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', background: '#090d16' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}><IcoSearch /></span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search number or message..." style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px 12px 10px 38px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'agent', label: '🚨 Agent' },
                { id: 'invoice', label: '🧾 Invoice' },
                { id: 'udhaar', label: '⏰ Udhaar' },
                { id: 'ai', label: '🤖 AI Only' },
              ].map(t => (
                <button key={t.id} onClick={() => setFilterType(t.id)} style={{ background: filterType === t.id ? '#1e293b' : 'transparent', border: `1px solid ${filterType === t.id ? '#3b82f6' : '#1e293b'}`, borderRadius: '6px', color: filterType === t.id ? '#60a5fa' : '#64748b', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {filteredChats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
                <IcoMessage size={32} />
                <p style={{ margin: '12px 0 0', fontSize: '14px' }}>No chats found</p>
              </div>
            ) : (
              filteredChats.map(c => {
                const isSelected = c.phone === selectedPhone;
                const tg = tag(c.lastMessage);
                return (
                  <div key={c.phone} onClick={() => setSelectedPhone(c.phone)} style={{ background: isSelected ? 'linear-gradient(135deg,#0f172a,#1e293b)' : '#0d1322', border: `1px solid ${isSelected ? '#3b82f6' : c.isAgentActive ? '#ef4444' : '#1e293b'}`, borderRadius: '12px', padding: '12px', marginBottom: '8px', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>+{c.phone}</span>
                        {c.isAgentActive && <span style={{ background: '#7f1d1d', color: '#fca5a5', border: '1px solid #ef4444', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>LIVE AGENT</span>}
                      </div>
                      <span style={{ color: '#64748b', fontSize: '10px' }}>{c.lastTime}</span>
                    </div>

                    <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.lastMessage || 'No messages'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: tg.bg, color: tg.color, fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{tg.label}</span>
                      <span style={{ color: '#64748b', fontSize: '10px' }}>{c.messages?.length || 0} msgs</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#020617' }}>
          {activeChat ? (
            <>
              <div style={{ padding: '16px 24px', background: '#0a0f1e', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 700 }}>+{activeChat.phone}</h2>
                  <p style={{ color: activeChat.isAgentActive ? '#fca5a5' : '#60a5fa', margin: '2px 0 0', fontSize: '12px' }}>
                    {activeChat.isAgentActive ? '🚨 Live Agent Mode (AI Paused)' : '🤖 AI Rohit Replying 24/7'}
                  </p>
                </div>

                <button onClick={handleToggleAgent} style={{ background: activeChat.isAgentActive ? '#15803d' : '#b91c1c', border: 'none', borderRadius: '8px', color: '#fff', padding: '8px 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                  {activeChat.isAgentActive ? '🤖 Resume AI' : '🚨 Takeover (Live Agent)'}
                </button>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeChat.messages?.map((m, idx) => {
                  const b = msgBubble(m);
                  return (
                    <div key={m.id || idx} style={{ alignSelf: b.align, maxWidth: '75%' }}>
                      <div style={{ background: b.bg, border: b.border, borderRadius: '16px', padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '12px' }}>
                          <span style={{ color: b.labelColor, fontSize: '11px', fontWeight: 700 }}>{b.label}</span>
                          <span style={{ color: '#64748b', fontSize: '10px' }}>{m.time}</span>
                        </div>
                        <p style={{ color: '#f8fafc', margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{m.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Smart AI Suggestions */}
              <div style={{ padding: '8px 24px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {getSmartSuggestions().map((s, i) => (
                    <button key={i} onClick={() => handleSend(s.text)} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', color: '#94a3b8', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Box */}
              <div style={{ padding: '16px 24px', background: '#0a0f1e', borderTop: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <textarea
                    ref={inputRef}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type your reply... (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    style={{ flex: 1, background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px', resize: 'none' }}
                  />
                  <button onClick={() => handleSend()} disabled={sending} style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', border: 'none', borderRadius: '12px', color: '#fff', padding: '0 24px', fontWeight: 700, cursor: 'pointer' }}>
                    {sending ? '...' : <IcoSend />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
