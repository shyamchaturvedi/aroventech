'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PartnerProgramPage() {
  // Web3Forms Access Key for sending form details directly to info@aroventech.site
  // NOTE: Get a free key at https://web3forms.com/ by entering your email
  const accessKey = "e4624d77-9be7-4638-95ff-a968eb1e27a6"; // Standard Web3Forms API Key placeholder, user can replace this

  const [formData, setFormData] = useState({
    appName: '',
    developerName: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appName || !formData.developerName || !formData.email || !formData.phone) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New Partner Application: ${formData.appName}`,
          from_name: "Aroven Tech Partner Program",
          to_email: "info@aroventech.site",
          ...formData
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setSubmitStatus('success');
        setFormData({
          appName: '',
          developerName: '',
          email: '',
          phone: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .partner-card {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 24px !important;
          padding: 30px !important;
          margin-top: 30px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .partner-title {
          font-size: 2.8rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 8px;
        }

        .partner-subtitle {
          font-size: 1.1rem;
          color: var(--text-dim);
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        .feature-item {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 20px;
          border-radius: 16px;
        }

        .feature-title {
          color: #00e5ff;
          font-weight: 700;
          margin-bottom: 8px;
          font-size: 1.05rem;
        }

        .feature-desc {
          font-size: 0.9rem;
          color: var(--text-dim);
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          padding: 14px 18px !important;
          color: #fff !important;
          font-size: 0.95rem !important;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #00e5ff !important;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.1);
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #00e5ff 0%, #7000ff 100%) !important;
          color: #070b14 !important;
          border: none !important;
          padding: 16px !important;
          border-radius: 14px !important;
          font-size: 1rem !important;
          font-weight: 800 !important;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-top: 10px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 229, 255, 0.3);
        }

        .status-alert {
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 0.95rem;
          font-weight: 600;
          text-align: center;
        }

        .status-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .status-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          .partner-title {
            font-size: 2.2rem;
          }
        }
      ` }} />

      <h1 className="partner-title">
        Aroven Tech <span className="gradient-text">Partner Program</span>
      </h1>
      <p className="partner-subtitle">
        Android App Developers & Startups ke liye: Dynamic notices, buttons, promotions aur features direct cloud se manage karein bina app ko re-publish kiye.
      </p>

      {/* Program Details */}
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-title">⚡ Ready Integration Code</div>
          <div className="feature-desc">AI prompt ke sath direct code copy-paste karein. AI Agent integration ko turant complete kar dega.</div>
        </div>
        <div className="feature-item">
          <div className="feature-title">☁️ Cloud Based Updates</div>
          <div className="feature-desc">Notice board, Telegram/WhatsApp buttons, banners, aur download links real-time me update honge.</div>
        </div>
        <div className="feature-item">
          <div className="feature-title">🛠️ Zero Maintenance</div>
          <div className="feature-desc">Future features, announcements, ya app recommendations change karne par app updates ki zarurat nahi.</div>
        </div>
        <div className="feature-item">
          <div className="feature-title">📈 Mutual Growth</div>
          <div className="feature-desc">AROVEN TECH network ke sath cross-promotion, announcements aur channel growth ka direct access.</div>
        </div>
      </div>

      {/* Application Form Card */}
      <div className="partner-card">
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>
          Apply for Partner API & Prompt
        </h2>

        {submitStatus === 'success' && (
          <div className="status-alert status-success">
            ✓ Application Submitted Successfully! Hum aapse jaldi hi email par contact karke Partner API key aur AI Prompt share karenge.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="status-alert status-error">
            ❌ Application submit karne me error aayi. Kripya details check karke dobara try karein ya info@aroventech.site par direct contact karein.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Partner App Name</label>
            <input
              type="text"
              name="appName"
              required
              placeholder="E.g. Meri Shop - Billing POS"
              value={formData.appName}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Developer or Company Name</label>
            <input
              type="text"
              name="developerName"
              required
              placeholder="E.g. Shyam Chaturvedi"
              value={formData.developerName}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="E.g. developer@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="E.g. 9598023701"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? "Submitting Application..." : "Submit Partner Application"}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#00e5ff', fontSize: '0.9rem', textDecoration: 'none' }}>
          &larr; Back to Home Page
        </Link>
      </div>
    </main>
  );
}
