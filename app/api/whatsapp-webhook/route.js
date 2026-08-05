import { NextResponse } from 'next/server';

const VERIFY_TOKEN = 'merishop_webhook_token_2026';
const WHATSAPP_ACCESS_TOKEN = 'EAAYBubarxO0BSNjTrazmFZCcGyGiZCIBTiSr9UvV0zcZCZBFYZC3dZCKg86RgkpKzm8hhe8w1LMqYDsalIFe921XyPk7pYiOtodk65wrYvgFZAiTo5pZCfm5ygOpSBSfBssUBoo90SZBDyPrZAvpWS5HyiyToVzhyHOaD0n1ThuZCDwe1A3DF90c20YfF8E5uMqSwZDZD';
const PHONE_NUMBER_ID = '1222012837663635';

// 1. GET Method: Meta Webhook URL Verification
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Meta WhatsApp Webhook verified successfully!');
    return new Response(challenge, { status: 200 });
  } else {
    return new Response('Forbidden', { status: 403 });
  }
}

// 2. POST Method: Handles Incoming WhatsApp Messages & AI Auto-Replies 24/7
export async function POST(request) {
  try {
    const body = await request.json();

    // Check if Meta message event exists
    if (body.object && body.entry && body.entry[0]?.changes && body.entry[0]?.changes[0]?.value?.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const fromPhone = message.from; // Customer phone number (e.g. 919876543210)
      const messageType = message.type;
      
      let incomingText = '';
      if (messageType === 'text') {
        incomingText = message.text?.body || '';
      } else if (messageType === 'interactive') {
        incomingText = message.interactive?.button_reply?.title || message.interactive?.button_reply?.id || '';
      }

      console.log(`📩 Incoming WhatsApp Message from ${fromPhone}: "${incomingText}"`);

      // Generate AI Support Executive Response
      const responseText = generateAiSupportResponse(incomingText);

      // Send Instant WhatsApp Reply via Meta Cloud API REST
      await sendWhatsAppCloudMessage(fromPhone, responseText);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error processing WhatsApp Webhook:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}

// Helper: AI Support Executive (Rohit) Knowledge Engine with Interactive Button Handlers
function generateAiSupportResponse(text) {
  const q = (text || '').toLowerCase().trim();
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.aroventech.merishop';
  const storeUrl = 'https://www.aroventech.site/merishop/MSCHAUBEYSHOP01';

  // 1. BUTTON REPLY HANDLERS
  if (q.includes('coupon') || q.includes('get_offer') || q.includes('offer')) {
    return `🎁 *SPECIAL 10% OFF DISCOUNT COUPON* 🎉\n━━━━━━━━━━━━━━━━━━━\nAapke agle order ke liye Special Coupon Code:\n\n🔥 *SAVE10*\n\n🛒 Store URL par jayein aur checkout par *SAVE10* apply karein:\n${storeUrl}\n\nDhanyawad! 🙏`;
  }
  
  if (q.includes('order online') || q.includes('shop_online')) {
    return `🛒 *CHAUBEY SHOP ONLINE CATALOG*\n━━━━━━━━━━━━━━━━━━━\nGhar baithe saare items dekhein aur order karein:\n\n👉 ${storeUrl}\n\nDelivery Helpline: +91 82829 38658`;
  }

  if (q.includes('download app') || q.includes('download_app')) {
    return `📲 *MERISHOP POS APP DOWNLOAD*\n━━━━━━━━━━━━━━━━━━━\nAapki dukan ka digital register download karein:\n\n👉 ${playStoreUrl}\n\n100% Free & Offline Billing!`;
  }

  if (q.includes('pay') || q.includes('upi') || q.includes('pay_upi')) {
    return `💳 *ONLINE UPI PAYMENT*\n━━━━━━━━━━━━━━━━━━━\nAap Google Pay, PhonePe, ya Paytm se bhugtan kar sakte hain.\n\nHelpline: +91 82829 38658`;
  }

  // 2. SUPPORT & TROUBLESHOOTING HANDLERS
  const isEnglish = q.includes('how') || q.includes('where') || q.includes('help') || q.includes('please') || q.includes('cannot') || q.includes('what') || q.includes('error') || q.includes('hello') || q.includes('hi');

  if (q.includes('feature') || q.includes('detail') || q.includes('app') || q.includes('merishop')) {
    return `🚀 *MERISHOP — #1 DIGITAL REGISTER & POS BILLING APP IN INDIA* 🇮🇳
━━━━━━━━━━━━━━━━━━━
Top Features for your shop:

⚡ *1. Fast GST & Non-GST Billing*: Bluetooth/USB Thermal receipt print.
👥 *2. Udhaar Khata Book*: Auto 5-day WhatsApp Payment Reminders + UPI link.
📄 *3. AI Paper Parcha Scanner*: Photo scan paper receipts to auto-add items.
📦 *4. Stock & Inventory*: Live stock tracking & low-stock alerts.
🌐 *5. Free Online E-Shop Store*: Instant website + Counter QR Standee.
🏷️ *6. Barcode Generator*: Custom barcode print & phone scan.
💵 *7. Cash Register Tally (गल्ला)*: Daily sales tally & profit.
☁️ *8. 100% Offline + Auto Google Drive Cloud Backup*.

━━━━━━━━━━━━━━━━━━━
📲 *Download FREE App on Play Store:*
${playStoreUrl}

🌐 *Visit Demo Store:* ${storeUrl}`;
  } else if (q.includes('printer') || q.includes('print') || q.includes('bluetooth') || q.includes('usb')) {
    return isEnglish
      ? `Hello! This is Rohit from **MeriShop Support Team** 🖨️\n\nHere is how to connect your printer:\n1. **Bluetooth Printer**: Pair printer in Phone Settings (PIN 0000/1234). In MeriShop app -> Settings -> Bluetooth Printer -> Tap Scan.\n2. **USB POS Printer**: Turn ON Android OTG Connection in Phone Settings. Connect via OTG cable.\n3. Make sure 58mm/80mm thermal roll is placed correctly!\n\nHelpline: +91 82829 38658`
      : `Namaste ji! Main MeriShop Support Desk se **Rohit** bol raha hoon 🖨️\n\nPrinter connect karne ka tarika:\n1. **Bluetooth Printer**: Phone Settings me printer Pair karein (Pin 0000/1234). App Settings -> Bluetooth Printer me jaakar Scan karein.\n2. **USB POS Printer**: Mobile settings me OTG Connection ON karein aur USB OTG cable se connect karein.\n3. Check karein ki 58mm/80mm paper roll sahi side me ho!\n\nHelpline: +91 82829 38658`;
  } else if (q.includes('bill') || q.includes('gst') || q.includes('invoice')) {
    return isEnglish
      ? `Hello! Rohit from MeriShop Support ⚡\n\nCreating a bill is super fast:\n1. Tap **New Sale** on Home screen.\n2. Select items or scan barcode.\n3. Select Tax Type (GST 5%/12%/18% or Non-GST) and tap **Create Bill**.\n4. Instant receipt will print and send to customer\'s WhatsApp!`
      : `Namaste ji! Main MeriShop Support Desk se **Rohit** bol raha hoon ⚡\n\nFast Bill Banane ka Tarika:\n1. Home Screen par **New Sale** tap karein.\n2. Items select karein, GST Type select karke **Create Bill** dabayein.\n3. Instant print niklega aur grahak ke WhatsApp par receipt chali jayegi!`;
  } else if (q.includes('khaata') || q.includes('udhaar') || q.includes('reminder') || q.includes('balance')) {
    return `Namaste ji! Main MeriShop Support Desk se **Rohit** bol raha hoon 👥\n\n1. App har 5 din me automatic grahak ko pending balance + UPI Payment Link WhatsApp par bhejta hai.\n2. Khata tab me jaakar kisi bhi grahak ka statement dekh sakte hain aur manual WhatsApp reminder bhej sakte hain!\n\n📲 Download App: ${playStoreUrl}`;
  } else {
    return isEnglish
      ? `Hello! Welcome to **MeriShop Customer Support Desk** 👋\n\nI am Rohit, your Dedicated Support Specialist. How can I help you today?\n\n📲 *Download FREE App:* ${playStoreUrl}\n🛒 *Online Store:* ${storeUrl}\n\nYou can ask me about: **PRINTER**, **BILLING**, **KHATA**, **AI SCANNER**, **ESHOP**, or **BACKUP**!\nHelpline: +91 82829 38658`
      : `Namaste ji! **MeriShop Customer Support Desk** me aapka swagat hai 🙏\n\nMain Rohit, aapka Dedicated Support Executive. Aapki kya madad kar sakta hoon?\n\n📲 *Download FREE App:* ${playStoreUrl}\n🛒 *Online Store:* ${storeUrl}\n\nAap pooch sakte hain: **FEATURES**, **PRINTER**, **BILL**, **KHATA**, **PARCHA**, **ESHOP**, ya **BACKUP**!\nDirect Helpline: +91 82829 38658`;
  }
}

// Helper: Sends WhatsApp Message via Meta Cloud API REST
async function sendWhatsAppCloudMessage(recipientPhone, messageText) {
  try {
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
        to: recipientPhone,
        type: 'text',
        text: {
          preview_url: true,
          body: messageText,
        },
      }),
    });

    const data = await response.json();
    console.log('✅ WhatsApp Cloud API auto-reply result:', data);
  } catch (error) {
    console.error('❌ Error sending WhatsApp Cloud API auto-reply:', error);
  }
}
