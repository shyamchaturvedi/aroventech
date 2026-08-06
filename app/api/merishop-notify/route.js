import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { saveMessageToStore, normalizePhone } from '../whatsapp-webhook/chats/route';

// ─── Constants ────────────────────────────────────────────────────────────────
const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';
const BASE_URL = 'https://www.aroventech.site';

const supabase = createClient(
  'https://zmrxufpijlvwjazhtpyl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw'
);

// ─── Core WhatsApp Sender ─────────────────────────────────────────────────────
async function sendWAText(phone, text) {
  try {
    const r = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
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
        text: { preview_url: true, body: text },
      }),
    });
    const data = await r.json();
    return { success: r.ok, status: r.status, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ─── Log to Supabase shop_notifications table ─────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE BUILDERS — Branded per shop
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN API HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * MeriShop Notify API — Multi-Shop WhatsApp Notification Engine
 * 
 * Flutter App → POST /api/merishop-notify
 * 
 * Required fields (always):
 *   - action: 'send_bill' | 'send_udhaar_reminder' | 'send_shop_link' | 'send_offer'
 *   - shopId: e.g. 'MSCHAUBEYSHOP01'
 *   - shopName: e.g. 'Chaubey General Store'
 *   - customerPhone: 10-digit number
 * 
 * Optional (per action):
 *   - shopUpiId: for payment in bill/udhaar
 *   - customerName: personalized greeting
 *   - billNo, amount, items, gstAmount, discount, paymentMode (for bill)
 *   - balance, daysOverdue (for udhaar)
 *   - customMessage (for shop_link)
 *   - offerTitle, offerDetails, discountPercent, validTill (for offer)
 */
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

    // ── Validation ──────────────────────────────────────────────────────────
    if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });
    if (!shopId) return NextResponse.json({ error: 'shopId is required' }, { status: 400 });
    if (!shopName) return NextResponse.json({ error: 'shopName is required' }, { status: 400 });
    if (!customerPhone) return NextResponse.json({ error: 'customerPhone is required' }, { status: 400 });

    const cleanPhone = normalizePhone(customerPhone);
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Invalid customerPhone' }, { status: 400 });
    }

    let messageText = '';

    // ── 1. SEND BILL / GST INVOICE ──────────────────────────────────────────
    if (action === 'send_bill') {
      const { billNo, amount, items, gstAmount, discount, paymentMode } = body;
      if (!amount) return NextResponse.json({ error: 'amount required for send_bill' }, { status: 400 });

      messageText = buildBillMessage({
        shopName, shopId, customerName, billNo,
        items: items || [], amount, gstAmount, discount,
        paymentMode, upiId: shopUpiId,
      });
    }

    // ── 2. SEND UDHAAR / PAYMENT REMINDER ──────────────────────────────────
    else if (action === 'send_udhaar_reminder') {
      const { balance, daysOverdue } = body;
      if (!balance) return NextResponse.json({ error: 'balance required for send_udhaar_reminder' }, { status: 400 });

      messageText = buildUdhaarReminderMessage({
        shopName, shopId, customerName, balance,
        daysOverdue, upiId: shopUpiId,
      });
    }

    // ── 3. SEND SHOP ONLINE LINK ────────────────────────────────────────────
    else if (action === 'send_shop_link') {
      const { customMessage } = body;
      messageText = buildShopLinkMessage({ shopName, shopId, customerName, customMessage });
    }

    // ── 4. SEND OFFER / PROMOTION ───────────────────────────────────────────
    else if (action === 'send_offer') {
      const { offerTitle, offerDetails, discountPercent, validTill } = body;
      messageText = buildOfferMessage({
        shopName, shopId, customerName,
        offerTitle, offerDetails, discountPercent, validTill,
      });
    }

    else {
      return NextResponse.json({
        error: 'Unknown action. Use: send_bill | send_udhaar_reminder | send_shop_link | send_offer'
      }, { status: 400 });
    }

    // ── Send WhatsApp Message ───────────────────────────────────────────────
    const waResult = await sendWAText(cleanPhone, messageText);

    // ── Save to CRM Chat Store (shows in admin dashboard) ──────────────────
    saveMessageToStore(cleanPhone, messageText, 'agent');

    // ── Log to Supabase for analytics ──────────────────────────────────────
    await logToSupabase(shopId, cleanPhone, action, messageText, { shopName, customerName, shopUpiId });

    console.log(`✅ [${shopId}] ${action} → +${cleanPhone} | WA: ${waResult.success}`);

    return NextResponse.json({
      success: true,
      action,
      shopId,
      customerPhone: cleanPhone,
      whatsappSent: waResult.success,
      waStatus: waResult.status,
      preview: messageText.substring(0, 100) + '...',
    });

  } catch (err) {
    console.error('MeriShop Notify API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── GET: API health check + integration guide ─────────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: '✅ MeriShop Notify API - Active',
    version: '2.0',
    description: 'Multi-shop WhatsApp notification engine for 50+ MeriShop shopkeepers',
    endpoint: 'POST /api/merishop-notify',
    actions: {
      send_bill: {
        description: 'Send GST/Non-GST bill receipt to customer via WhatsApp',
        required: ['shopId', 'shopName', 'customerPhone', 'amount'],
        optional: ['shopUpiId', 'customerName', 'billNo', 'items', 'gstAmount', 'discount', 'paymentMode'],
      },
      send_udhaar_reminder: {
        description: 'Send udhaar/pending payment reminder to customer',
        required: ['shopId', 'shopName', 'customerPhone', 'balance'],
        optional: ['shopUpiId', 'customerName', 'daysOverdue'],
      },
      send_shop_link: {
        description: 'Send shop online store link to customer',
        required: ['shopId', 'shopName', 'customerPhone'],
        optional: ['customerName', 'customMessage'],
      },
      send_offer: {
        description: 'Send promotional offer/discount to customer',
        required: ['shopId', 'shopName', 'customerPhone'],
        optional: ['customerName', 'offerTitle', 'offerDetails', 'discountPercent', 'validTill'],
      },
    },
    example_bill: {
      action: 'send_bill',
      shopId: 'MSCHAUBEYSHOP01',
      shopName: 'Chaubey General Store',
      shopUpiId: 'chaubey@upi',
      customerPhone: '9876543210',
      customerName: 'Ramesh Kumar',
      billNo: 'MS2024001',
      amount: '485',
      gstAmount: '23',
      paymentMode: 'Cash',
      items: [
        { name: 'Fortune Oil 1L', qty: 1, price: 145 },
        { name: 'Aashirvaad Atta 5kg', qty: 1, price: 235 },
        { name: 'Madhur Sugar 1kg', qty: 2, price: 105 },
      ],
    },
    example_udhaar: {
      action: 'send_udhaar_reminder',
      shopId: 'MSCHAUBEYSHOP01',
      shopName: 'Chaubey General Store',
      shopUpiId: 'chaubey@upi',
      customerPhone: '9876543210',
      customerName: 'Ramesh Kumar',
      balance: '750',
      daysOverdue: 7,
    },
    example_shop_link: {
      action: 'send_shop_link',
      shopId: 'MSCHAUBEYSHOP01',
      shopName: 'Chaubey General Store',
      customerPhone: '9876543210',
      customerName: 'Ramesh Kumar',
    },
    shop_link_format: `${BASE_URL}/merishop/{shopId}`,
  });
}
