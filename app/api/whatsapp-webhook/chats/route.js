import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';

// Initialize Supabase Client
const supabaseUrl = 'https://zmrxufpijlvwjazhtpyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Clean Global Chat Store & Deduplication Set
globalThis.whatsappChatStore = globalThis.whatsappChatStore || {};
globalThis.agentActiveSessions = globalThis.agentActiveSessions || {};
globalThis.processedMessageIds = globalThis.processedMessageIds || new Set();

export function saveMessageToStore(fromPhone, text, sender = 'customer', msgId = null) {
  if (msgId && globalThis.processedMessageIds.has(msgId)) {
    console.log(`⚠️ Duplicate WhatsApp message ID ${msgId} skipped.`);
    return;
  }
  if (msgId) {
    globalThis.processedMessageIds.add(msgId);
  }

  const cleanPhone = fromPhone.replaceAll(/[^\d]/g, '');
  if (!globalThis.whatsappChatStore[cleanPhone]) {
    globalThis.whatsappChatStore[cleanPhone] = [];
  }

  // Deduplicate consecutive identical messages within 3 seconds
  const existing = globalThis.whatsappChatStore[cleanPhone];
  if (existing.length > 0) {
    const lastMsg = existing[existing.length - 1];
    if (lastMsg.text.trim() === text.trim() && lastMsg.sender === sender && (Date.now() - lastMsg.timestamp < 3000)) {
      console.log(`⚠️ Rapid duplicate message "${text}" ignored.`);
      return;
    }
  }

  globalThis.whatsappChatStore[cleanPhone].push({
    id: msgId || (Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4)),
    text,
    sender, // 'customer', 'ai', 'agent'
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
  });

  try {
    supabase.from('whatsapp_logs').insert([
      { phone: cleanPhone, text, sender, created_at: new Date().toISOString() }
    ]).then(() => {}).catch(() => {});
  } catch (_) {}
}

export function isAgentSessionActive(phone) {
  const cleanPhone = phone.replaceAll(/[^\d]/g, '');
  return !!globalThis.agentActiveSessions[cleanPhone];
}

export function setAgentSessionActive(phone, isActive) {
  const cleanPhone = phone.replaceAll(/[^\d]/g, '');
  globalThis.agentActiveSessions[cleanPhone] = isActive;
}

// 1. GET: Fetch all active customer conversations & session states
export async function GET() {
  const chats = Object.entries(globalThis.whatsappChatStore).map(([phone, messages]) => ({
    phone,
    lastMessage: messages.length > 0 ? messages[messages.length - 1].text : '',
    lastTime: messages.length > 0 ? messages[messages.length - 1].time : '',
    messages,
    isAgentActive: !!globalThis.agentActiveSessions[phone],
  }));

  chats.sort((a, b) => {
    const lastA = a.messages.length > 0 ? a.messages[a.messages.length - 1].timestamp : 0;
    const lastB = b.messages.length > 0 ? b.messages[b.messages.length - 1].timestamp : 0;
    return lastB - lastA;
  });

  return NextResponse.json({ success: true, chats });
}

// 2. POST: Admin sends a direct manual reply / logs external messages
export async function POST(request) {
  try {
    const body = await request.json();
    const { recipientPhone, messageText, action, sender } = body;

    if (!recipientPhone) {
      return NextResponse.json({ error: 'Missing recipient phone' }, { status: 400 });
    }

    let cleanPhone = recipientPhone.replaceAll(/[^\d]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    // Direct Logging Hook for Messages sent by App (Invoices, Reminders, Offers)
    if (action === 'log_external_message' && messageText) {
      saveMessageToStore(cleanPhone, messageText, sender || 'agent');
      return NextResponse.json({ success: true });
    }

    // Toggle Session State
    if (action === 'toggle_session') {
      const currentState = !!globalThis.agentActiveSessions[cleanPhone];
      globalThis.agentActiveSessions[cleanPhone] = !currentState;
      return NextResponse.json({ success: true, isAgentActive: !currentState });
    }

    if (action === 'create_chat') {
      saveMessageToStore(cleanPhone, 'New chat initialized by Admin', 'agent');
      return NextResponse.json({ success: true });
    }

    if (!messageText) {
      return NextResponse.json({ error: 'Missing message text' }, { status: 400 });
    }

    // When Admin sends a manual message, automatically activate Live Agent Mode (Pause AI)
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
        text: {
          preview_url: true,
          body: messageText,
        },
      }),
    });

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      saveMessageToStore(cleanPhone, messageText, 'agent');
      return NextResponse.json({ success: true, isAgentActive: true, data });
    } else {
      saveMessageToStore(cleanPhone, messageText, 'agent');
      return NextResponse.json({ success: true, isAgentActive: true, warning: 'Sent locally', data });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
