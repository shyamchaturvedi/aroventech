'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminWhatsAppChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchChats = async () => {
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
    fetchChats();
    const interval = setInterval(fetchChats, 3000); // Poll every 3 seconds for real-time messages
    return () => clearInterval(interval);
  }, [selectedPhone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedPhone]);

  const activeChat = chats.find((c) => c.phone === selectedPhone);

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

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      {/* LEFT SIDEBAR: Active Conversations List */}
      <div style={{ width: '320px', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', backgroundColor: '#1e293b' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
            💬 Live WhatsApp Support Desk
          </h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Helpline: +91 82829 38658 • Meta Cloud API
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.length === 0 ? (
            <div style={{ padding: '24px', textTransform: 'none', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              No incoming WhatsApp chats yet.<br />Send a message to <b>+91 82829 38658</b> to test!
            </div>
          ) : (
            chats.map((chat) => {
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
                  <div style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.lastMessage || 'No messages'}
                  </div>
                </div>
              );
            })
          )}
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
                <span style={{ fontSize: '11px', color: '#22c55e' }}>● Live Connected 1-on-1 Session</span>
              </div>
              <button
                onClick={fetchChats}
                style={{ backgroundColor: '#334155', border: 'none', color: '#f8fafc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
              >
                🔄 Refresh
              </button>
            </div>

            {/* Quick Template Replies */}
            <div style={{ padding: '8px 24px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', gap: '8px', overflowX: 'auto' }}>
              <button
                onClick={() => handleSendReply('Namaste ji! Main MeriShop Support Manager speak kar raha hoon. Bataiye aapko app me kya dikkat aa rahi hai?')}
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                👋 Hello Greeting
              </button>
              <button
                onClick={() => handleSendReply('Printer connect karne ke liye Phone Settings me Bluetooth Pair karein (Pin 0000/1234), fir MeriShop App -> Settings -> Bluetooth Printer me Scan karein!')}
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                🖨️ Printer Help
              </button>
              <button
                onClick={() => handleSendReply('Aap Play Store se MeriShop FREE POS App download kar sakte hain: https://play.google.com/store/apps/details?id=com.aroventech.merishop')}
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                📲 Download App
              </button>
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
                placeholder="Type 1-on-1 manual reply to customer's WhatsApp..."
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
