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

// 2. POST Method: Handles Incoming WhatsApp Messages & AI Auto-Replies 24/7 with Interactive Buttons
export async function POST(request) {
  try {
    const body = await request.json();

    if (body.object && body.entry && body.entry[0]?.changes && body.entry[0]?.changes[0]?.value?.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const fromPhone = message.from;
      const messageType = message.type;
      
      let incomingText = '';
      if (messageType === 'text') {
        incomingText = message.text?.body || '';
      } else if (messageType === 'interactive') {
        incomingText = message.interactive?.button_reply?.title || message.interactive?.button_reply?.id || '';
      }

      console.log(`📩 Incoming WhatsApp Message from ${fromPhone}: "${incomingText}"`);

      // Generate Clean Response & Modern Action Buttons
      const responseData = generateAiSupportResponse(incomingText);

      // Send Instant WhatsApp Interactive Button Reply
      await sendWhatsAppInteractiveMessage(
        fromPhone,
        responseData.header,
        responseData.body,
        responseData.footer,
        responseData.buttons
      );
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error processing WhatsApp Webhook:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}

// Helper: AI Support Executive (Rohit) Clean Knowledge Engine with Modern Buttons
function generateAiSupportResponse(text) {
  const q = (text || '').toLowerCase().trim();
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.aroventech.merishop';
  const storeUrl = 'https://www.aroventech.site/merishop/MSCHAUBEYSHOP01';

  // 1. EXPLICIT BUTTON CLICK HANDLERS
  if (q.includes('coupon') || q.includes('get_offer') || q.includes('offer')) {
    return {
      header: '🎁 Special Discount Coupon',
      body: 'Namaste ji! Aapke agle purchase ke liye Special Coupon Code:\n\n🔥 *SAVE10*\n\nOnline checkout par SAVE10 apply karke 10% instant discount paayein!',
      footer: 'MeriShop Digital Register',
      buttons: [
        { id: 'shop_online', title: '🛒 Order Online' },
        { id: 'download_app', title: '📲 Download App' },
      ],
    };
  }
  
  if (q.includes('order online') || q.includes('shop_online')) {
    return {
      header: '🛒 Chaubey Shop Online Catalog',
      body: 'Ghar baithe saare items dekhne aur order karne ke liye link par click karein:\n\n👉 ' + storeUrl,
      footer: 'Chaubey Shop • Digital Store',
      buttons: [
        { id: 'get_offer', title: '🎁 Get Coupon' },
        { id: 'call_support', title: '📞 Call Helpline' },
      ],
    };
  }

  if (q.includes('download app') || q.includes('download_app')) {
    return {
      header: '📲 MeriShop POS App Download',
      body: 'Aapki dukan ka 100% Free & Offline Digital Register app download karein:\n\n👉 ' + playStoreUrl,
      footer: 'MeriShop POS • Free App',
      buttons: [
        { id: 'shop_online', title: '🛒 Order Online' },
        { id: 'call_support', title: '📞 Call Helpline' },
      ],
    };
  }

  // 2. CLEAN TROUBLESHOOTING & SUPPORT HANDLERS (No Promo Spam!)
  const isEnglish = q.includes('how') || q.includes('where') || q.includes('help') || q.includes('please') || q.includes('cannot') || q.includes('what') || q.includes('error') || q.includes('hello') || q.includes('hi');

  if (q.includes('feature') || q.includes('detail') || q.includes('app') || q.includes('merishop') || q.includes('about')) {
    return {
      header: '🚀 MeriShop Digital POS Features',
      body: 'MeriShop POS App Features:\n\n⚡ 1. Fast GST & Non-GST Thermal Billing\n👥 2. Udhaar Khata & Auto 5-Day WhatsApp Reminders\n📄 3. AI Paper Receipt Photo Scanner\n📦 4. Stock & Low Inventory Alerts\n🌐 5. Free Online E-Shop Store & Counter QR Standee\n🏷️ 6. Barcode Sticker Printing & Scanning\n💵 7. Cash Register Tally (गल्ला)\n☁️ 8. 100% Offline + Auto Google Drive Cloud Backup\n\nApp Download:\n' + playStoreUrl,
      footer: 'MeriShop Digital Register',
      buttons: [
        { id: 'shop_online', title: '🛒 Order Online' },
        { id: 'get_offer', title: '🎁 Get Coupon' },
      ],
    };
  } else if (q.includes('printer') || q.includes('print') || q.includes('bluetooth') || q.includes('usb')) {
    return {
      header: '🖨️ Thermal Printer Solution',
      body: isEnglish
        ? 'Hello! This is Rohit from MeriShop Support 🖨️\n\nPrinter Connection Steps:\n1. Bluetooth: Pair in Phone Settings (PIN 0000/1234). In MeriShop app -> Settings -> Bluetooth Printer -> Tap Scan.\n2. USB POS: Enable OTG Connection in phone settings. Connect via OTG cable.\n3. Paper Roll: Place 58mm/80mm thermal roll correctly.'
        : 'Namaste ji! Main MeriShop Support Desk se Rohit bol raha hoon 🖨️\n\nPrinter Connect karne ka Tarika:\n1. Bluetooth: Phone Settings me printer Pair karein (Pin 0000/1234). App Settings -> Bluetooth Printer me jaakar Scan karein.\n2. USB POS: Phone settings me OTG Connection ON karein aur OTG Cable se connect karein.\n3. Check karein ki 58mm/80mm paper roll sahi side me ho.',
      footer: 'Helpline: +91 82829 38658',
      buttons: [
        { id: 'call_support', title: '📞 Call Helpline' },
        { id: 'download_app', title: '📲 Download App' },
      ],
    };
  } else if (q.includes('bill') || q.includes('gst') || q.includes('invoice')) {
    return {
      header: '⚡ Fast Billing Solution',
      body: isEnglish
        ? 'Hello! Rohit from MeriShop Support ⚡\n\n1. Tap New Sale on Home screen.\n2. Select items or scan barcode.\n3. Select Tax Type (GST 5%/12%/18% or Non-GST) and tap Create Bill.\n4. Receipt will print instantly and send to customer WhatsApp!'
        : 'Namaste ji! Main MeriShop Support Desk se Rohit bol raha hoon ⚡\n\n1. Home Screen par New Sale tap karein.\n2. Items select karein, GST Type select karke Create Bill dabayein.\n3. Instant print niklega aur grahak ke WhatsApp par receipt chali jayegi!',
      footer: 'Helpline: +91 82829 38658',
      buttons: [
        { id: 'download_app', title: '📲 Download App' },
        { id: 'call_support', title: '📞 Call Helpline' },
      ],
    };
  } else if (q.includes('khaata') || q.includes('udhaar') || q.includes('reminder') || q.includes('balance')) {
    return {
      header: '👥 Udhaar Khata & Auto Reminders',
      body: 'Namaste ji! Main MeriShop Support Desk se Rohit bol raha hoon 👥\n\n1. App har 5 din me automatic grahak ko pending balance + UPI Payment Link WhatsApp par bhejta hai.\n2. Khata tab me jaakar kisi bhi grahak ka statement dekh sakte hain aur manual WhatsApp reminder bhej sakte hain!',
      footer: 'Helpline: +91 82829 38658',
      buttons: [
        { id: 'download_app', title: '📲 Download App' },
        { id: 'call_support', title: '📞 Call Helpline' },
      ],
    };
  } else {
    return {
      header: '👋 MeriShop Support Desk',
      body: isEnglish
        ? 'Hello! Welcome to MeriShop Support Desk. I am Rohit, your Dedicated Support Specialist. How can I help you today?'
        : 'Namaste ji! MeriShop Customer Support Desk me aapka swagat hai 🙏 Main Rohit, aapka Dedicated Support Executive. Aapki kya madad kar sakta hoon?',
      footer: 'Helpline: +91 82829 38658',
      buttons: [
        { id: 'get_features', title: '🚀 App Features' },
        { id: 'download_app', title: '📲 Download App' },
        { id: 'call_support', title: '📞 Call Helpline' },
      ],
    };
  }
}

// Helper: Sends Interactive Button Message via Meta Cloud API REST
async function sendWhatsAppInteractiveMessage(recipientPhone, headerTitle, bodyText, footerText, buttons) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    const buttonObjects = (buttons || []).slice(0, 3).map((b) => ({
      type: 'reply',
      reply: {
        id: b.id || 'btn',
        title: (b.title || 'Click').substring(0, 20),
      },
    }));

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
        type: 'interactive',
        interactive: {
          type: 'button',
          header: {
            type: 'text',
            text: (headerTitle || 'MeriShop').substring(0, 60),
          },
          body: {
            text: bodyText || 'Hello',
          },
          footer: {
            text: (footerText || 'MeriShop POS').substring(0, 60),
          },
          action: {
            buttons: buttonObjects,
          },
        },
      }),
    });

    const data = await response.json();
    console.log('✅ Meta Interactive WhatsApp Button Reply sent:', data);

    // Fallback to text if interactive template restriction applies
    if (response.status !== 200 && response.status !== 201) {
      console.warn('Fallback to text message due to Meta API status:', response.status);
      await sendWhatsAppTextMessage(recipientPhone, `📌 ${headerTitle}\n\n${bodyText}\n\n_${footerText}_`);
    }
  } catch (error) {
    console.error('❌ Error sending WhatsApp Interactive message:', error);
    await sendWhatsAppTextMessage(recipientPhone, `📌 ${headerTitle}\n\n${bodyText}\n\n_${footerText}_`);
  }
}

// Helper: Sends Fallback WhatsApp Text Message via Meta Cloud API REST
async function sendWhatsAppTextMessage(recipientPhone, messageText) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    await fetch(url, {
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
  } catch (e) {
    console.error('Error sending fallback text message:', e);
  }
}
