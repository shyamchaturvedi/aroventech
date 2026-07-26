import React from 'react';

export const metadata = {
  title: 'MeriShop - GST Billing, Thermal Printing & POS Software | ArovenTech',
  description: 'Download MeriShop: India #1 Smart GST Billing, POS, Bluetooth Thermal Printing & Udhaar Khata App for Kirana, Mobile Shops, Restaurants & Retail Stores.',
};

export default function MeriShopProductPage() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Hero Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', color: 'white', padding: '50px 30px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.4)' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '15px' }}>
            📱 OFFICIAL PRODUCT BY AROVENTECH
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', margin: '10px 0 15px 0' }}>MeriShop: GST Billing & POS App</h1>
          <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: '700px', margin: '0 auto 30px auto', lineHeight: 1.5 }}>
            Apni Dookan Ko Digital Banao! Smart Barcode Billing, Bluetooth Thermal Receipt Printing, Stock Inventory & Udhar Khata for all Retail Shopkeepers.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://play.google.com/store/apps/details?id=com.aroventech.merishop" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ backgroundColor: '#ffffff', color: '#0f766e', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', fontSize: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              Get it on Google Play 🚀
            </a>
            <a 
              href="/merishop-privacy.html" 
              style={{ border: '2px solid rgba(255,255,255,0.6)', color: 'white', padding: '14px 24px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none', fontSize: '16px' }}
            >
              Privacy Policy & Terms
            </a>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{ margin: '50px 0' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0f766e', textAlign: 'center', marginBottom: '30px' }}>
            Everything Your Shop Needs In One App
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
              <h3 style={{ fontSize: '18px', color: '#0f766e', margin: '0 0 10px 0' }}>5-Second Fast Billing</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Create professional GST & Non-GST bills with tax, custom discounts, and shop logo. Share digital PDF bills instantly via WhatsApp.
              </p>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🖨️</div>
              <h3 style={{ fontSize: '18px', color: '#0f766e', margin: '0 0 10px 0' }}>Bluetooth Thermal Print</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Instant wireless receipt printing for 2-inch (58mm) & 3-inch (80mm) POS printers. Customizable headers & store logo.
              </p>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
              <h3 style={{ fontSize: '18px', color: '#0f766e', margin: '0 0 10px 0' }}>Barcode Stock Management</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Scan product barcodes using phone camera. Real-time stock alerts so you never run out of inventory.
              </p>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📱</div>
              <h3 style={{ fontSize: '18px', color: '#0f766e', margin: '0 0 10px 0' }}>Digital Udhar Khata</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Maintain customer credit balance. Send automated WhatsApp status reminders to recover payments 3x faster.
              </p>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
              <h3 style={{ fontSize: '18px', color: '#0f766e', margin: '0 0 10px 0' }}>Sales & Profit Analytics</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Dynamic Sales vs Expense progress bar, Net Profit margin ratio, and 1-click GSTR-1 Excel tax report downloads.
              </p>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>☁️</div>
              <h3 style={{ fontSize: '18px', color: '#0f766e', margin: '0 0 10px 0' }}>100% Offline & Auto Cloud Backup</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
                Works completely offline without internet. Encrypted Google Drive automatic cloud backup keeps your data 100% safe.
              </p>
            </div>

          </div>
        </div>

        {/* Footer Contact Section */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f766e' }}>Need Support or Business Customization?</h3>
          <p style={{ color: '#64748b', margin: '0 0 15px 0' }}>Contact ArovenTech Official Team</p>
          <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
            Website: <a href="https://www.aroventech.site" style={{ color: '#0d9488' }}>www.aroventech.site</a> | Email: <a href="mailto:info.aroventech@gmail.com" style={{ color: '#0d9488' }}>info.aroventech@gmail.com</a>
          </p>
        </div>

      </div>
    </div>
  );
}
