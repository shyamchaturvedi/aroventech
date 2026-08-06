import { NextResponse } from 'next/server';
import { saveMessageToStore } from '../chats/route';

const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';

function normalizePhone(p) {
  let clean = (p || '').replace(/\D/g, '');
  if (clean.length === 10) clean = '91' + clean;
  return clean;
}

async function sendWAText(phone, text) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: 'text',
        text: { preview_url: false, body: text },
      }),
    });
    const data = await r.json();
    return { phone, success: r.ok, data };
  } catch (e) {
    return { phone, success: false, error: e.message };
  }
}

// POST: Handle campaign blasts, invoice logging, udhaar reminders
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ─── 1. CAMPAIGN BLAST ───────────────────────────────────────────────────
    if (action === 'campaign_blast') {
      const { phones = [], message, campaignName = 'Campaign' } = body;
      if (!phones.length || !message) {
        return NextResponse.json({ error: 'phones array and message required' }, { status: 400 });
      }

      const results = [];
      for (const rawPhone of phones) {
        const phone = normalizePhone(rawPhone);
        if (!phone || phone.length < 10) {
          results.push({ phone: rawPhone, success: false, error: 'Invalid number' });
          continue;
        }
        const result = await sendWAText(phone, message);
        // Log to CRM chat store
        saveMessageToStore(phone, `📢 [${campaignName}] ${message}`, 'agent');
        results.push(result);
        // Throttle: 200ms between messages to avoid Meta rate limits
        await new Promise(r => setTimeout(r, 200));
      }

      const sent = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      return NextResponse.json({ success: true, sent, failed, results });
    }

    // ─── 2. LOG INVOICE (from Flutter App → CRM) ─────────────────────────────
    if (action === 'log_invoice') {
      const { phone, invoiceNo, amount, shopName, customerName, items = [], whatsappText } = body;
      if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });

      const cleanPhone = normalizePhone(phone);
      const displayText = whatsappText || buildInvoiceText(invoiceNo, amount, shopName, customerName, items);

      // Save to CRM chat store so it appears in WhatsApp CRM panel
      saveMessageToStore(cleanPhone, displayText, 'agent');

      // Send actual WhatsApp message
      const result = await sendWAText(cleanPhone, displayText);
      return NextResponse.json({ success: true, phone: cleanPhone, whatsappResult: result });
    }

    // ─── 3. LOG UDHAAR REMINDER (from Flutter App → CRM) ────────────────────
    if (action === 'log_udhaar_reminder') {
      const { phone, customerName, balance, upiId, shopName, whatsappText } = body;
      if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });

      const cleanPhone = normalizePhone(phone);
      const displayText = whatsappText || buildUdhaarText(customerName, balance, upiId, shopName);

      // Save to CRM chat store
      saveMessageToStore(cleanPhone, displayText, 'agent');

      // Send actual WhatsApp reminder
      const result = await sendWAText(cleanPhone, displayText);
      return NextResponse.json({ success: true, phone: cleanPhone, whatsappResult: result });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Broadcast API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Returns broadcast stats for CRM dashboard
export async function GET() {
  const store = globalThis.whatsappChatStore || {};
  let invoiceCount = 0;
  let reminderCount = 0;
  let campaignCount = 0;

  Object.values(store).forEach(msgs => {
    msgs.forEach(m => {
      if (m.text && m.text.includes('🧾')) invoiceCount++;
      if (m.text && m.text.includes('🔔 Udhaar')) reminderCount++;
      if (m.text && m.text.includes('📢')) campaignCount++;
    });
  });

  return NextResponse.json({ success: true, stats: { invoiceCount, reminderCount, campaignCount } });
}

// ─── Template Builders ────────────────────────────────────────────────────────
function buildInvoiceText(invoiceNo, amount, shopName, customerName, items) {
  const itemLines = (items || []).map(it => `  • ${it.name}: ₹${it.price}`).join('\n');
  return `🧾 *${shopName || 'MeriShop'} — GST Invoice*
━━━━━━━━━━━━━━━━━━━━
📋 Invoice No: *${invoiceNo || 'N/A'}*
👤 Customer: ${customerName || 'Valued Customer'}
━━━━━━━━━━━━━━━━━━━━
${itemLines || '  (Items listed on paper receipt)'}
━━━━━━━━━━━━━━━━━━━━
💰 *Total Amount: ₹${amount || '0'}*

🙏 Thank you for your purchase!
Powered by *MeriShop POS* 🛒`;
}

function buildUdhaarText(customerName, balance, upiId, shopName) {
  const upiLine = upiId ? `\n💳 UPI Pay: *${upiId}*` : '';
  return `🔔 *Udhaar Reminder — ${shopName || 'MeriShop'}*
━━━━━━━━━━━━━━━━━━━━
Namaste ${customerName || 'ji'}! 🙏

Aapka hamare yahan pending balance hai:
💰 *Baki Rakam: ₹${balance || '0'}*
${upiLine}

Kripya jaldi payment karein.
Dhanyawad! 🙏

_Powered by MeriShop Udhaar Khata_`;
}
