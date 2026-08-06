import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';

// Initialize Supabase Client
const supabaseUrl = 'https://zmrxufpijlvwjazhtpyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── In-Memory Store (with Supabase persistence backup) ──────────────────────
globalThis.whatsappChatStore = globalThis.whatsappChatStore || {};
globalThis.agentActiveSessions = globalThis.agentActiveSessions || {};
globalThis.processedMessageIds = globalThis.processedMessageIds || new Set();
globalThis.supabaseLoaded = globalThis.supabaseLoaded || false;

// ✅ Normalize any Indian phone number to 12-digit E.164 format
export function normalizePhone(rawPhone) {
  let clean = (rawPhone || '').replace(/\D/g, '');
  if (clean.length === 10) clean = '91' + clean;
  return clean;
}

// ✅ PERSISTENT: Load chat history from Supabase into memory (runs once per cold start)
async function loadFromSupabase() {
  if (globalThis.supabaseLoaded) return;
  try {
    const { data, error } = await supabase
      .from('whatsapp_logs')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(2000); // Load last 2000 messages max

    if (error) { console.warn('Supabase load error:', error.message); return; }

    if (data && data.length > 0) {
      data.forEach(row => {
        const phone = normalizePhone(row.phone);
        if (!phone || phone.length < 10) return;
        if (!globalThis.whatsappChatStore[phone]) {
          globalThis.whatsappChatStore[phone] = [];
        }
        // Avoid loading duplicates already in memory
        const exists = globalThis.whatsappChatStore[phone].some(m => m.id === row.id?.toString());
        if (!exists) {
          globalThis.whatsappChatStore[phone].push({
            id: row.id?.toString() || Date.now().toString(),
            text: row.text || '',
            sender: row.sender || 'customer',
            time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date(row.created_at).getTime(),
          });
        }
      });
      console.log(`✅ Loaded ${data.length} messages from Supabase into memory.`);
    }
    globalThis.supabaseLoaded = true;
  } catch (e) {
    console.warn('Supabase loadFromSupabase failed:', e.message);
  }
}

// ✅ Save message to both in-memory store AND Supabase (persistent)
export function saveMessageToStore(fromPhone, text, sender = 'customer', msgId = null) {
  if (msgId && globalThis.processedMessageIds.has(msgId)) {
    console.log(`⚠️ Duplicate WhatsApp message ID ${msgId} skipped.`);
    return;
  }
  if (msgId) globalThis.processedMessageIds.add(msgId);

  const cleanPhone = normalizePhone(fromPhone);
  if (!cleanPhone || cleanPhone.length < 10) {
    console.warn('⚠️ Invalid phone number, skipping:', fromPhone);
    return;
  }

  if (!globalThis.whatsappChatStore[cleanPhone]) {
    globalThis.whatsappChatStore[cleanPhone] = [];
  }

  // Deduplicate consecutive identical messages within 3 seconds
  const existing = globalThis.whatsappChatStore[cleanPhone];
  if (existing.length > 0) {
    const last = existing[existing.length - 1];
    if (last.text.trim() === text.trim() && last.sender === sender && (Date.now() - last.timestamp < 3000)) {
      return;
    }
  }

  const msgEntry = {
    id: msgId || (Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4)),
    text,
    sender,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
  };

  globalThis.whatsappChatStore[cleanPhone].push(msgEntry);

  // ✅ Persistent: Save to Supabase database (non-blocking)
  supabase.from('whatsapp_logs').insert([
    { phone: cleanPhone, text, sender, created_at: new Date().toISOString() }
  ]).then(({ error }) => {
    if (error) console.warn('Supabase insert error:', error.message);
  }).catch(() => {});
}

export function isAgentSessionActive(phone) {
  const cleanPhone = normalizePhone(phone);
  return !!globalThis.agentActiveSessions[cleanPhone];
}

export function setAgentSessionActive(phone, isActive) {
  const cleanPhone = normalizePhone(phone);
  globalThis.agentActiveSessions[cleanPhone] = isActive;
}

// ─── 1. GET: Fetch all conversations (loads from Supabase on cold start) ──────
export async function GET() {
  // ✅ On cold start / server restart → load history from Supabase
  await loadFromSupabase();

  const chats = Object.entries(globalThis.whatsappChatStore).map(([phone, messages]) => ({
    phone,
    lastMessage: messages.length > 0 ? messages[messages.length - 1].text : '',
    lastTime: messages.length > 0 ? messages[messages.length - 1].time : '',
    messages,
    isAgentActive: !!globalThis.agentActiveSessions[phone],
  }));

  chats.sort((a, b) => {
    const tA = a.messages.at(-1)?.timestamp || 0;
    const tB = b.messages.at(-1)?.timestamp || 0;
    return tB - tA;
  });

  return NextResponse.json({ success: true, chats });
}

// ─── 2. POST: Admin actions (send SMS, toggle agent, create chat, log external) ─
export async function POST(request) {
  try {
    const body = await request.json();
    const { recipientPhone, messageText, action, sender } = body;

    if (!recipientPhone) {
      return NextResponse.json({ error: 'Missing recipient phone' }, { status: 400 });
    }

    const cleanPhone = normalizePhone(recipientPhone);

    // ── Log external message (from Flutter app: invoice, udhaar) ──
    if (action === 'log_external_message' && messageText) {
      saveMessageToStore(cleanPhone, messageText, sender || 'agent');
      return NextResponse.json({ success: true });
    }

    // ── Toggle Live Agent Session ──
    if (action === 'toggle_session') {
      const currentState = !!globalThis.agentActiveSessions[cleanPhone];
      globalThis.agentActiveSessions[cleanPhone] = !currentState;
      return NextResponse.json({ success: true, isAgentActive: !currentState });
    }

    // ── Create new empty chat ──
    if (action === 'create_chat') {
      saveMessageToStore(cleanPhone, 'Chat initialized by Admin', 'agent');
      return NextResponse.json({ success: true });
    }

    if (!messageText) {
      return NextResponse.json({ error: 'Missing message text' }, { status: 400 });
    }

    // ── Send WhatsApp message (activates Live Agent mode automatically) ──
    globalThis.agentActiveSessions[cleanPhone] = true;

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: { preview_url: true, body: messageText },
      }),
    });

    const data = await response.json();
    // Always save to store & Supabase regardless of WhatsApp API response
    saveMessageToStore(cleanPhone, messageText, 'agent');

    if (response.status === 200 || response.status === 201) {
      return NextResponse.json({ success: true, isAgentActive: true, data });
    } else {
      return NextResponse.json({ success: true, isAgentActive: true, warning: 'Saved locally, WA API issue', data });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
