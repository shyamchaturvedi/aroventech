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
  const [newNumber, setNewNumber] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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

  // Dynamic AI Smart Reply Suggestions Generator
  const getAiSmartSuggestions = () => {
    if (!activeChat || !activeChat.messages || activeChat.messages.length === 0) return [];
    
    const customerMsgs = activeChat.messages.filter(m => m.sender === 'customer');
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

  const handleEndChatSession = async () => {
    if (!selectedPhone) return;
    const closingMessage = 'Namaste ji! Aapka support session resolve ho gaya hai. MeriShop POS se judne ke liye dhanyawad! Kripya dobara zaroorat padne par bejhijhak message karein. 🙏';
    
    setSending(true);
    try {
      // 1. Send Closing SMS
      await fetch('/api/whatsapp-webhook/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: selectedPhone,
          messageText: closingMessage,
        }),
      });

      // 2. Disable Live Agent mode & re-enable AI
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

  // SECURITY PIN LOCK SCREEN
  if (!isUnlocked) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', fontFamily: 'system-ui, sans-serif', color: '#f8fafc' }}>
        <form onSubmit={handleUnlockPin} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '36px 40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', width: '340px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#22c55e' }}>Admin Support Desk</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 24px 0' }}>Enter Admin Access PIN Code to unlock</p>

          <input
            type="password"
            maxLength={4}
            placeholder="PIN Code (e.g. 8282)"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              border: pinError ? '2px solid #ef4444' : '1px solid #475569',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '6px',
              outline: 'none',
              marginBottom: '12px',
            }}
          />

          {pinError && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>❌ Incorrect PIN! Try again.</div>}

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Unlock Dashboard 🔓
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      {/* LEFT SIDEBAR: Active Conversations List */}
      <div style={{ width: '320px', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', backgroundColor: '#1e293b' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
              💬 Live WhatsApp Desk
            </h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + New Chat
              </button>
              <button
                onClick={handleLockPage}
                title="Lock Admin Desk"
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🔒 Lock
              </button>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Helpline: +91 82829 38658 • Meta Cloud API
          </p>
        </div>

        {/* Modal / Quick Add Number */}
        {showAddModal && (
          <div style={{ padding: '12px 16px', backgroundColor: '#334155', borderBottom: '1px solid #475569', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Enter 10-digit number..."
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              style={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #64748b', borderRadius: '4px', padding: '6px 10px', color: '#fff', fontSize: '12px' }}
            />
            <button
              onClick={handleAddNewNumber}
              style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Add
            </button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map((chat) => {
            const isSelected = chat.phone === selectedPhone;
            return (
              <div
                key={chat.phone}
                onClick={() => setSelectedPhone(chat.phone)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #334155',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#334155' : 'transparent',
                  borderLeft: isSelected ? '4px solid #22c55e' : '4px solid transparent',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#f8fafc' }}>
                    +{chat.phone}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{chat.lastTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                    {chat.lastMessage || 'No messages'}
                  </div>
                  {chat.isAgentActive && (
                    <span style={{ fontSize: '9px', backgroundColor: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '6px' }}>
                      LIVE CHAT
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN PANEL: Active Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
        {selectedPhone && activeChat ? (
          <>
            {/* Header Bar */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #334155', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#f8fafc' }}>
                  Customer: +{activeChat.phone}
                </h3>
                <span style={{ fontSize: '11px', color: activeChat.isAgentActive ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                  {activeChat.isAgentActive ? '🔴 Live Agent Session Active (AI Paused)' : '🟢 AI Auto-Reply Active'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {activeChat.isAgentActive && (
                  <button
                    onClick={handleEndChatSession}
                    style={{
                      backgroundColor: '#dc2626',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(220, 38, 38, 0.4)',
                    }}
                  >
                    🔴 END CHAT SESSION (Re-enable AI)
                  </button>
                )}
                <button
                  onClick={handleToggleSession}
                  style={{
                    backgroundColor: activeChat.isAgentActive ? '#0284c7' : '#ef4444',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {activeChat.isAgentActive ? '🔄 Pause Agent' : '🔴 Start Agent Takeover'}
                </button>
                <button
                  onClick={fetchChats}
                  style={{ backgroundColor: '#334155', border: 'none', color: '#f8fafc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Smart AI Suggested Reply Chips */}
            <div style={{ padding: '10px 24px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
              <div style={{ fontSize: '10px', color: '#86efac', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🤖 AI Smart Suggested Replies (1-Click Fill & Send):
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {getAiSmartSuggestions().map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendReply(sug.text)}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontWeight: '500',
                    }}
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Stream */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeChat.messages.map((msg) => {
                const isCustomer = msg.sender === 'customer';
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isCustomer ? 'flex-start' : 'flex-end',
                      maxWidth: '70%',
                      backgroundColor: isCustomer ? '#334155' : isAgent ? '#15803d' : '#1e293b',
                      color: '#f8fafc',
                      padding: '12px 16px',
                      borderRadius: isCustomer ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: isCustomer ? '#94a3b8' : '#86efac', fontWeight: 'bold', marginBottom: '4px' }}>
                      {isCustomer ? '👤 Customer' : isAgent ? '👨‍💼 Support Executive (You)' : '🤖 AI Auto-Reply'}
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'right', marginTop: '4px' }}>{msg.time}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Text Input Footer */}
            <div style={{ padding: '16px 24px', backgroundColor: '#1e293b', borderTop: '1px solid #334155', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Type 1-on-1 manual reply... (Sending automatically pauses AI)"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                style={{
                  flex: 1,
                  backgroundColor: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '24px',
                  padding: '12px 20px',
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSendReply()}
                disabled={sending || !replyText.trim()}
                style={{
                  backgroundColor: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  cursor: sending ? 'wait' : 'pointer',
                  opacity: sending || !replyText.trim() ? 0.6 : 1,
                }}
              >
                {sending ? 'Sending...' : 'Send SMS 🚀'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px' }}>
            Select a customer from the left sidebar to start live chatting!
          </div>
        )}
      </div>
    </div>
  );
}
