-- ═══════════════════════════════════════════════════════════════════════════
-- MeriShop Multi-Shop Notification System — Supabase Tables
-- Run this SQL in: https://zmrxufpijlvwjazhtpyl.supabase.co → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Shop Notifications Log (every bill/reminder/link sent)
CREATE TABLE IF NOT EXISTS shop_notifications (
  id BIGSERIAL PRIMARY KEY,
  shop_id TEXT NOT NULL,           -- e.g. 'MSCHAUBEYSHOP01'
  customer_phone TEXT NOT NULL,    -- normalized 12-digit
  action TEXT NOT NULL,            -- 'send_bill' | 'send_udhaar_reminder' | 'send_shop_link' | 'send_offer'
  message TEXT,                    -- full WhatsApp message text
  extra_data JSONB,                -- shop name, customer name, UPI, etc.
  wa_delivered BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by shop
CREATE INDEX IF NOT EXISTS idx_shop_notifications_shop_id ON shop_notifications(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_notifications_phone ON shop_notifications(customer_phone);
CREATE INDEX IF NOT EXISTS idx_shop_notifications_created ON shop_notifications(created_at DESC);

-- 2. WhatsApp Logs (already exists, but add shop_id column if missing)
ALTER TABLE whatsapp_logs ADD COLUMN IF NOT EXISTS shop_id TEXT;
ALTER TABLE whatsapp_logs ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- 3. Shop Registry (optional — for analytics dashboard)
CREATE TABLE IF NOT EXISTS merishop_shops (
  shop_id TEXT PRIMARY KEY,        -- e.g. 'MSCHAUBEYSHOP01'
  shop_name TEXT NOT NULL,         -- e.g. 'Chaubey General Store'
  owner_name TEXT,
  phone TEXT,                      -- shopkeeper's phone
  upi_id TEXT,                     -- for payment links in messages
  city TEXT,
  category TEXT,                   -- 'kirana' | 'medical' | 'restaurant' etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (public read for shop info)
ALTER TABLE shop_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE merishop_shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all inserts" ON shop_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all reads" ON shop_notifications FOR SELECT USING (true);
CREATE POLICY "Allow all inserts shops" ON merishop_shops FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all reads shops" ON merishop_shops FOR SELECT USING (true);

-- ─── Sample Shop Data (Add your 50 shops here) ────────────────────────────────
INSERT INTO merishop_shops (shop_id, shop_name, owner_name, phone, upi_id, city, category) VALUES
  ('MSCHAUBEYSHOP01', 'Chaubey General Store', 'Rajesh Chaubey', '9598023701', 'chaubey@upi', 'Lucknow', 'kirana')
ON CONFLICT (shop_id) DO NOTHING;

-- ─── Useful Queries ───────────────────────────────────────────────────────────
-- Total bills sent today: SELECT COUNT(*) FROM shop_notifications WHERE action='send_bill' AND created_at > NOW()-INTERVAL '1 day';
-- Bills per shop: SELECT shop_id, COUNT(*) FROM shop_notifications GROUP BY shop_id ORDER BY COUNT(*) DESC;
-- Udhaar reminders sent: SELECT * FROM shop_notifications WHERE action='send_udhaar_reminder' ORDER BY created_at DESC LIMIT 50;


-- ============================================================
-- KHATA BOOK TABLES (OkCredit-style Ledger)
-- ============================================================

CREATE TABLE IF NOT EXISTS khata_customers (
  id BIGSERIAL PRIMARY KEY,
  shop_id TEXT NOT NULL DEFAULT 'DEFAULT',
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_khata_customers_shop ON khata_customers(shop_id);

CREATE TABLE IF NOT EXISTS khata_entries (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES khata_customers(id) ON DELETE CASCADE,
  shop_id TEXT NOT NULL DEFAULT 'DEFAULT',
  type TEXT NOT NULL CHECK (type IN ('credit','payment','reminder')),
  amount NUMERIC(12,2) DEFAULT 0,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_khata_entries_customer ON khata_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_khata_entries_shop ON khata_entries(shop_id);

ALTER TABLE khata_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE khata_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "khata_cust_all" ON khata_customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "khata_ent_all" ON khata_entries FOR ALL USING (true) WITH CHECK (true);
