import { NextResponse } from 'next/server';
import { saveMessageToStore, normalizePhone } from '../chats/route';

const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';

// ─── Send a single WhatsApp text message ─────────────────────────────────────
async function sendWAText(phone, text) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: 'text',
        text: { preview_url: false, body: text },
      }),
    });
    const data = await r.json();
    return { phone, success: r.ok, status: r.status, data };
  } catch (e) {
    return { phone, success: false, error: e.message };
  }
}

// ─── Parse phone numbers from any string (handles spaces, commas, newlines) ──
function parsePhoneList(raw = '') {
  // Split by comma, semicolon, newline, tab, or whitespace-between-numbers
  return raw
    .split(/[\n\r,;|\t]+/)
    .flatMap(line => line.split(/\s+/)) // also split by spaces within lines
    .map(p => p.replace(/\D/g, '').trim())
    .filter(p => p.length >= 10)
    .map(p => normalizePhone(p));
}

// ─── POST: Handle all broadcast/send actions ──────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ─── 1. SEND SINGLE SMS (to one specific number) ──────────────────────────
    if (action === 'send_single') {
      const { phone, message, senderLabel = 'Agent' } = body;
      if (!phone || !message) {
        return NextResponse.json({ error: 'phone and message required' }, { status: 400 });
      }
      const cleanPhone = normalizePhone(phone);
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
      }

      const result = await sendWAText(cleanPhone, message.trim());
      // ✅ Save to CRM chat store & Supabase (persistent)
      saveMessageToStore(cleanPhone, message.trim(), 'agent');

      return NextResponse.json({
        success: true,
        phone: cleanPhone,
        whatsappSent: result.success,
        result,
      });
    }

    // ─── 2. CAMPAIGN BLAST (bulk to multiple numbers) ─────────────────────────
    if (action === 'campaign_blast') {
      const { phones = [], phonesRaw = '', message, campaignName = 'Campaign' } = body;

      // Support both array input and raw string input
      const phoneList = phones.length > 0
        ? phones.map(p => normalizePhone(p)).filter(p => p.length >= 10)
        : parsePhoneList(phonesRaw);

      if (!phoneList.length || !message) {
        return NextResponse.json({ error: 'phones and message required' }, { status: 400 });
      }

      const results = [];
      for (const phone of phoneList) {
        const result = await sendWAText(phone, message.trim());
        // ✅ Save every sent campaign message to CRM & Supabase
        saveMessageToStore(phone, `📢 [${campaignName}] ${message.trim()}`, 'agent');
        results.push(result);
        // 200ms throttle to avoid Meta rate limits
        await new Promise(r => setTimeout(r, 200));
      }

      const sent = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      return NextResponse.json({ success: true, sent, failed, total: phoneList.length, results });
    }

    // ─── 3. LOG INVOICE (from Flutter App) ───────────────────────────────────
    if (action === 'log_invoice') {
      const { phone, invoiceNo, amount, shopName, customerName, items = [], whatsappText } = body;
      if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });

      const cleanPhone = normalizePhone(phone);
      const text = whatsappText || buildInvoiceText(invoiceNo, amount, shopName, customerName, items);
      saveMessageToStore(cleanPhone, text, 'agent');
      const result = await sendWAText(cleanPhone, text);
      return NextResponse.json({ success: true, phone: cleanPhone, whatsappResult: result });
    }

    // ─── 4. LOG UDHAAR REMINDER (from Flutter App) ────────────────────────────
    if (action === 'log_udhaar_reminder') {
      const { phone, customerName, balance, upiId, shopName, whatsappText } = body;
      if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });

      const cleanPhone = normalizePhone(phone);
      const text = whatsappText || buildUdhaarText(customerName, balance, upiId, shopName);
      saveMessageToStore(cleanPhone, text, 'agent');
      const result = await sendWAText(cleanPhone, text);
      return NextResponse.json({ success: true, phone: cleanPhone, whatsappResult: result });
    }

    return NextResponse.json({ error: 'Unknown action. Use: send_single, campaign_blast, log_invoice, log_udhaar_reminder' }, { status: 400 });
  } catch (err) {
    console.error('Broadcast API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── GET: Broadcast stats ──────────────────────────────────────────────────────
export async function GET() {
  const store = globalThis.whatsappChatStore || {};
  let invoiceCount = 0, reminderCount = 0, campaignCount = 0, singleSentCount = 0;

  Object.values(store).forEach(msgs => {
    msgs.forEach(m => {
      if (m.text?.includes('🧾')) invoiceCount++;
      if (m.text?.includes('🔔 Udhaar') || m.text?.includes('baki rakam')) reminderCount++;
      if (m.text?.includes('📢')) campaignCount++;
      if (m.sender === 'agent' && !m.text?.includes('📢') && !m.text?.includes('🧾')) singleSentCount++;
    });
  });

  return NextResponse.json({ success: true, stats: { invoiceCount, reminderCount, campaignCount, singleSentCount } });
}

// ─── Template Builders ─────────────────────────────────────────────────────────
function buildInvoiceText(invoiceNo, amount, shopName, customerName, items) {
  const itemLines = (items || []).map(it => `  • ${it.name}: ₹${it.price}`).join('\n');
  return `🧾 *${shopName || 'MeriShop'} — GST Invoice*
━━━━━━━━━━━━━━━━━━━━
📋 Invoice No: *${invoiceNo || 'N/A'}*
👤 Customer: ${customerName || 'Valued Customer'}
━━━━━━━━━━━━━━━━━━━━
${itemLines || '  (Items on printed receipt)'}
━━━━━━━━━━━━━━━━━━━━
💰 *Total: ₹${amount || '0'}*

🙏 Thank you! — Powered by *MeriShop POS*`;
}

function buildUdhaarText(customerName, balance, upiId, shopName) {
  const upiLine = upiId ? `\n💳 UPI Pay: *${upiId}*` : '';
  return `🔔 *Udhaar Reminder — ${shopName || 'MeriShop'}*
━━━━━━━━━━━━━━━━━━━━
Namaste ${customerName || 'ji'}! 🙏

Aapka pending balance:
💰 *Baki Rakam: ₹${balance || '0'}*${upiLine}

Kripya jaldi payment karein. Dhanyawad! 🙏
_Powered by MeriShop Udhaar Khata_`;
}
