/**
 * Pure Native Fetch Seed Script for Supabase PostgreSQL REST API
 * Zero extra npm dependencies required.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const SUPABASE_URL = "https://bnrscvsfcgnbsfbbwbgf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucnNjdnNmY2duYnNmYmJ3YmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3MjM5NjMsImV4cCI6MjExMDI5OTk2M30.MO1Fwb2-7hZnxcuw2AYtHDG5CmibiC82ZvGwzWaEEj4";

async function postgrest(table, method, body, upsert = false) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${upsert ? "?on_conflict=id" : ""}`;
  const headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": upsert ? "resolution=merge-duplicates,return=representation" : "return=minimal"
  };

  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} on ${table}: ${text}`);
  }
  return res.json().catch(() => null);
}

const warehouses = [
  {
    id: "STR-LKO-01",
    name: "Lucknow Store (LKO-01)",
    code: "LKO-01",
    address: "ED-476, Sector-Q, Aliganj, Aliganj (Lucknow), Uttar Pradesh, India, 226024.",
    manager_name: "Abhay Verma",
    manager_phone: "+91 79919 90508",
    total_capacity: 2000,
  },
  {
    id: "WH-BOM-01",
    name: "Mumbai Central Hub",
    code: "BOM-HUB",
    address: "Unit 402, Kurla Industrial Estate, LBS Marg, Mumbai, MH 400070",
    manager_name: "Vikram Singhania",
    manager_phone: "+91 98201 44521",
    total_capacity: 2500,
  },
  {
    id: "WH-DEL-02",
    name: "Delhi NCR Depot",
    code: "DEL-DEPOT",
    address: "Plot 88, Udyog Vihar Phase IV, Gurugram, HR 122015",
    manager_name: "Neha Sharma",
    manager_phone: "+91 98110 33299",
    total_capacity: 2000,
  },
  {
    id: "WH-BLR-03",
    name: "Bengaluru Tech Park",
    code: "BLR-DEPOT",
    address: "Building 3B, Electronic City Phase 1, Hosur Road, Bengaluru, KA 560100",
    manager_name: "Karthik Rajan",
    manager_phone: "+91 99002 81726",
    total_capacity: 1800,
  },
  {
    id: "WH-HYD-04",
    name: "Hyderabad Logistics",
    code: "HYD-LOG",
    address: "Block 12, Hardware Park, Shamshabad, Hyderabad, TS 500024",
    manager_name: "Ananya Reddy",
    manager_phone: "+91 97014 99120",
    total_capacity: 1500,
  },
];

const suppliers = [
  {
    id: "SUP-001",
    name: "Esterline Bulk Refurb Solutions",
    company: "Esterline Bonaparte Corp Pte",
    contact_person: "Rajiv Deshmukh",
    email: "procurement@esterlinebonaparte.com",
    phone: "+91 98210 55432",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    gst_number: "27AABCE1234F1Z8",
    pan: "AAACE4419E",
    category: "Corporate ITAD & Liquidation",
    tier: "Tier 1 (Strategic Partner)",
    payment_terms: "Net 15",
    credit_limit: 5000000,
    outstanding_balance: 1250000,
    qc_pass_rate: 98.4,
    bank_name: "HDFC Bank BKC Mumbai",
    account_number: "98201948201920",
    ifsc_code: "HDFC0000128",
    upi_id: "esterline@hdfcbank",
    kyc_verified: true,
  },
  {
    id: "SUP-002",
    name: "Cashify B2B Marketplace",
    company: "Manak Waste Management Ltd",
    contact_person: "Arjun Mehta",
    email: "b2b@cashify.in",
    phone: "+91 98101 22849",
    address: "Cyber City, DLF Phase 2, Gurugram, Haryana 122002",
    gst_number: "06AAACM9981B1ZG",
    pan: "AAACM9981B",
    category: "Enterprise Buyback Aggregator",
    tier: "Tier 1 (Strategic Partner)",
    payment_terms: "Advance / Immediate",
    credit_limit: 3000000,
    outstanding_balance: 650000,
    qc_pass_rate: 96.2,
    bank_name: "ICICI Bank Cyber City",
    account_number: "002105018273",
    ifsc_code: "ICIC0000021",
    upi_id: "cashifyb2b@icici",
    kyc_verified: true,
  },
  {
    id: "SUP-003",
    name: "Global Trade Tech Dubai",
    company: "Global Trade Tech FZ-LLC",
    contact_person: "Tariq Mansoor",
    email: "sourcing@globaltradetech.ae",
    phone: "+971 4 883 9102",
    address: "Building 4, Dubai Airport Freezone (DAFZA), Dubai, UAE",
    gst_number: "EXPORT-NON-GST",
    pan: "PAN-INTL-99",
    category: "Regional Wholesale Stockist",
    tier: "Tier 2 (Preferred Wholesale)",
    payment_terms: "LC at Sight / Escrow",
    credit_limit: 8000000,
    outstanding_balance: 3100000,
    qc_pass_rate: 99.1,
    bank_name: "Emirates NBD DAFZA",
    account_number: "101928374619",
    ifsc_code: "EBILAEADXXX",
    upi_id: "globaltech@swift",
    kyc_verified: true,
  },
  {
    id: "SUP-004",
    name: "Recommerce Supply India",
    company: "EcoSmart Mobility Solutions Pvt Ltd",
    contact_person: "Vikas Bansal",
    email: "vikas@recommercesupply.com",
    phone: "+91 98860 11928",
    address: "Whitefield Main Road, Bengaluru, Karnataka 560066",
    gst_number: "29AADCE8831A1Z4",
    pan: "AADCE8831A",
    category: "Retail Franchise Sourcing",
    tier: "Tier 2 (Preferred Wholesale)",
    payment_terms: "Net 7",
    credit_limit: 2500000,
    outstanding_balance: 420000,
    qc_pass_rate: 93.8,
    bank_name: "Axis Bank Whitefield",
    account_number: "91802008172635",
    ifsc_code: "UTIB0000456",
    upi_id: "ecosmart@axis",
    kyc_verified: true,
  },
  {
    id: "SUP-005",
    name: "QuickTrade Mobiles Delhi",
    company: "QuickTrade Enterprises",
    contact_person: "Suresh Gupta",
    email: "suresh@quicktrademobiles.com",
    phone: "+91 98118 77654",
    address: "Gaffar Market, Karol Bagh, New Delhi, Delhi 110005",
    gst_number: "07AAHFG4412K1Z9",
    pan: "AAHFG4412K",
    category: "Regional Wholesale Stockist",
    tier: "Tier 3 (Spot Buy Partner)",
    payment_terms: "Immediate Cash / RTGS",
    credit_limit: 1000000,
    outstanding_balance: 0,
    qc_pass_rate: 89.5,
    bank_name: "Kotak Mahindra Bank Karol Bagh",
    account_number: "441209384756",
    ifsc_code: "KKBK0000192",
    upi_id: "quicktrade@kotak",
    kyc_verified: true,
  },
];

const whMap = {
  "Lucknow Store (LKO-01)": "STR-LKO-01",
  "Mumbai Central Hub": "WH-BOM-01",
  "Delhi NCR Depot": "WH-DEL-02",
  "Bengaluru Tech Park": "WH-BLR-03",
  "Hyderabad Logistics": "WH-HYD-04",
};

async function seed() {
  console.log("1. Seeding Warehouses...");
  await postgrest("warehouses", "POST", warehouses, true);
  console.log("✓ Warehouses seeded successfully!");

  console.log("2. Seeding Suppliers...");
  await postgrest("suppliers", "POST", suppliers, true);
  console.log("✓ Suppliers seeded successfully!");

  console.log("3. Reading 64 Authentic Handsets from mock-data.ts...");
  const mockPath = path.join(projectRoot, "src/lib/mock-data.ts");
  const content = fs.readFileSync(mockPath, "utf-8");
  
  const match = content.match(/export const initialDevices: Device\[] = (\[[\s\S]*?\n\];)/);
  if (!match) {
    console.error("Could not parse initialDevices from mock-data.ts");
    return;
  }
  
  let rawJson = match[1].trim().replace(/;$/, "");
  const rawDevices = eval(rawJson);
  console.log(`Parsed ${rawDevices.length} handsets.`);

  const mappedDevices = rawDevices.map((d) => ({
    id: d.id,
    brand: d.brand,
    model: d.model,
    storage: d.storage,
    ram: d.ram || null,
    colour: d.colour,
    imei1: d.imei1,
    imei2: d.imei2 || null,
    serial_number: d.serialNumber || null,
    sku: d.sku || null,
    battery_health: d.brand === "Apple" ? (d.batteryHealth || 90) : null,
    grade: d.grade || "A",
    status: d.status || "QC Pending",
    purchase_price: d.costs.purchasePrice,
    repair_cost: d.costs.repairCost || 0,
    testing_cost: d.costs.testingCost || 0,
    logistics_cost: d.costs.logisticsCost || 0,
    selling_price: d.costs.sellingPrice,
    purchase_date: d.purchaseDate || "2026-11-01",
    supplier_id: d.supplierId || "SUP-001",
    warehouse_id: whMap[d.warehouse] || "WH-BOM-01",
    images: d.images || [],
  }));

  console.log(`Uploading ${mappedDevices.length} devices in batches to Supabase...`);
  for (let i = 0; i < mappedDevices.length; i += 16) {
    const batch = mappedDevices.slice(i, i + 16);
    await postgrest("devices", "POST", batch, true);
    console.log(`✓ Batch ${Math.floor(i / 16) + 1} (${batch.length} phones) uploaded!`);
  }

  // Count total devices
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/devices?select=count`, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Range": "0-0",
      "Prefer": "count=exact"
    }
  });
  const countHeader = countRes.headers.get("content-range");
  console.log(`\n🎉 ALL DONE! Total live handsets in Supabase: ${countHeader}`);
}

seed().catch(console.error);
