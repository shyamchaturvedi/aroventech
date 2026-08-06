'use client';

import { useState, useEffect, useCallback } from 'react';

const ADMIN_PIN = '8282';

// ─── Icon System ──────────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, color = 'currentColor', stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IcoPlus      = () => <Ico d="M12 5v14M5 12h14" />;
const IcoMinus     = () => <Ico d="M5 12h14" />;
const IcoSend      = () => <Ico d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />;
const IcoTrash     = () => <Ico d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />;
const IcoUser      = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IcoSearch    = () => <Ico d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" />;
const IcoBook      = () => <Ico d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />;
const IcoWhatsApp  = () => <Ico d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />;
const IcoArrowLeft = () => <Ico d="M19 12H5M12 19l-7-7 7-7" />;
const IcoLock      = () => <Ico d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" />;
const IcoRefresh   = () => <Ico d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />;
const IcoPhone     = () => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 6.29 6.29l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />;
const IcoCheck     = () => <Ico d="M20 6 9 17l-5-5" />;
const IcoX         = () => <Ico d="M18 6 6 18M6 6l12 12" />;
const IcoSettings  = () => <Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) + ' ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const fmtAmt = (n) => '₹' + Math.abs(Number(n)).toLocaleString('en-IN');

// ─── Global Styles ────────────────────────────────────────────────────────────
const G = {
  bg: '#020617',
  surface: '#0a0f1e',
  card: '#0f172a',
  border: '#1e293b',
  accent: '#16a34a',    // green = credit given
  red: '#dc2626',       // red = payment received  
  blue: '#2563eb',
  purple: '#7c3aed',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
  font: "'Inter','Segoe UI',sans-serif",
};

// ─── Shop Config Modal ────────────────────────────────────────────────────────
function ShopConfigModal({ shopConfig, onSave, onClose }) {
  const [shopId, setShopId] = useState(shopConfig.shopId || '');
  const [shopName, setShopName] = useState(shopConfig.shopName || '');
  const [shopUpiId, setShopUpiId] = useState(shopConfig.shopUpiId || '');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20, width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: G.textPrimary, margin: '0 0 6px', fontSize: 20, fontWeight: 700 }}>⚙️ Shop Setup</h2>
        <p style={{ color: G.textSecondary, margin: '0 0 24px', fontSize: 13 }}>Apni shop ki details dalo — bill aur reminders mein dikhai denge</p>
        {[
          { label: 'SHOP ID (MeriShop app wala)', val: shopId, set: setShopId, placeholder: 'MSCHAUBEYSHOP01' },
          { label: 'SHOP NAME', val: shopName, set: setShopName, placeholder: 'Chaubey General Store' },
          { label: 'UPI ID (Payment ke liye)', val: shopUpiId, set: setShopUpiId, placeholder: 'yourname@upi' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ color: G.textSecondary, fontSize: 11, display: 'block', marginBottom: 5, letterSpacing: 1 }}>{f.label}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              style={{ width: '100%', background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: '11px 14px', color: G.textPrimary, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={onClose} style={{ flex: 1, background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, color: G.textSecondary, padding: 12, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
          <button onClick={() => onSave({ shopId: shopId || 'DEFAULT', shopName: shopName || 'MeriShop', shopUpiId })}
            style={{ flex: 2, background: `linear-gradient(135deg,${G.accent},#059669)`, border: 'none', borderRadius: 10, color: '#fff', padding: 12, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            ✅ Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Customer Modal ───────────────────────────────────────────────────────
function AddCustomerModal({ shopId, onAdded, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return setErr('Naam likhna zaroori hai');
    setLoading(true); setErr('');
    const res = await fetch('/api/khata', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_customer', shopId, name: name.trim(), phone }),
    });
    const d = await res.json();
    setLoading(false);
    if (d.success) onAdded(d.customer);
    else setErr(d.error || 'Error');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 20, width: '100%', maxWidth: 420, padding: 28 }}>
        <h2 style={{ color: G.textPrimary, margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>➕ New Customer</h2>
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: G.textSecondary, fontSize: 11, display: 'block', marginBottom: 5 }}>CUSTOMER NAME *</label>
          <input autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Ramesh Kumar" style={{ width: '100%', background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: '12px 14px', color: G.textPrimary, fontSize: 15, boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: G.textSecondary, fontSize: 11, display: 'block', marginBottom: 5 }}>MOBILE NUMBER (Optional — WhatsApp reminder ke liye)</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="9876543210"
            style={{ width: '100%', background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: '12px 14px', color: G.textPrimary, fontSize: 15, boxSizing: 'border-box', letterSpacing: 1 }} />
        </div>
        {err && <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 14px' }}>⚠️ {err}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, color: G.textSecondary, padding: 12, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleAdd} disabled={loading}
            style={{ flex: 2, background: `linear-gradient(135deg,${G.accent},#059669)`, border: 'none', borderRadius: 10, color: '#fff', padding: 12, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {loading ? '⏳...' : '✅ Add Customer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Entry Modal (Credit / Payment) ──────────────────────────────────────
function AddEntryModal({ customer, shopId, onAdded, onClose }) {
  const [type, setType] = useState('credit'); // 'credit' | 'payment'
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return alert('Valid amount dalo');
    setLoading(true);
    const res = await fetch('/api/khata', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_entry', shopId, customerId: customer.id, type, amount: Number(amount), note }),
    });
    const d = await res.json();
    setLoading(false);
    if (d.success) onAdded(d.entry);
  };

  const isCredit = type === 'credit';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: G.surface, border: `1px solid ${isCredit ? G.accent : G.red}`, borderRadius: 20, width: '100%', maxWidth: 420, padding: 28, boxShadow: `0 20px 60px ${isCredit ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)'}` }}>
        <h2 style={{ color: G.textPrimary, margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>
          {isCredit ? '📤 Diya (Credit)' : '📥 Liya (Payment)'}
        </h2>
        <p style={{ color: G.textSecondary, margin: '0 0 20px', fontSize: 13 }}>{customer.name}</p>

        {/* Type Toggle */}
        <div style={{ display: 'flex', background: G.card, borderRadius: 12, padding: 4, marginBottom: 20, border: `1px solid ${G.border}` }}>
          {[
            { val: 'credit', label: '📤 Credit Diya', color: G.accent, desc: 'Aapne customer ko credit diya' },
            { val: 'payment', label: '📥 Payment Aaya', color: G.red, desc: 'Customer ne paisa diya' },
          ].map(t => (
            <button key={t.val} onClick={() => setType(t.val)}
              style={{ flex: 1, background: type === t.val ? t.color : 'transparent', border: 'none', borderRadius: 9, color: type === t.val ? '#fff' : G.textSecondary, padding: '10px 8px', cursor: 'pointer', fontWeight: type === t.val ? 700 : 400, fontSize: 13, transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ background: G.card, borderRadius: 12, padding: '12px 16px', marginBottom: 16, border: `1px solid ${isCredit ? '#14532d' : '#7f1d1d'}` }}>
          <p style={{ margin: 0, fontSize: 12, color: isCredit ? '#4ade80' : '#f87171' }}>
            {isCredit ? '⬆️ Ye amount customer ke baki mein JODEGA (balance badhega)' : '⬇️ Ye amount customer ke baki se GHATA dega (balance kam hoga)'}
          </p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: G.textSecondary, fontSize: 11, display: 'block', marginBottom: 5 }}>AMOUNT (₹) *</label>
          <input autoFocus value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="0"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{ width: '100%', background: G.bg, border: `2px solid ${isCredit ? G.accent : G.red}`, borderRadius: 12, padding: '14px 16px', color: G.textPrimary, fontSize: 24, fontWeight: 700, boxSizing: 'border-box', textAlign: 'center' }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: G.textSecondary, fontSize: 11, display: 'block', marginBottom: 5 }}>NOTE (Optional)</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Kya kharida / kya diya..."
            style={{ width: '100%', background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: '11px 14px', color: G.textPrimary, fontSize: 14, boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, color: G.textSecondary, padding: 12, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleAdd} disabled={loading}
            style={{ flex: 2, background: isCredit ? `linear-gradient(135deg,${G.accent},#059669)` : `linear-gradient(135deg,${G.red},#991b1b)`, border: 'none', borderRadius: 10, color: '#fff', padding: 12, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {loading ? '⏳...' : isCredit ? '✅ Credit Add Karo' : '✅ Payment Mark Karo'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Customer Ledger View ─────────────────────────────────────────────────────
function CustomerLedger({ customer, shopId, shopConfig, onBack, onRefresh }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [addType, setAddType] = useState('credit');
  const [sendingWA, setSendingWA] = useState(false);
  const [waSent, setWaSent] = useState(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/khata?shopId=${shopId}&customerId=${customer.id}`);
    const d = await res.json();
    setEntries(d.entries || []);
    setLoading(false);
  }, [shopId, customer.id]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  // Calculate net balance from this customer's entries
  const balance = entries.reduce((acc, e) => {
    if (e.type === 'credit') return acc + Number(e.amount);
    if (e.type === 'payment') return acc - Number(e.amount);
    return acc;
  }, 0);

  const isOwed = balance > 0;  // Customer owes you
  const isPaid = balance <= 0; // You owe customer (advance)

  const handleDeleteEntry = async (entryId) => {
    if (!confirm('Is entry ko delete karein?')) return;
    await fetch('/api/khata', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete_entry', shopId, entryId }) });
    loadEntries();
    onRefresh();
  };

  const handleSendReminder = async () => {
    if (!customer.phone) return alert('Is customer ka phone number nahi hai. Edit karke add karo.');
    setSendingWA(true); setWaSent(null);
    const res = await fetch('/api/khata', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_reminder', shopId,
        shopName: shopConfig.shopName, shopUpiId: shopConfig.shopUpiId,
        customerId: customer.id, customerName: customer.name,
        customerPhone: customer.phone, balance,
      }),
    });
    const d = await res.json();
    setSendingWA(false);
    setWaSent(d.whatsappSent);
    if (d.success) loadEntries(); // Refresh to show reminder log
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {showAddEntry && (
        <AddEntryModal
          customer={customer} shopId={shopId}
          onAdded={() => { setShowAddEntry(false); loadEntries(); onRefresh(); }}
          onClose={() => setShowAddEntry(false)}
        />
      )}

      {/* Header */}
      <div style={{ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: '14px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, color: G.textSecondary, padding: '8px', cursor: 'pointer', display: 'flex' }}>
            <IcoArrowLeft />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: G.textPrimary, margin: 0, fontSize: 18, fontWeight: 700 }}>{customer.name}</h2>
            {customer.phone && <p style={{ color: G.textSecondary, margin: 0, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><IcoPhone /> +91{customer.phone.replace(/^91/, '')}</p>}
          </div>
          <button onClick={loadEntries} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, color: G.textSecondary, padding: '8px', cursor: 'pointer', display: 'flex' }}>
            <IcoRefresh />
          </button>
        </div>

        {/* Balance Card */}
        <div style={{ background: isOwed ? 'linear-gradient(135deg,#052e16,#14532d)' : 'linear-gradient(135deg,#0c1445,#1e3a8a)', border: `1px solid ${isOwed ? G.accent : G.blue}`, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, color: G.textSecondary, fontSize: 11, letterSpacing: 1 }}>{isOwed ? 'CUSTOMER KO DENA HAI' : balance === 0 ? 'CLEAR (BARABAR)' : 'AAPKO DENA HAI'}</p>
            <p style={{ margin: '4px 0 0', fontSize: 32, fontWeight: 800, color: isOwed ? '#4ade80' : balance === 0 ? G.textSecondary : '#60a5fa' }}>
              {fmtAmt(balance)}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: G.textSecondary }}>
              {balance === 0 ? '✅ Sab clear hai' : isOwed ? `${customer.name} ko ₹${Math.abs(balance)} dena hai` : `Aapko ₹${Math.abs(balance)} wapas karna hai`}
            </p>
          </div>
          {isOwed && customer.phone && (
            <button onClick={handleSendReminder} disabled={sendingWA}
              style={{ background: sendingWA ? G.card : 'linear-gradient(135deg,#25d366,#128c7e)', border: 'none', borderRadius: 12, color: '#fff', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              <IcoWhatsApp /> {sendingWA ? 'Sending...' : 'Remind'}
            </button>
          )}
        </div>
        {waSent !== null && (
          <p style={{ color: waSent ? '#4ade80' : '#f87171', fontSize: 12, margin: '8px 0 0', textAlign: 'center' }}>
            {waSent ? '✅ WhatsApp reminder bhej diya!' : '⚠️ WhatsApp nahi gaya, check karo'}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 20px', background: G.bg, flexShrink: 0 }}>
        <button onClick={() => { setAddType('credit'); setShowAddEntry(true); }}
          style={{ flex: 1, background: 'linear-gradient(135deg,#052e16,#14532d)', border: `1px solid ${G.accent}`, borderRadius: 12, color: '#4ade80', padding: '13px', cursor: 'pointer', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <IcoPlus /> Credit Diya
        </button>
        <button onClick={() => { setAddType('payment'); setShowAddEntry(true); }}
          style={{ flex: 1, background: 'linear-gradient(135deg,#450a0a,#7f1d1d)', border: `1px solid ${G.red}`, borderRadius: 12, color: '#f87171', padding: '13px', cursor: 'pointer', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <IcoMinus /> Payment Aaya
        </button>
      </div>

      {/* Transaction List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: G.textMuted }}>Loading...</div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ fontSize: 40, margin: '0 0 8px' }}>📒</p>
            <p style={{ color: G.textSecondary, margin: 0 }}>Koi entry nahi hai abhi</p>
            <p style={{ color: G.textMuted, fontSize: 13, margin: '4px 0 0' }}>Upar se Credit ya Payment add karo</p>
          </div>
        ) : (
          <>
            <p style={{ color: G.textMuted, fontSize: 11, letterSpacing: 1, marginBottom: 10 }}>TRANSACTION HISTORY ({entries.filter(e => e.type !== 'reminder').length} entries)</p>
            {[...entries].reverse().map(e => {
              const isReminder = e.type === 'reminder';
              const isCredit = e.type === 'credit';
              const isPay = e.type === 'payment';
              return (
                <div key={e.id} style={{ background: G.card, border: `1px solid ${isCredit ? '#14532d' : isPay ? '#7f1d1d' : G.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: isCredit ? '#052e16' : isPay ? '#450a0a' : '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {isCredit ? '📤' : isPay ? '📥' : '📱'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, color: isCredit ? '#4ade80' : isPay ? '#f87171' : '#a78bfa', fontWeight: 600, fontSize: 14 }}>
                      {isCredit ? '+ Credit Diya' : isPay ? '- Payment Aaya' : 'WhatsApp Reminder'}
                    </p>
                    {e.note && <p style={{ margin: '2px 0 0', color: G.textSecondary, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.note}</p>}
                    <p style={{ margin: '2px 0 0', color: G.textMuted, fontSize: 11 }}>{fmtDate(e.created_at)}</p>
                  </div>
                  {!isReminder && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: isCredit ? '#4ade80' : '#f87171' }}>
                        {isCredit ? '+' : '-'}{fmtAmt(e.amount)}
                      </p>
                      <button onClick={() => handleDeleteEntry(e.id)} style={{ background: 'none', border: 'none', color: G.textMuted, cursor: 'pointer', padding: '2px', marginTop: 4, display: 'flex' }}>
                        <IcoTrash size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function KhataBookPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinErr, setPinErr] = useState(false);

  const [shopConfig, setShopConfig] = useState({ shopId: 'DEFAULT', shopName: 'MeriShop', shopUpiId: '' });
  const [showShopConfig, setShowShopConfig] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [filterBalance, setFilterBalance] = useState('all'); // 'all' | 'owed' | 'clear'

  // PIN unlock
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const s = sessionStorage.getItem('khata_unlocked');
      const saved = localStorage.getItem('khata_shop_config');
      if (s === 'true') setIsUnlocked(true);
      if (saved) setShopConfig(JSON.parse(saved));
    }
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsUnlocked(true); setPinErr(false);
      sessionStorage.setItem('khata_unlocked', 'true');
    } else setPinErr(true);
  };

  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    try {
      const res = await fetch(`/api/khata?shopId=${shopConfig.shopId}`);
      const d = await res.json();
      setCustomers(d.customers || []);
    } catch (_) {}
    setLoadingCustomers(false);
  }, [shopConfig.shopId]);

  useEffect(() => { if (isUnlocked) loadCustomers(); }, [isUnlocked, loadCustomers]);

  const handleSaveShopConfig = (config) => {
    setShopConfig(config);
    localStorage.setItem('khata_shop_config', JSON.stringify(config));
    setShowShopConfig(false);
    loadCustomers();
  };

  const filteredCustomers = customers
    .filter(c => {
      const q = searchQ.toLowerCase();
      return c.name.toLowerCase().includes(q) || (c.phone || '').includes(q);
    })
    .filter(c => {
      if (filterBalance === 'owed') return c.balance > 0;
      if (filterBalance === 'clear') return c.balance <= 0;
      return true;
    })
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

  const totalOwed = customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0);
  const totalCustomers = customers.length;
  const overdueCount = customers.filter(c => c.balance > 0).length;

  // ── Lock Screen ──────────────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at top,#0a1628,${G.bg})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: G.font }}>
        <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 24, padding: 40, width: '100%', maxWidth: 380, textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#16a34a,#059669)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>📒</div>
          <h1 style={{ color: G.textPrimary, margin: '0 0 6px', fontSize: 22, fontWeight: 800 }}>Khata Book</h1>
          <p style={{ color: G.textSecondary, margin: '0 0 32px', fontSize: 14 }}>OkCredit ki tarah — Apna Udhaar Khata</p>
          <form onSubmit={handleUnlock}>
            <input
              value={pin} onChange={e => { setPin(e.target.value); setPinErr(false); }}
              type="password" maxLength={6} placeholder="Enter PIN"
              style={{ width: '100%', background: G.card, border: `2px solid ${pinErr ? G.red : G.border}`, borderRadius: 12, padding: '14px', color: G.textPrimary, fontSize: 22, textAlign: 'center', letterSpacing: 8, boxSizing: 'border-box', marginBottom: 12 }}
            />
            {pinErr && <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 12px' }}>❌ Wrong PIN</p>}
            <button type="submit" style={{ width: '100%', background: `linear-gradient(135deg,${G.accent},#059669)`, border: 'none', borderRadius: 12, color: '#fff', padding: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              🔓 Unlock Khata
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main App ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: G.bg, fontFamily: G.font, display: 'flex', flexDirection: 'column' }}>
      {showShopConfig && <ShopConfigModal shopConfig={shopConfig} onSave={handleSaveShopConfig} onClose={() => setShowShopConfig(false)} />}
      {showAddCustomer && (
        <AddCustomerModal shopId={shopConfig.shopId}
          onAdded={() => { setShowAddCustomer(false); loadCustomers(); }}
          onClose={() => setShowAddCustomer(false)}
        />
      )}

      {/* ── TOP HEADER ── */}
      <div style={{ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: '14px 20px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#16a34a,#059669)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📒</div>
            <div>
              <h1 style={{ margin: 0, color: G.textPrimary, fontSize: 17, fontWeight: 800 }}>Khata Book</h1>
              <p style={{ margin: 0, color: G.textSecondary, fontSize: 11 }}>🏪 {shopConfig.shopName}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={loadCustomers} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, color: G.textSecondary, padding: 9, cursor: 'pointer', display: 'flex' }}><IcoRefresh /></button>
            <button onClick={() => setShowShopConfig(true)} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, color: G.textSecondary, padding: 9, cursor: 'pointer', display: 'flex' }}><IcoSettings /></button>
            <button onClick={() => setShowAddCustomer(true)}
              style={{ background: `linear-gradient(135deg,${G.accent},#059669)`, border: 'none', borderRadius: 10, color: '#fff', padding: '9px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IcoPlus /> Add Customer
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Total Customers', val: totalCustomers, color: '#60a5fa', icon: '👥' },
            { label: 'Udhaar Baaki', val: overdueCount, color: '#f87171', icon: '⚠️' },
            { label: 'Total Payable', val: `₹${totalOwed.toLocaleString('en-IN')}`, color: '#4ade80', icon: '💰' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: s.color }}>{s.icon} {s.val}</p>
              <p style={{ margin: 0, fontSize: 10, color: G.textMuted, letterSpacing: 0.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ── LEFT: Customer List ── */}
        <div style={{ width: selectedCustomer ? '380px' : '100%', minWidth: selectedCustomer ? 320 : 0, borderRight: selectedCustomer ? `1px solid ${G.border}` : 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.3s' }}>
          {/* Search + Filter */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${G.border}`, background: G.bg }}>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: G.textMuted }}><IcoSearch /></span>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Customer naam ya number..." 
                style={{ width: '100%', background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: '10px 14px 10px 42px', color: G.textPrimary, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ val: 'all', label: 'All' }, { val: 'owed', label: '⚠️ Baaki Hai' }, { val: 'clear', label: '✅ Clear' }].map(f => (
                <button key={f.val} onClick={() => setFilterBalance(f.val)}
                  style={{ flex: 1, background: filterBalance === f.val ? G.accent : G.card, border: `1px solid ${filterBalance === f.val ? G.accent : G.border}`, borderRadius: 8, color: filterBalance === f.val ? '#fff' : G.textSecondary, padding: '6px 4px', cursor: 'pointer', fontSize: 12, fontWeight: filterBalance === f.val ? 700 : 400 }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Cards */}
          <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px' }}>
            {loadingCustomers ? (
              <div style={{ textAlign: 'center', padding: 40, color: G.textMuted }}>Loading khata...</div>
            ) : filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <p style={{ fontSize: 48, margin: '0 0 10px' }}>📒</p>
                <p style={{ color: G.textSecondary, margin: 0, fontWeight: 600 }}>{customers.length === 0 ? 'Koi customer nahi' : 'Koi match nahi mila'}</p>
                {customers.length === 0 && <p style={{ color: G.textMuted, fontSize: 13, margin: '8px 0 0' }}>Upar "Add Customer" karke shuru karo</p>}
              </div>
            ) : filteredCustomers.map(c => {
              const isOwed = c.balance > 0;
              const isClear = c.balance <= 0;
              const isSelected = selectedCustomer?.id === c.id;
              return (
                <div key={c.id} onClick={() => setSelectedCustomer(c)}
                  style={{ background: isSelected ? (isOwed ? '#052e16' : '#0c1445') : G.card, border: `1px solid ${isSelected ? (isOwed ? G.accent : G.blue) : G.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s', boxShadow: isSelected ? `0 0 0 2px ${isOwed ? G.accent : G.blue}33` : 'none' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: isOwed ? '#052e16' : '#1e1b4b', border: `2px solid ${isOwed ? G.accent : G.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, color: G.textPrimary, fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <p style={{ margin: '2px 0 0', color: G.textMuted, fontSize: 12 }}>{c.phone ? `+91${c.phone.replace(/^91/, '')}` : 'No number'}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: isOwed ? '#4ade80' : c.balance === 0 ? G.textMuted : '#60a5fa' }}>
                      {c.balance === 0 ? '—' : fmtAmt(c.balance)}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 10, color: isOwed ? '#4ade80' : c.balance === 0 ? G.textMuted : '#60a5fa' }}>
                      {c.balance === 0 ? 'Clear' : isOwed ? 'Baaki' : 'Advance'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Ledger Detail ── */}
        {selectedCustomer ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <CustomerLedger
              customer={selectedCustomer}
              shopId={shopConfig.shopId}
              shopConfig={shopConfig}
              onBack={() => setSelectedCustomer(null)}
              onRefresh={loadCustomers}
            />
          </div>
        ) : null}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${G.bg}; }
        ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 3px; }
        input, textarea, button { outline: none; font-family: inherit; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}
