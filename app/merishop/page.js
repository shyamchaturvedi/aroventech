import React from 'react';

export const metadata = {
  title: 'MeriShop - #1 GST Billing, POS & Thermal Printing App for Shops | ArovenTech',
  description: 'Apni Dookan Ko Digital Banao! Download MeriShop: Fast GST Billing, Bluetooth Thermal Receipt Printing, Barcode Inventory & Udhar Khata App.',
};

export default function MeriShopProductPage() {
  return (
    <div style={{ 
      fontFamily: "'Outfit', sans-serif", 
      color: '#f8fafc', 
      backgroundColor: '#0a0a0a', 
      minHeight: '100vh', 
      paddingTop: '120px', 
      paddingBottom: '80px',
      overflowX: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '70px', position: 'relative' }}>
          
          {/* Subtle Glow Background */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#34d399',
            marginBottom: '25px',
            backdropFilter: 'blur(8px)',
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            OFFICIAL PRODUCT BY AROVENTECH &bull; GOOGLE PLAY VERIFIED
          </div>

          {/* Title */}
          <h1 style={{ 
            fontSize: ' clamp(32px, 5vw, 54px)', 
            fontWeight: '800', 
            lineHeight: 1.15, 
            letterSpacing: '-0.02em',
            margin: '0 auto 20px auto',
            maxWidth: '900px',
            position: 'relative',
            zIndex: 1
          }}>
            Apni Dookan Ko Digital Banao With{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MeriShop POS & Billing
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ 
            fontSize: '18px', 
            color: '#94a3b8', 
            maxWidth: '750px', 
            margin: '0 auto 35px auto', 
            lineHeight: 1.6,
            position: 'relative',
            zIndex: 1
          }}>
            The #1 Smart Billing, Bluetooth Thermal Receipt Printing, Barcode Inventory & Udhar Khata App designed for Kirana Stores, Restaurants (KOT), Medical Shops & Retail Outlets.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <a 
              href="https://play.google.com/store/apps/details?id=com.aroventech.merishop" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                color: '#ffffff', 
                padding: '16px 32px', 
                borderRadius: '14px', 
                fontWeight: '700', 
                textDecoration: 'none', 
                fontSize: '17px',
                boxShadow: '0 8px 25px -5px rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s ease'
              }}
            >
              <span>Download on Google Play</span> 🚀
            </a>
            <a 
              href="/merishop-privacy.html" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.06)', 
                border: '1px solid rgba(255, 255, 255, 0.15)', 
                color: '#f8fafc', 
                padding: '16px 28px', 
                borderRadius: '14px', 
                fontWeight: '600', 
                textDecoration: 'none', 
                fontSize: '17px',
                backdropFilter: 'blur(10px)'
              }}
            >
              Privacy & Policy
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '55px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px',
            backdropFilter: 'blur(12px)'
          }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#34d399' }}>&lt; 5 Sec</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Instant Bill Creation</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#38bdf8' }}>100% Offline</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>No Internet Needed</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#a78bfa' }}>58mm / 80mm</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Thermal Bluetooth Print</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#f43f5e' }}>Auto Drive</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Encrypted Cloud Backup</div>
            </div>
          </div>
        </div>

        {/* CORE FEATURES SECTION */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.01em', margin: '0 0 10px 0' }}>
              Designed For Smart Modern Shopkeepers
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              Everything required to run your shop smoothly, track profits, and grow sales.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
            
            {/* Card 1 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '30px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>⚡</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>Lightning GST Billing</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Generate GST & Non-GST bills in 5 seconds. Customize shop logo, terms, tax rates, and share high-res PDF invoices instantly on WhatsApp.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '30px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>🖨️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>Bluetooth Thermal Printing</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Connect 2-inch (58mm) and 3-inch (80mm) wireless Bluetooth thermal printers. Print store receipts with your customized header branding.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '30px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>📦</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>Barcode & Stock Inventory</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Scan product barcodes instantly using phone camera. Real-time low stock checklist and alerts ensure you never miss a sale.
              </p>
            </div>

            {/* Card 4 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '30px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>📱</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>Digital Udhaar Khata</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Track customer credit balances. Send automated WhatsApp status reminders with payment links to collect dues 3x faster.
              </p>
            </div>

            {/* Card 5 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '30px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>📊</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>Sales & Net Profit Analytics</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Visual sales vs expenses distribution bar, profit margin ratio, and 1-click GSTR-1 Excel audit report downloads for your CA.
              </p>
            </div>

            {/* Card 6 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '30px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>☁️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#ffffff' }}>Google Drive Auto Backup</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Your data stays 100% offline on your device. Automatic encrypted backups sync to your own Google Drive for complete safety.
              </p>
            </div>

          </div>
        </div>

        {/* SUPPORTED SHOP TYPES */}
        <div style={{ 
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 10, 10, 1) 100%)', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '24px', 
          padding: '45px 30px',
          marginBottom: '80px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 15px 0' }}>
            Built For All Types of Merchants & Shops
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto 35px auto', fontSize: '15px' }}>
            MeriShop adapts instantly to your specific shop category with tailored features.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            {['🛒 Kirana & Supermarket', '🍽️ Restaurant & Cafe (KOT)', '💊 Chemist & Pharmacy (Batch/Expiry)', '👗 Clothing & Garments', '📱 Mobile & Electronics Repair', '✂️ Beauty Parlour & Salon', '🥛 Milk Shop & Dairy', '👞 Footwear Stores', '🔧 Hardware & Electricals'].map((shop, i) => (
              <div key={i} style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                padding: '10px 20px', 
                borderRadius: '30px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#e2e8f0'
              }}>
                {shop}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA CARD */}
        <div style={{ 
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', 
          borderRadius: '24px', 
          padding: '50px 30px', 
          textAlign: 'center',
          boxShadow: '0 20px 40px -15px rgba(13, 148, 136, 0.5)'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', margin: '0 0 15px 0' }}>
            Ready to Upgrade Your Shop to Digital?
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 30px auto' }}>
            Download MeriShop POS & Billing App from Google Play Store today.
          </p>
          <a 
            href="https://play.google.com/store/apps/details?id=com.aroventech.merishop" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              background: '#ffffff', 
              color: '#047857', 
              padding: '16px 36px', 
              borderRadius: '14px', 
              fontWeight: '800', 
              textDecoration: 'none', 
              fontSize: '18px',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Download Free App Now 📲
          </a>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '50px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          &copy; 2026 ArovenTech. All rights reserved. | <a href="/merishop-privacy.html" style={{ color: '#34d399', textDecoration: 'none' }}>Privacy Policy</a>
        </div>

      </div>
    </div>
  );
}
