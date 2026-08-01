import { NextResponse } from 'next/server';

export async function GET() {
  // Allow Cross-Origin Requests (CORS) so partner apps (web/flutter/native) can fetch this API directly
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store, max-age=0' // Ensure no caching of config to allow instant updates
  };

  try {
    const firebaseProjId = 'merishop-e3d9b';
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjId}/databases/(default)/documents/partner_config/global_settings`;

    const res = await fetch(firestoreUrl, { cache: 'no-store' });
    
    if (res.ok) {
      const doc = await res.json();
      const fields = doc.fields || {};

      // Helper to safely parse Firestore REST API fields
      const parseString = (field) => field && field.stringValue ? field.stringValue : '';
      
      // Parse recommended apps array if it exists in Firestore
      let recommendedApps = [];
      if (fields.recommendedApps && fields.recommendedApps.arrayValue && fields.recommendedApps.arrayValue.values) {
        recommendedApps = fields.recommendedApps.arrayValue.values.map(val => {
          const mapFields = val.mapValue ? val.mapValue.fields || {} : {};
          return {
            name: parseString(mapFields.name),
            packageName: parseString(mapFields.packageName),
            iconUrl: parseString(mapFields.iconUrl),
            promoText: parseString(mapFields.promoText)
          };
        });
      }

      return NextResponse.json({
        notice: parseString(fields.notice) || "Welcome to AROVEN Partner Network! Grow your business with our smart tools.",
        noticeColor: parseString(fields.noticeColor) || '#00E5FF',
        telegramLink: parseString(fields.telegramLink) || "https://t.me/aroventech",
        recommendedApps: recommendedApps.length > 0 ? recommendedApps : getDefaultApps()
      }, { headers });
    }
  } catch (err) {
    console.error("Firestore fetch error inside API route:", err);
  }

  // Default Fallback JSON if Firestore is not configured yet
  return NextResponse.json({
    notice: "Welcome to AROVEN Partner Network! Grow your business with our smart tools.",
    noticeColor: "#00E5FF",
    telegramLink: "https://t.me/aroventech",
    recommendedApps: getDefaultApps()
  }, { headers });
}

function getDefaultApps() {
  return [
    {
      name: "Meri Shop - Billing POS",
      packageName: "com.aroven.merishop",
      iconUrl: "https://www.aroventech.site/icon.png",
      promoText: "Free dynamic e-shop builder and offline billing app for retail shops."
    }
  ];
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
