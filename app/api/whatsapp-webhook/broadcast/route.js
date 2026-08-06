import { NextResponse } from 'next/server';
import { saveMessageToStore, normalizePhone, sendWAText } from '../chats/route';

// ─── Parse phone numbers from any string (handles spaces, commas, newlines) ──
function parsePhoneList(raw = '') {
  return raw
    .split(/[\n\r,;|\t]+/)
    .flatMap(line => line.split(/\s+/))
    .map(p => p.replace(/\D/g, '').trim())
    .filter(p => p.length >= 10)
    .map(p => normalizePhone(p));
}

// ─── POST: Handle broadcast & send actions ───────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ─── 1. SEND SINGLE SMS (to one specific number) ──────────────────────────
    if (action === 'send_single') {
      const { phone, message } = body;
      if (!phone || !message) {
        return NextResponse.json({ error: 'phone and message required' }, { status: 400 });
      }
      const cleanPhone = normalizePhone(phone);
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
      }

      const result = await sendWAText(cleanPhone, message.trim());
      saveMessageToStore(cleanPhone, message.trim(), 'agent');

      if (!result.success) {
        return NextResponse.json({
          success: false,
          phone: cleanPhone,
          whatsappSent: false,
          error: result.error,
          result,
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        phone: cleanPhone,
        whatsappSent: true,
        isTemplateFallback: result.isTemplateFallback,
        result,
      });
    }

    // ─── 2. CAMPAIGN BLAST (bulk to multiple numbers) ─────────────────────────
    if (action === 'campaign_blast') {
      const { phones = [], phonesRaw = '', message, campaignName = 'Campaign' } = body;

      const phoneList = phones.length > 0
        ? phones.map(p => normalizePhone(p)).filter(p => p.length >= 10)
        : parsePhoneList(phonesRaw);

      if (!phoneList.length || !message) {
        return NextResponse.json({ error: 'phones and message required' }, { status: 400 });
      }

      const results = [];
      for (const phone of phoneList) {
        const result = await sendWAText(phone, message.trim());
        saveMessageToStore(phone, `📢 [${campaignName}] ${message.trim()}`, 'agent');
        results.push(result);
        await new Promise(r => setTimeout(r, 200));
      }

      const sent = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      return NextResponse.json({ success: true, sent, failed, total: phoneList.length, results });
    }

    // ─── 3. LOG INVOICE ───────────────────────────────────────────────────────
    if (action === 'log_invoice') {
      const { phone, invoiceNo, amount, shopName, customerName, items = [], whatsappText } = body;
      if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });

      const cleanPhone = normalizePhone(phone);
      const text = whatsappText || buildInvoiceText(invoiceNo, amount, shopName, customerName, items);
      saveMessageToStore(cleanPhone, text, 'agent');
      const result = await sendWAText(cleanPhone, text);
      return NextResponse.json({ success: result.success, phone: cleanPhone, error: result.error, whatsappResult: result });
    }

    // ─── 4. LOG UDHAAR REMINDER ───────────────────────────────────────────────
    if (action === 'log_udhaar_reminder') {
      const { phone, customerName, balance, upiId, shopName, whatsappText } = body;
      if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });

      const cleanPhone = normalizePhone(phone);
      const text = whatsappText || buildUdhaarText(customerName, balance, upiId, shopName);
      saveMessageToStore(cleanPhone, text, 'agent');
      const result = await sendWAText(cleanPhone, text);
      return NextResponse.json({ success: result.success, phone: cleanPhone, error: result.error, whatsappResult: result });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Broadcast API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
