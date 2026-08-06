import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1239035845955230';

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

// ✅ Robust Meta WhatsApp Delivery Engine (Handles Text + Template Fallback for new numbers outside 24h window)
export async function sendWAText(phone, text) {
  const cleanPhone = normalizePhone(phone);
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  try {
    // 1. Try sending standard freeform text message
    let r = await fetch(url, {
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
        text: { preview_url: true, body: text },
      }),
    });
    let data = await r.json();

    if (r.ok && !data.error && data.messages?.[0]?.id) {
      return { phone: cleanPhone, success: true, status: r.status, data };
    }

    const metaErr = data.error || {};
    console.warn(`⚠️ Meta WA text error for ${cleanPhone}: ${metaErr.message} (Code: ${metaErr.code})`);

    // 2. If 24h window restriction or new number error occurs, fallback to Meta Template message
    if (metaErr.code === 131047 || metaErr.code === 100 || (metaErr.message && metaErr.message.includes('24 hour'))) {
      console.log(`🔄 Attempting Meta Template ('hello_world') fallback for ${cleanPhone}...`);
      const tplRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'template',
          template: {
            name: 'hello_world',
            language: { code: 'en_US' }
          }
        })
      });
      const tplData = await tplRes.json();
      if (tplRes.ok && !tplData.error && tplData.messages?.[0]?.id) {
        return {
          phone: cleanPhone,
          success: true,
          status: tplRes.status,
          isTemplateFallback: true,
          note: 'Delivered via Meta Template (Opened 24h window)',
          data: tplData
        };
      }

      return {
        phone: cleanPhone,
        success: false,
        status: tplRes.status,
        error: `Meta Policy: Customer (+91${cleanPhone.replace(/^91/,'')}) must send 1 WhatsApp message first or create custom template. (${tplData.error?.message || metaErr.message})`,
        data: tplData
      };
    }

    return {
      phone: cleanPhone,
      success: false,
      status: r.status,
      error: `Meta Error ${metaErr.code || r.status}: ${metaErr.message || 'Delivery failed'}`,
      data
    };
  } catch (e) {
    return { phone: cleanPhone, success: false, error: e.message };
  }
}

// ✅ PERSISTENT: Load chat history from Supabase into memory (runs once per cold start)
async function loadFromSupabase() {
  if (globalThis.supabaseLoaded) return;
  try {
    const { data, error } = await supabase
      .from('whatsapp_logs')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(2000);

    if (error) { console.warn('Supabase load error:', error.message); return; }

    if (data && data.length > 0) {
      data.forEach(row => {
        const phone = normalizePhone(row.phone);
        if (!phone || phone.length < 10) return;
        if (!globalThis.whatsappChatStore[phone]) {
          globalThis.whatsappChatStore[phone] = [];
        }
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
    return;
  }
  if (msgId) globalThis.processedMessageIds.add(msgId);

  const cleanPhone = normalizePhone(fromPhone);
  if (!cleanPhone || cleanPhone.length < 10) return;

  if (!globalThis.whatsappChatStore[cleanPhone]) {
    globalThis.whatsappChatStore[cleanPhone] = [];
  }

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

// ─── 1. GET: Fetch all conversations ─────────────────────────────────────────
export async function GET() {
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

// ─── 2. POST: Admin actions ──────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { recipientPhone, messageText, action, sender } = body;

    if (!recipientPhone) {
      return NextResponse.json({ error: 'Missing recipient phone' }, { status: 400 });
    }

    const cleanPhone = normalizePhone(recipientPhone);

    if (action === 'log_external_message' && messageText) {
      saveMessageToStore(cleanPhone, messageText, sender || 'agent');
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_session') {
      const currentState = !!globalThis.agentActiveSessions[cleanPhone];
      globalThis.agentActiveSessions[cleanPhone] = !currentState;
      return NextResponse.json({ success: true, isAgentActive: !currentState });
    }

    if (action === 'create_chat') {
      saveMessageToStore(cleanPhone, 'Chat initialized by Admin', 'agent');
      return NextResponse.json({ success: true });
    }

    if (!messageText) {
      return NextResponse.json({ error: 'Missing message text' }, { status: 400 });
    }

    globalThis.agentActiveSessions[cleanPhone] = true;

    // Send using robust delivery function
    const result = await sendWAText(cleanPhone, messageText);
    saveMessageToStore(cleanPhone, messageText, 'agent');

    if (result.success) {
      return NextResponse.json({ success: true, isAgentActive: true, data: result.data, isTemplateFallback: result.isTemplateFallback });
    } else {
      return NextResponse.json({ success: false, error: result.error, data: result.data }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
