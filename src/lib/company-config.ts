/**
 * Single Source of Truth for Esterline Bonaparte Corporation Private Limited & TheFundu
 * Official Legal, GST, CIN, Address & Sales Channel Configuration
 */

export const COMPANY_CONFIG = {
  // Legal Corporate Identity
  legalName: "Esterline Bonaparte Corporation Private Limited",
  brandName: "TheFundu",
  cin: "U95111UP2026PTC252407",
  gstin: "09AAJCE9800C1ZP",
  pan: "AAJCE9800C",
  stateCode: "09",
  stateName: "Uttar Pradesh",

  // Official Registered Office Address
  registeredAddress: "ED-476, Sector-Q, Aliganj, Aliganj (Lucknow), Uttar Pradesh, India, 226024.",
  
  // Active Primary Store & Experience Center
  primaryStore: {
    code: "LKO-01",
    name: "Lucknow Store (LKO-01)",
    address: "ED-476, Sector-Q, Aliganj, Lucknow, Uttar Pradesh 226024",
    city: "Lucknow",
    managerName: "Abhay Verma",
    phone: "+91 79919 90508",
  },

  // Contact Channels
  supportEmail: "support@thefundu.com",
  returnEmail: "return@thefundu.com",
  phone: "+91 6390616616",
  callAndWhatsApp: "+91 6390616616",
  tollFree: "Call & WhatsApp: 6390616616",
  website: "https://thefundu.com",

  // Standard Sales Channels & Mandatory Codes
  channels: [
    {
      code: "FSO",
      name: "Store Outlet",
      fullName: "Fundu Store Outlet (FSO)",
      description: "Retail walk-in store outlet and retail showroom counters",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    },
    {
      code: "ONS",
      name: "Online Store",
      fullName: "Online Store (ONS)",
      description: "Direct-to-consumer website, mobile app, and e-commerce marketplace sales",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    },
    {
      code: "FOR",
      name: "Repair & Service",
      fullName: "Fundu Outward Repair (FOR)",
      description: "Outward hardware servicing, replacement components & repair billing",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    },
    {
      code: "DS",
      name: "Doorstep Direct",
      fullName: "Doorstep Direct (DS)",
      description: "Home delivery, on-site buyback exchange & doorstep sales",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    },
  ] as const,

  // Types of Sales
  saleTypes: [
    {
      code: "B2C",
      name: "B2C (Retail Consumer / Walk-in)",
      description: "Retail individual consumer purchase with Rule 32(5) Margin invoice",
    },
    {
      code: "B2B",
      name: "B2B (Wholesale / Dealer)",
      description: "Business-to-business wholesale, re-commerce stockist & dealer bulk purchases",
    },
    {
      code: "Corporate",
      name: "Corporate / Institutional",
      description: "Enterprise employee fleet procurement & institutional supply",
    },
  ] as const,
};

export type SalesChannelCode = (typeof COMPANY_CONFIG.channels)[number]["code"];
export type SaleTypeCode = (typeof COMPANY_CONFIG.saleTypes)[number]["code"];

/**
 * Standard Legal Terms & Conditions printed on all customer tax invoices.
 * Formatted in authoritative legal English from board resolution & company policies.
 */
export const DEFAULT_INVOICE_TERMS: string[] = [
  "1. No Physical / Liquid Damage: Warranty does not cover physical breakage, screen crack, water damage, burn, or unauthorized repair.",
  "2. Original Bill Mandatory: Original tax invoice is strictly required for warranty claims. Without original bill, warranty claim will NOT be accepted.",
  "3. Lucknow Jurisdiction: All legal disputes are subject exclusively to Lucknow jurisdiction only.",
  "4. No Cash Refund: Goods once sold cannot be returned for cash refund. Billed under GST Rule 32(5) Margin Scheme.",
  "5. Support & Service: For warranty or service, visit TheFundu Store or Call / WhatsApp: +91 6390616616 (Mon-Sat, 10 AM - 8 PM).",
];

/**
 * Super Admin granular role-based permissions matrix
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    "overview",
    "inventory",
    "inventory_cost_view",
    "purchases",
    "stock_inward",
    "quality_check",
    "repairs",
    "spare_parts",
    "buyback",
    "invoice",
    "invoice_margin_breakdown",
    "ca_audit_export",
    "stock_outward",
    "sales",
    "returns",
    "day_end_closing",
    "stores",
    "vendors",
    "customers",
    "pricing_profit",
    "reports",
    "employees",
    "settings",
    "role_permissions",
  ],
  manager: [
    "overview",
    "inventory",
    "purchases",
    "stock_inward",
    "quality_check",
    "repairs",
    "spare_parts",
    "buyback",
    "invoice",
    "invoice_margin_breakdown",
    "stock_outward",
    "sales",
    "returns",
    "day_end_closing",
    "stores",
    "reports",
  ],
  cashier: [
    "inventory", // POS Mode: Retail selling price only, internal purchase costs masked
    "invoice",   // POS Mode: Selling price only, sourcing cost & margins hidden
    "sales",
    "returns",
    "verify",
  ],
  technician: [
    "quality_check",
    "repairs",
    "spare_parts",
    "verify",
  ],
};

/**
 * Initial Seeded Users for Enterprise ID/Password Authentication Gate
 */
export const INITIAL_USERS = [
  {
    id: "USR-001",
    name: "Abhay Verma",
    email: "admin@thefundu.com",
    password: "admin123",
    role: "admin" as const,
    storeCode: "LKO-01",
    storeName: "Lucknow Aliganj Flagship Store",
    phone: "+91 79919 90508",
    pin: "1234",
  },
  {
    id: "USR-002",
    name: "Store Head (Manager)",
    email: "manager@thefundu.com",
    password: "manager123",
    role: "manager" as const,
    storeCode: "LKO-01",
    storeName: "Lucknow Aliganj Flagship Store",
    phone: "+91 79919 90508",
    pin: "1234",
  },
  {
    id: "USR-003",
    name: "Rohan Gupta",
    email: "cashier@thefundu.com",
    password: "cashier123",
    role: "cashier" as const,
    storeCode: "LKO-01",
    storeName: "Lucknow Aliganj Flagship Store",
    phone: "+91 98390 12845",
    pin: "1234",
  },
  {
    id: "USR-004",
    name: "Suresh Rawat",
    email: "tech@thefundu.com",
    password: "tech123",
    role: "technician" as const,
    storeCode: "LKO-01",
    storeName: "Lucknow Aliganj Repair Bay",
    phone: "+91 97120 55431",
    pin: "1234",
  },
];
