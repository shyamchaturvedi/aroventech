import React from 'react';

export const metadata = {
  title: 'MeriShop — Aapka Apna Digital Register | ArovenTech',
  description: 'Flutter-based Android POS: Billing, GST, Udhaar Khata, WhatsApp Reminders, Stock Reports & Bluetooth Thermal Printing by Shyam Chaturvedi (ArovenTech).',
};

export default function MeriShopPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#14213D', position: 'fixed', top: 0, left: 0, zIndex: 999999 }}>
      <iframe 
        src="/merishop.html" 
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="MeriShop Official Website"
      />
    </div>
  );
}
