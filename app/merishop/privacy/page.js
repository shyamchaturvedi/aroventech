import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — MERISHOP | ArovenTech',
  description: 'Privacy Policy for MeriShop Retail OS — 100% Offline, Secure & Encrypted Data Protection.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#0A0A0E', color: '#FFFFFF', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '100px 20px 60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'rgba(22, 22, 30, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(16px)' }}>
        
        <Link href="/merishop" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', marginBottom: '20px', display: 'inline-block' }}>
          ← Back to MeriShop Landing Page
        </Link>

        <h1 style={{ fontFamily: "'Teko', sans-serif", fontSize: '3.5rem', textTransform: 'uppercase', color: '#FE3E29', lineHeight: 1, marginBottom: '16px' }}>
          PRIVACY POLICY FOR MERISHOP
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', marginBottom: '30px' }}>
          LAST UPDATED: JULY 26, 2026 | DEVELOPER: SHYAM CHATURVEDI (AROVENTECH)
        </p>

        <section style={{ marginBottom: '28px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
          <h2 style={{ color: '#FFF', fontSize: '1.4rem', marginBottom: '10px' }}>1. 100% Offline Architecture & Data Ownership</h2>
          <p>
            MeriShop is built as an offline-first Retail Operating System. All billing data, customer registers, inventory items, and transaction logs are stored strictly on your local device. We do not transfer or store your store financial records on external cloud servers without your explicit action.
          </p>
        </section>

        <section style={{ marginBottom: '28px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
          <h2 style={{ color: '#FFF', fontSize: '1.4rem', marginBottom: '10px' }}>2. Device Permissions Required</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}><b>Bluetooth & Near Devices:</b> Used exclusively for pairing and printing receipts on wireless thermal printers (58mm / 80mm).</li>
            <li style={{ marginBottom: '8px' }}><b>Camera:</b> Used solely for real-time barcode scanning of inventory items during billing.</li>
            <li style={{ marginBottom: '8px' }}><b>Storage Access:</b> Used to save PDF invoices, GSTR-1 Excel reports, and encrypted local database backups.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '28px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
          <h2 style={{ color: '#FFF', fontSize: '1.4rem', marginBottom: '10px' }}>3. Data Security & Encrypted Drive Backup</h2>
          <p>
            When you initiate a cloud backup, your data is encrypted locally before being stored in your private Google Drive account. Only you possess access to your backups.
          </p>
        </section>

        <section style={{ marginBottom: '28px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
          <h2 style={{ color: '#FFF', fontSize: '1.4rem', marginBottom: '10px' }}>4. Developer & Support Contact</h2>
          <p>
            For any queries regarding MeriShop privacy practices, please contact:<br />
            <b>Developer:</b> Shyam Chaturvedi (ArovenTech)<br />
            <b>Email:</b> support@aroventech.site | shyamchaturvedi.dev@gmail.com
          </p>
        </section>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '40px', textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
          &copy; 2026 ArovenTech. Developed by Shyam Chaturvedi. All rights reserved.
        </div>
      </div>
    </div>
  );
}
