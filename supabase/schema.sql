-- ==============================================================
-- THEFUNDU INVENTORY OS — ENTERPRISE DATABASE SCHEMA
-- Esterline Bonaparte Corporation Private Limited (Brand: TheFundu)
-- Database: PostgreSQL 14+ / Supabase
-- ==============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE device_grade AS ENUM ('A+', 'A', 'B', 'C', 'D', 'Scrap');
CREATE TYPE device_status AS ENUM (
  'In Stock', 'QC Pending', 'Under Repair', 'Ready for Sale', 
  'Reserved', 'Sold', 'Damaged', 'Returned'
);
CREATE TYPE vendor_tier AS ENUM (
  'Tier 1 (Strategic Partner)', 
  'Tier 2 (Preferred Wholesale)', 
  'Tier 3 (Spot Buy Partner)'
);
CREATE TYPE vendor_category AS ENUM (
  'Enterprise Buyback Aggregator', 
  'Regional Wholesale Stockist', 
  'Corporate ITAD & Liquidation', 
  'Retail Franchise Sourcing', 
  'Direct OEM Exchange'
);

-- 2. WAREHOUSES TABLE
CREATE TABLE warehouses (
  id VARCHAR(32) PRIMARY KEY, -- e.g. WH-BOM-01
  name VARCHAR(128) NOT NULL UNIQUE, -- Mumbai Central Hub
  code VARCHAR(32) NOT NULL UNIQUE, -- BOM-HUB
  address TEXT NOT NULL,
  manager_name VARCHAR(128) NOT NULL,
  manager_phone VARCHAR(32),
  total_capacity INT DEFAULT 2500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. VENDORS / SUPPLIERS TABLE
CREATE TABLE suppliers (
  id VARCHAR(32) PRIMARY KEY, -- e.g. SUP-001
  name VARCHAR(256) NOT NULL,
  company VARCHAR(256) NOT NULL,
  contact_person VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  address TEXT NOT NULL,
  gst_number VARCHAR(32),
  pan VARCHAR(32),
  category vendor_category DEFAULT 'Enterprise Buyback Aggregator',
  tier vendor_tier DEFAULT 'Tier 1 (Strategic Partner)',
  payment_terms VARCHAR(64) DEFAULT 'Net 15',
  credit_limit NUMERIC(12, 2) DEFAULT 3000000.00,
  outstanding_balance NUMERIC(12, 2) DEFAULT 0.00,
  qc_pass_rate NUMERIC(5, 2) DEFAULT 96.50,
  bank_name VARCHAR(128),
  account_number VARCHAR(64),
  ifsc_code VARCHAR(32),
  upi_id VARCHAR(64),
  kyc_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CONSIGNMENT BATCHES (INWARD LOTS)
CREATE TABLE consignments (
  id VARCHAR(64) PRIMARY KEY, -- e.g. LOT-2026-BOM-88
  supplier_id VARCHAR(32) REFERENCES suppliers(id) ON DELETE SET NULL,
  warehouse_id VARCHAR(32) REFERENCES warehouses(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  total_devices INT NOT NULL,
  qc_passed_count INT DEFAULT 0,
  qc_rejected_count INT DEFAULT 0,
  total_value NUMERIC(12, 2) NOT NULL,
  settlement_status VARCHAR(64) DEFAULT 'Pending QC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SERIALIZED SMARTPHONES (CORE ASSETS)
CREATE TABLE devices (
  id VARCHAR(64) PRIMARY KEY, -- e.g. Fun-26001
  brand VARCHAR(64) NOT NULL, -- Apple, Samsung, Google
  model VARCHAR(128) NOT NULL, -- iPhone 15 Pro Max
  storage VARCHAR(32) NOT NULL, -- 256GB
  ram VARCHAR(32),
  colour VARCHAR(64) NOT NULL,
  imei1 VARCHAR(32) UNIQUE NOT NULL, -- Primary 15-Digit IMEI
  imei2 VARCHAR(32), -- eSIM / Secondary IMEI
  serial_number VARCHAR(64),
  sku VARCHAR(64),
  
  -- Hardware Condition
  battery_health INT DEFAULT 90,
  grade device_grade DEFAULT 'A',
  status device_status DEFAULT 'QC Pending',
  
  -- Financials (Sourcing Cost X is Confidential)
  purchase_price NUMERIC(10, 2) NOT NULL, -- X (Hidden from customer invoices)
  repair_cost NUMERIC(10, 2) DEFAULT 0.00,
  testing_cost NUMERIC(10, 2) DEFAULT 250.00,
  logistics_cost NUMERIC(10, 2) DEFAULT 350.00,
  selling_price NUMERIC(10, 2) NOT NULL, -- Y (Customer retail price)
  
  -- Logistics & Sourcing
  purchase_date DATE DEFAULT CURRENT_DATE,
  supplier_id VARCHAR(32) REFERENCES suppliers(id),
  warehouse_id VARCHAR(32) REFERENCES warehouses(id),
  consignment_id VARCHAR(64) REFERENCES consignments(id),
  
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_devices_imei ON devices(imei1);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_warehouse ON devices(warehouse_id);

-- 6. 13-POINT QUALITY CHECK (QC INSPECTIONS)
CREATE TABLE qc_inspections (
  id VARCHAR(64) PRIMARY KEY, -- e.g. QC-9921
  device_id VARCHAR(64) REFERENCES devices(id) ON DELETE CASCADE,
  inspector_name VARCHAR(128) NOT NULL,
  inspection_date DATE DEFAULT CURRENT_DATE,
  battery_health_percent INT NOT NULL,
  grade_assigned device_grade NOT NULL,
  
  -- 13 Diagnostic Checkpoints
  display_passed BOOLEAN DEFAULT TRUE,
  touchscreen_passed BOOLEAN DEFAULT TRUE,
  battery_passed BOOLEAN DEFAULT TRUE,
  face_id_passed BOOLEAN DEFAULT TRUE,
  fingerprint_passed BOOLEAN DEFAULT TRUE,
  cameras_passed BOOLEAN DEFAULT TRUE,
  speakers_passed BOOLEAN DEFAULT TRUE,
  microphone_passed BOOLEAN DEFAULT TRUE,
  charging_port_passed BOOLEAN DEFAULT TRUE,
  sim_network_passed BOOLEAN DEFAULT TRUE,
  wifi_passed BOOLEAN DEFAULT TRUE,
  bluetooth_passed BOOLEAN DEFAULT TRUE,
  chassis_passed BOOLEAN DEFAULT TRUE,
  
  status VARCHAR(32) DEFAULT 'Approved', -- Approved / Needs Repair
  notes TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. REPAIR JOBS (TECHNICIAN BAY)
CREATE TABLE repair_jobs (
  id VARCHAR(64) PRIMARY KEY, -- e.g. REP-8826
  device_id VARCHAR(64) REFERENCES devices(id) ON DELETE CASCADE,
  technician_name VARCHAR(128) NOT NULL,
  problem_description TEXT NOT NULL,
  parts_replaced TEXT[] DEFAULT '{}',
  repair_cost NUMERIC(10, 2) DEFAULT 0.00,
  status VARCHAR(32) DEFAULT 'Pending', -- In Progress, Awaiting Parts, Quality Passed
  start_date DATE DEFAULT CURRENT_DATE,
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. SALES ORDERS & GST RULE 32(5) TAX INVOICES
CREATE TABLE sales_orders (
  id VARCHAR(64) PRIMARY KEY, -- e.g. SO-2026-901
  invoice_number VARCHAR(64) UNIQUE NOT NULL, -- INVMUM260001362
  invoice_date DATE DEFAULT CURRENT_DATE,
  
  -- Customer Particulars
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_email VARCHAR(128),
  customer_address TEXT NOT NULL,
  customer_gstin VARCHAR(32),
  place_of_supply VARCHAR(64) DEFAULT 'Maharashtra',
  
  -- Handset Link
  device_id VARCHAR(64) REFERENCES devices(id),
  imei VARCHAR(32) NOT NULL,
  
  -- Commercials & Rule 32(5) Margin Calculation
  selling_price NUMERIC(10, 2) NOT NULL, -- Y
  discount NUMERIC(10, 2) DEFAULT 0.00,
  final_amount NUMERIC(10, 2) NOT NULL, -- Y - D
  
  -- 18% GST Strictly on Margin Z = Y - D - X
  margin_profit_z NUMERIC(10, 2) NOT NULL,
  margin_tax_amount NUMERIC(10, 2) NOT NULL,
  margin_cgst NUMERIC(10, 2) NOT NULL,
  margin_sgst NUMERIC(10, 2) NOT NULL,
  margin_igst NUMERIC(10, 2) DEFAULT 0.00,
  
  -- Payment & Warranty
  payment_method VARCHAR(64) DEFAULT 'csh_razor_pay',
  payment_mode VARCHAR(32) DEFAULT 'UPI',
  transaction_id VARCHAR(128),
  gateway_txn_id VARCHAR(128),
  payment_status VARCHAR(32) DEFAULT 'Completed',
  warranty_days INT DEFAULT 180,
  warranty_expiry_date DATE NOT NULL,
  delivery_status VARCHAR(32) DEFAULT 'Packed',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sales_invoice ON sales_orders(invoice_number);

-- 9. VENDOR PAYOUTS
CREATE TABLE vendor_payouts (
  id VARCHAR(64) PRIMARY KEY, -- e.g. PAY-9921
  supplier_id VARCHAR(32) REFERENCES suppliers(id),
  date DATE DEFAULT CURRENT_DATE,
  amount NUMERIC(12, 2) NOT NULL,
  mode VARCHAR(32) DEFAULT 'NEFT/RTGS',
  utr_number VARCHAR(128) UNIQUE NOT NULL,
  tds_deducted NUMERIC(10, 2) DEFAULT 0.00, -- Section 194Q
  status VARCHAR(32) DEFAULT 'Processed',
  invoice_ref VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. VENDOR DISPUTES / RTV (RETURN TO VENDOR)
CREATE TABLE vendor_disputes (
  id VARCHAR(64) PRIMARY KEY, -- e.g. RTV-441
  supplier_id VARCHAR(32) REFERENCES suppliers(id),
  device_id VARCHAR(64),
  device_model VARCHAR(128) NOT NULL,
  imei VARCHAR(32) NOT NULL,
  issue_type VARCHAR(128) NOT NULL, -- iCloud Lock, Fake Screen, Water Damage
  detected_at DATE DEFAULT CURRENT_DATE,
  status VARCHAR(64) DEFAULT 'RTV Dispatched',
  claimed_amount NUMERIC(10, 2) NOT NULL,
  resolution_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
