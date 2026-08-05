import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';

// Initialize Supabase Client
const supabaseUrl = 'https://zmrxufpijlvwjazhtpyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Global In-Memory Chat Store (phone -> array of messages)
globalThis.whatsappChatStore = globalThis.whatsappChatStore || {
  '919598023701': [
    {
      id: 'init_1',
      text: 'Namaste! MeriShop App se judi support lene ke liye dhanyawad. Main Rohit hoon, aapka Dedicated Support Executive.',
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 60000,
    },
    {
      id: 'init_2',
      text: 'Hi! Mujhe thermal printer connect karne me help chahiye.',
      sender: 'customer',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 30000,
    }
  ]
};

export function saveMessageToStore(fromPhone, text, sender = 'customer') {
  const cleanPhone = fromPhone.replaceAll(/[^\d]/g, '');
  if (!globalThis.whatsappChatStore[cleanPhone]) {
    globalThis.whatsappChatStore[cleanPhone] = [];
  }
  globalThis.whatsappChatStore[cleanPhone].push({
    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4),
    text,
    sender, // 'customer', 'ai', 'agent'
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
  });

  // Asynchronously log to Supabase in background
  try {
    supabase.from('whatsapp_logs').insert([
      { phone: cleanPhone, text, sender, created_at: new Date().toISOString() }
    ]).then(() => {}).catch(() => {});
  } catch (_) {}
}

// 1. GET: Fetch all active customer conversations
export async function GET() {
  const chats = Object.entries(globalThis.whatsappChatStore).map(([phone, messages]) => ({
    phone,
    lastMessage: messages.length > 0 ? messages[messages.length - 1].text : '',
    lastTime: messages.length > 0 ? messages[messages.length - 1].time : '',
    messages,
  }));

  chats.sort((a, b) => {
    const lastA = a.messages.length > 0 ? a.messages[a.messages.length - 1].timestamp : 0;
    const lastB = b.messages.length > 0 ? b.messages[b.messages.length - 1].timestamp : 0;
    return lastB - lastA;
  });

  return NextResponse.json({ success: true, chats });
}

// 2. POST: Admin sends a direct manual reply to a customer via Meta Cloud API
export async function POST(request) {
  try {
    const body = await request.json();
    const { recipientPhone, messageText, action } = body;

    if (action === 'create_chat' && recipientPhone) {
      saveMessageToStore(recipientPhone, 'New chat initialized by Admin', 'agent');
      return NextResponse.json({ success: true });
    }

    if (!recipientPhone || !messageText) {
      return NextResponse.json({ error: 'Missing phone or message text' }, { status: 400 });
    }

    let cleanPhone = recipientPhone.replaceAll(/[^\d]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

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
      return NextResponse.json({ success: true, data });
    } else {
      // Fallback save to chat store even if Meta sandbox mode restricts unapproved test number
      saveMessageToStore(cleanPhone, messageText, 'agent');
      return NextResponse.json({ success: true, warning: 'Sent locally / Meta API Sandbox', data });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
