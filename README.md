# TheFundu Inventory OS — Frontend First Master Suite

**Enterprise Operating System for Refurbished & Second-Hand Smartphone Buying, Inspection, Servicing, and Commerce**

- **Parent Company:** Esterline Bonaparte Corporation Private Limited
- **Brand:** TheFundu
- **Website:** [thefundu.com](https://thefundu.com)
- **Architecture:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui design patterns, Lucide icons, Recharts, React Hook Form, and Zod.

---

## 🚀 Key Modules Built & Operational

1. **Dashboard Overview (`/` and `/overview`):**
   - 10 Enterprise KPI cards (Phones Purchased, Phones Sold, Available Stock, Reserved, QC Pending, Under Repair, Damaged, Total Inventory Value, Monthly Revenue, Net Profit).
   - Interactive charts for stock movement velocity (7-day trend), purchase vs sales financials, and brand-wise inventory concentration.
   - Live widgets for recent inbound consignments, recent customer orders, and low-stock alerts.
   - Date range filters (Today, Last 7 Days, Last 30 Days, This Month, Custom).

2. **Smartphone Inventory Management (`/inventory`):**
   - Serialised inventory table with ID, Image, Brand, Model, Storage, Colour, Dual IMEI, Battery Health %, Condition Grade, Purchase Cost, Selling Price, Status, Warehouse.
   - Full search, multi-filter (Brand, Grade, Status, Warehouse, Battery threshold), sorting, and pagination.
   - Bulk selection toolbar (Batch status update, Batch warehouse transfer, Bulk CSV export).
   - Import Excel / CSV modal with column mapping, sample preview, and auto-intake.
   - Sample CSV template generation & download.
   - 9-Tab Device Profile Drawer & dedicated route (`/inventory/[id]`):
     - Overview, Specifications, IMEI Details (CEIR / Sanchar Saathi clearance), Quality Check, Repair History, Purchase History, Sales History, Images, and Activity Timeline.

3. **Multi-Section Add New Phone Form (`/inventory/add`):**
   - Section A: Basic Information (Brand, Model, Storage, RAM, Colour).
   - Section B: Device Identification (IMEI 1, IMEI 2, Serial Number, SKU).
   - Section C: Device Condition & 10-Point Hardware Checkpoints.
   - Section D: Financial Landed Costs & Live Margin Calculator (Purchase + Repair + Testing + Logistics + Packaging = Total Landed Cost, Selling Price, Gross Profit, Margin %).
   - Section E: Inventory Classification (Supplier, Date, Warehouse, Grade, Status).
   - Section F: Media & Inspection Photo Upload Preview.
   - Validated with Zod and React Hook Form.

4. **Purchase Management (`/purchases`):**
   - Procurement order list with payment statuses (Paid, Partial, Pending), amounts, balance due, and delivery hubs.
   - "New Purchase Order" modal.
   - Realistic Tax Invoice preview modal.

5. **Stock Inward & Outward (`/stock-inward` & `/stock-outward`):**
   - Two separate dedicated ledgers for inflow (Purchase received, Customer return, Transfer received, Manual adjustment) and outflow (Sold, Supplier return, Transfer dispatched, Damaged write-off).
   - Modal dialogs to record new transactions into live state.

6. **13-Point Quality Check (`/quality-check`):**
   - Hardware diagnostic inspection suite: Display, Touchscreen, Battery Health, Face ID, Fingerprint, Cameras, Speakers, Microphone, Charging port, SIM / Cellular 5G, Wi-Fi, Bluetooth, and Physical Chassis.
   - Dynamic QC progress percentage, condition grade assignment (A+, A, B, C, D), inspector credentials, findings log, and Approve / Reject buttons.

7. **Hardware Repairs & Servicing (`/repairs`):**
   - Repair dashboard with active jobs, awaiting parts, completed, and parts spend metrics.
   - Job cards with technician assignment, component replacements, costs, and before/after inspection photos.
   - Modal to generate new repair job cards.

8. **Sales & Customer Orders (`/sales`):**
   - Orders pipeline with customer information, allocated IMEI, payment method, No-Cost EMI plans, warranty certificates, and delivery status milestones.
   - Official GST customer invoice preview modal.

9. **Supplier CRM (`/suppliers`):**
   - Vendor directory (Esterline Bulk Refurb, TheFundu Enterprise Sourcing, Global Trade Tech Dubai, Recommerce India), total purchases, outstanding balances, ratings, and profile modal.

10. **Customer CRM & Warranties (`/customers`):**
    - Client database with loyalty tiers (Platinum, Gold, Silver), lifetime value, active warranty countdowns, and return rate scoring.

11. **Multi-Warehouse Mesh (`/warehouses`):**
    - Regional hubs: Mumbai Central Hub, Delhi NCR Depot, Bengaluru Tech Park, and Hyderabad Logistics.
    - Capacity utilization meters, manager contacts, and inter-warehouse stock transfer modal.

12. **Pricing & Profit Intelligence (`/pricing-profit`):**
    - Landed cost breakdown ledger.
    - Interactive pricing simulator with live sliders for procurement base, repair allowance, testing, packaging, logistics, and target gross margin %.

13. **Executive Reports & Analytics (`/reports`):**
    - Reports across Stock Velocity, Sales, Purchases, Profit Intelligence, Repair Expenses, Brand Share, Warehouse Audits, and Technician Efficiency Scorecards.

14. **Products Catalog (`/products`):**
    - Standardized SKU catalog with demand indexes and available stock across variants.

15. **Accessories & Packaging Kits (`/accessories`):**
    - Refurbished chargers, braided cables, TheFundu eco unboxing boxes, and cases.

16. **Staff & Personnel (`/employees`):**
    - Internal engineer directory, roles, completed tasks, and onboarding modal.

17. **Notifications Center (`/notifications`):**
    - Operational alert feeds with severity filters and read state management.

18. **API & Webhook Management (`/api-management`):**
    - REST API secret key generator, documentation, and webhook schemas ready for Phase 2 backend integration.

19. **Settings & Entity Profile (`/settings`):**
    - Corporate profile (Esterline Bonaparte Corporation Private Limited), GSTIN, QC thresholds, default margins, and theme preferences.

20. **Returns & Refunds (`/returns`):**
    - RMA intake, 7-day money-back guarantee processing, and restock verifications.

---

## 🛠️ Quick Start Instructions

To run the application locally:

```bash
cd "C:\Users\asus\.gemini\antigravity\scratch\thefundu-inventory-os"

# Install dependencies (already installed via pnpm)
pnpm install

# Run the development server
pnpm dev

# Or build and start the production server
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
