import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { saveMessageToStore, normalizePhone, sendWAText } from '../whatsapp-webhook/chats/route';

const BASE_URL = 'https://www.aroventech.site';

const supabase = createClient(
  'https://zmrxufpijlvwjazhtpyl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw'
);

async function logToSupabase(shopId, customerPhone, action, messageText, extra = {}) {
  try {
    await supabase.from('shop_notifications').insert([{
      shop_id: shopId,
      customer_phone: customerPhone,
      action,
      message: messageText,
      extra_data: JSON.stringify(extra),
      created_at: new Date().toISOString(),
    }]);
  } catch (_) {}
}

function buildBillMessage({ shopName, shopId, customerName, billNo, items = [], amount, gstAmount, discount, paymentMode, upiId }) {
  const shopLink = `${BASE_URL}/merishop/${shopId}`;
  const itemLines = items.length > 0
    ? items.map(it => `   • ${it.name}${it.qty ? ` ×${it.qty}` : ''} — ₹${it.price}`).join('\n')
    : '   (See printed receipt for details)';

  const gstLine = gstAmount ? `\n💹 GST/Tax: ₹${gstAmount}` : '';
  const discountLine = discount ? `\n🏷️ Discount: -₹${discount}` : '';
  const payLine = paymentMode ? `\n💳 Payment: ${paymentMode}` : '';
  const upiLine = upiId ? `\n\n💸 *Pay via UPI:*\n📲 UPI ID: \`${upiId}\`` : '';

  return `🧾 *${shopName}*
━━━━━━━━━━━━━━━━━━━━━━━━
✅ *Purchase Confirmed!*

👤 Customer: ${customerName || 'Valued Customer'}
📋 Bill No: *${billNo || 'N/A'}*
🗓️ Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
━━━━━━━━━━━━━━━━━━━━━━━━
🛒 *Items Purchased:*
${itemLines}
━━━━━━━━━━━━━━━━━━━━━━━━${gstLine}${discountLine}
💰 *Total: ₹${amount}*${payLine}${upiLine}
━━━━━━━━━━━━━━━━━━━━━━━━
🌐 *Shop Online Anytime:*
👉 ${shopLink}

🙏 Thank you for shopping with us!
_${shopName} — Powered by MeriShop POS_`;
}

function buildUdhaarReminderMessage({ shopName, shopId, customerName, balance, daysOverdue, upiId }) {
  const shopLink = `${BASE_URL}/merishop/${shopId}`;
  const daysLine = daysOverdue ? ` (${daysOverdue} days)` : '';
  const upiLine = upiId
    ? `\n\n💸 *Pay Instantly via UPI:*\n📲 UPI ID: \`${upiId}\`\nया Google Pay / PhonePe par UPI ID type karein`
    : '';

  return `🔔 *Payment Reminder*
━━━━━━━━━━━━━━━━━━━━━━━━
🏪 *${shopName}*

Namaste ${customerName || 'ji'}! 🙏

Aapka hamare yahan ek pending balance hai:
💰 *Baki Rakam: ₹${balance}*${daysLine}
━━━━━━━━━━━━━━━━━━━━━━━━${upiLine}
━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Online shopping ke liye:
👉 ${shopLink}

Kripya jaldi payment karein.
Dhanyawad! 🙏

_${shopName} — MeriShop Udhaar Khata_`;
}

function buildShopLinkMessage({ shopName, shopId, customerName, customMessage }) {
  const shopLink = `${BASE_URL}/merishop/${shopId}`;
  const greeting = customMessage || `Namaste ${customerName || 'ji'}! 🙏\n\nHamari *${shopName}* ki online shop visit karein — ghar baithe order karein!`;

  return `🛒 *${shopName} — Online Store*
━━━━━━━━━━━━━━━━━━━━━━━━
${greeting}

👉 *Shop Now:* ${shopLink}
━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ Latest products, offers, aur deals yahan dekhein!
📦 Easy online ordering
💰 Best prices guaranteed

_${shopName} — Powered by MeriShop_`;
}

function buildOfferMessage({ shopName, shopId, offerTitle, offerDetails, discountPercent, validTill, customerName }) {
  const shopLink = `${BASE_URL}/merishop/${shopId}`;
  const validLine = validTill ? `\n⏳ Valid Till: *${validTill}*` : '';
  const discLine = discountPercent ? `\n🔥 Discount: *${discountPercent}% OFF*` : '';

  return `🎉 *Special Offer — ${shopName}*
━━━━━━━━━━━━━━━━━━━━━━━━
Namaste ${customerName || 'ji'}! 🙏

🏷️ *${offerTitle || 'Exclusive Offer for You!'}*
${offerDetails || ''}${discLine}${validLine}
━━━━━━━━━━━━━━━━━━━━━━━━
🛒 Abhi order karein:
👉 ${shopLink}

_${shopName} — MeriShop Digital Store_`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      action,
      shopId,
      shopName,
      shopUpiId,
      customerPhone,
      customerName,
    } = body;

    if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });
    if (!shopId) return NextResponse.json({ error: 'shopId is required' }, { status: 400 });
    if (!shopName) return NextResponse.json({ error: 'shopName is required' }, { status: 400 });
    if (!customerPhone) return NextResponse.json({ error: 'customerPhone is required' }, { status: 400 });

    const cleanPhone = normalizePhone(customerPhone);
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Invalid customerPhone' }, { status: 400 });
    }

    let messageText = '';

    if (action === 'send_bill') {
      const { billNo, amount, items, gstAmount, discount, paymentMode } = body;
      if (!amount) return NextResponse.json({ error: 'amount required for send_bill' }, { status: 400 });

      messageText = buildBillMessage({
        shopName, shopId, customerName, billNo,
        items: items || [], amount, gstAmount, discount,
        paymentMode, upiId: shopUpiId,
      });
    }
    else if (action === 'send_udhaar_reminder') {
      const { balance, daysOverdue } = body;
      if (!balance) return NextResponse.json({ error: 'balance required for send_udhaar_reminder' }, { status: 400 });

      messageText = buildUdhaarReminderMessage({
        shopName, shopId, customerName, balance,
        daysOverdue, upiId: shopUpiId,
      });
    }
    else if (action === 'send_shop_link') {
      const { customMessage } = body;
      messageText = buildShopLinkMessage({ shopName, shopId, customerName, customMessage });
    }
    else if (action === 'send_offer') {
      const { offerTitle, offerDetails, discountPercent, validTill } = body;
      messageText = buildOfferMessage({
        shopName, shopId, customerName,
        offerTitle, offerDetails, discountPercent, validTill,
      });
    }
    else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const waResult = await sendWAText(cleanPhone, messageText);
    saveMessageToStore(cleanPhone, messageText, 'agent');
    await logToSupabase(shopId, cleanPhone, action, messageText, { shopName, customerName, shopUpiId });

    if (!waResult.success) {
      return NextResponse.json({
        success: false,
        action,
        shopId,
        customerPhone: cleanPhone,
        whatsappSent: false,
        error: waResult.error,
        waResult,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action,
      shopId,
      customerPhone: cleanPhone,
      whatsappSent: true,
      isTemplateFallback: waResult.isTemplateFallback,
      preview: messageText.substring(0, 100) + '...',
    });

  } catch (err) {
    console.error('MeriShop Notify API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: '✅ MeriShop Notify API - Active',
    version: '2.0',
    endpoint: 'POST /api/merishop-notify',
  });
}
