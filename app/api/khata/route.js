import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zmrxufpijlvwjazhtpyl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcnh1ZnBpamx2d2phemh0cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzI2NTQsImV4cCI6MjA3NzE0ODY1NH0.zJzb2ZD9V2Qj4uHvNazCLQZDH8z5DdkzO0lI19bbmtw'
);

const WHATSAPP_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';

function normalizePhone(p) {
  let c = (p || '').replace(/\D/g, '');
  if (c.length === 10) c = '91' + c;
  return c;
}

async function sendWA(phone, text) {
  try {
    const r = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp', recipient_type: 'individual',
        to: phone, type: 'text', text: { preview_url: false, body: text },
      }),
    });
    return r.ok;
  } catch { return false; }
}

// ─── GET: Fetch customers or entries ──────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId') || 'DEFAULT';
  const customerId = searchParams.get('customerId');

  if (customerId) {
    // Get entries for a specific customer
    const { data: entries } = await supabase
      .from('khata_entries')
      .select('*')
      .eq('customer_id', customerId)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: true });

    return NextResponse.json({ success: true, entries: entries || [] });
  }

  // Get all customers with their balance summary
  const { data: customers } = await supabase
    .from('khata_customers')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (!customers?.length) return NextResponse.json({ success: true, customers: [] });

  // Calculate balance for each customer
  const { data: allEntries } = await supabase
    .from('khata_entries')
    .select('customer_id, type, amount')
    .eq('shop_id', shopId);

  const balanceMap = {};
  (allEntries || []).forEach(e => {
    if (!balanceMap[e.customer_id]) balanceMap[e.customer_id] = 0;
    if (e.type === 'credit') balanceMap[e.customer_id] += Number(e.amount);
    if (e.type === 'payment') balanceMap[e.customer_id] -= Number(e.amount);
  });

  const enriched = customers.map(c => ({
    ...c,
    balance: balanceMap[c.id] || 0,
  }));

  return NextResponse.json({ success: true, customers: enriched });
}

// ─── POST: Handle all khata actions ───────────────────────────────────────────
export async function POST(request) {
  const body = await request.json();
  const { action, shopId = 'DEFAULT', shopName = 'MeriShop', shopUpiId } = body;

  // ── 1. ADD CUSTOMER ────────────────────────────────────────────────────────
  if (action === 'add_customer') {
    const { name, phone } = body;
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

    const cleanPhone = phone ? normalizePhone(phone) : null;

    // Check duplicate
    if (cleanPhone) {
      const { data: existing } = await supabase
        .from('khata_customers')
        .select('id')
        .eq('shop_id', shopId)
        .eq('phone', cleanPhone)
        .single();
      if (existing) return NextResponse.json({ error: 'Customer with this number already exists', existing }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('khata_customers')
      .insert([{ shop_id: shopId, name, phone: cleanPhone, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, customer: data });
  }

  // ── 2. ADD ENTRY (credit / payment) ────────────────────────────────────────
  if (action === 'add_entry') {
    const { customerId, type, amount, note } = body;
    if (!customerId || !type || !amount) {
      return NextResponse.json({ error: 'customerId, type, amount required' }, { status: 400 });
    }
    if (!['credit', 'payment'].includes(type)) {
      return NextResponse.json({ error: 'type must be credit or payment' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('khata_entries')
      .insert([{
        customer_id: customerId,
        shop_id: shopId,
        type,
        amount: Number(amount),
        note: note || '',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, entry: data });
  }

  // ── 3. DELETE ENTRY ─────────────────────────────────────────────────────────
  if (action === 'delete_entry') {
    const { entryId } = body;
    await supabase.from('khata_entries').delete().eq('id', entryId).eq('shop_id', shopId);
    return NextResponse.json({ success: true });
  }

  // ── 4. DELETE CUSTOMER ──────────────────────────────────────────────────────
  if (action === 'delete_customer') {
    const { customerId } = body;
    await supabase.from('khata_entries').delete().eq('customer_id', customerId).eq('shop_id', shopId);
    await supabase.from('khata_customers').delete().eq('id', customerId).eq('shop_id', shopId);
    return NextResponse.json({ success: true });
  }

  // ── 5. SEND WHATSAPP REMINDER ───────────────────────────────────────────────
  if (action === 'send_reminder') {
    const { customerId, customerName, customerPhone, balance } = body;
    if (!customerPhone) return NextResponse.json({ error: 'customerPhone required' }, { status: 400 });

    const cleanPhone = normalizePhone(customerPhone);
    const upiLine = shopUpiId ? `\n\n💸 *UPI Pay:* \`${shopUpiId}\`\nGoogle Pay / PhonePe / Paytm par bhi bhej sakte hain` : '';

    const message = `🔔 *Udhaar Reminder*
━━━━━━━━━━━━━━━━━━━━
🏪 *${shopName}*

Namaste *${customerName || 'ji'}*! 🙏

Aapka hamare yahan pending balance hai:
💰 *Baki Rakam: ₹${Math.abs(balance)}*${upiLine}
━━━━━━━━━━━━━━━━━━━━
Kripya jaldi payment karein.
_${shopName} — Khata Book_

Dhanyawad! 🙏`;

    const sent = await sendWA(cleanPhone, message);

    // Also save reminder log to whatsapp_logs
    try {
      await supabase.from('whatsapp_logs').insert([{
        phone: cleanPhone, text: message, sender: 'agent',
        created_at: new Date().toISOString(),
      }]);
      await supabase.from('khata_entries').insert([{
        customer_id: customerId,
        shop_id: shopId,
        type: 'reminder',
        amount: 0,
        note: `📱 WhatsApp reminder sent — balance ₹${Math.abs(balance)}`,
        created_at: new Date().toISOString(),
      }]);
    } catch (_) {}

    return NextResponse.json({ success: true, whatsappSent: sent });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
