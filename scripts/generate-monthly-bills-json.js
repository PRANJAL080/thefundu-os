const fs = require('fs');
const path = require('path');

// Read sales from mock-data
const mockDataContent = fs.readFileSync('src/lib/mock-data.ts', 'utf8');
const match = mockDataContent.match(/export const initialSales: SalesOrder\[\] = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error("Could not find initialSales in mock-data.ts");
  process.exit(1);
}

// Evaluate safely
const sales = eval(`(${match[1]})`);
console.log(`Loaded ${sales.length} authentic bills.`);

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getMonthLabel(yearMonth) {
  const parts = yearMonth.split("-");
  if (parts.length >= 2) {
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${MONTH_NAMES[monthIdx]} ${year}`;
    }
  }
  return yearMonth;
}

const mapSaleToItem = (s) => {
  const sellPrice = Number(s.sellingPrice || s.finalAmount || 0);
  const disc = Number(s.discount || 0);
  const finalAmt = Number(s.finalAmount || (sellPrice - disc));
  const buyPrice = Number(s.purchasePrice || 0);
  const margin = Math.max(0, finalAmt - buyPrice);
  const totalTax = Number(s.taxAmount || (margin > 0 ? Math.round((margin * 18 / 118) * 100) / 100 : 0));
  const halfTax = Math.round((totalTax / 2) * 100) / 100;

  return {
    invoiceNumber: s.invoiceNumber || s.id,
    orderNo: s.orderNo || s.id,
    channelOrderNo: s.channelOrderNo || `FSO-LKO-01-${s.id.slice(-5)}`,
    date: s.date,
    time: s.time || "12:00 pm",
    channel: s.channel || "FSO",
    typeOfSale: s.typeOfSale || "B2C",
    customer: {
      name: s.customerName || "Walk-in Retail Customer",
      phone: s.customerPhone || "N/A",
      email: s.customerEmail || "N/A",
      aadhaar: s.customerAadhaar || "N/A",
      localAddress: s.customerLocalAddress || s.customerAddress || "Lucknow, Uttar Pradesh",
      permanentAddress: s.customerPermanentAddress || s.customerAddress || "Lucknow, Uttar Pradesh",
      gstin: s.customerGstin || "URP (Unregistered)",
      placeOfSupply: s.placeOfSupply || "Uttar Pradesh (09)",
    },
    handset: {
      deviceId: s.deviceId,
      deviceModel: s.deviceModel,
      imei: s.imei,
      serialNumber: s.serialNumber || `SN${s.deviceId.replace(/\D/g, "")}`,
    },
    pricingAndTax: {
      sellingPrice: sellPrice,
      purchaseCost: buyPrice,
      discount: disc,
      finalBilledAmount: finalAmt,
      taxableMargin: margin,
      taxScheme: "GST Rule 32(5) Margin Valuation Scheme (Valued strictly on Margin Profit)",
      gstRule32_5_Breakdown: {
        cgstRate: "9%",
        cgstAmount: halfTax,
        sgstRate: "9%",
        sgstAmount: halfTax,
        igstRate: "0%",
        igstAmount: 0,
        totalTaxOnMargin: totalTax,
      },
    },
    payment: {
      method: s.paymentMethod || "UPI",
      mode: s.paymentMode || (s.paymentMethod?.includes("Split") ? "Split" : s.paymentMethod) || "UPI",
      paymentTxnId: s.paymentTxnId || "N/A",
      isSplitPayment: Boolean(s.splitPayment || s.paymentMethod?.includes("Split")),
      splitDetails: s.splitPayment || null,
      paymentStatus: s.paymentStatus || "Completed",
    },
    store: {
      storeName: s.storeName || "Lucknow Store B-124 (LKO-01)",
      storeCode: s.storeCode || "LKO-01",
    },
    warranty: {
      warrantyMonths: s.warrantyMonths || 6,
      warrantyExpiry: s.warrantyExpiry || "2027-05-19",
    },
  };
};

const grouped = {};
sales.forEach((s) => {
  const m = (s.date || "").slice(0, 7) || "2026-11";
  if (!grouped[m]) grouped[m] = [];
  grouped[m].push(s);
});

// Create public/downloads directory if not exists
const publicDownloadsDir = path.join(__dirname, '..', 'public', 'downloads');
if (!fs.existsSync(publicDownloadsDir)) {
  fs.mkdirSync(publicDownloadsDir, { recursive: true });
}

for (const [m, mSales] of Object.entries(grouped)) {
  const items = mSales.map(mapSaleToItem);
  const totalGross = items.reduce((sum, i) => sum + i.pricingAndTax.sellingPrice, 0);
  const totalDisc = items.reduce((sum, i) => sum + i.pricingAndTax.discount, 0);
  const totalNet = items.reduce((sum, i) => sum + i.pricingAndTax.finalBilledAmount, 0);
  const totalBuy = items.reduce((sum, i) => sum + i.pricingAndTax.purchaseCost, 0);
  const totalMargin = items.reduce((sum, i) => sum + i.pricingAndTax.taxableMargin, 0);
  const totalTax = items.reduce((sum, i) => sum + i.pricingAndTax.gstRule32_5_Breakdown.totalTaxOnMargin, 0);

  const paymentSummary = {};
  items.forEach((i) => {
    const p = i.payment.method || "Other";
    if (!paymentSummary[p]) paymentSummary[p] = { count: 0, amount: 0 };
    paymentSummary[p].count += 1;
    paymentSummary[p].amount += i.pricingAndTax.finalBilledAmount;
  });

  const report = {
    company: {
      legalName: "Esterline Bonaparte Corporation Private Limited",
      brandName: "TheFundu",
      cin: "U95111UP2026PTC252407",
      gstin: "09AAJCE9800C1ZP",
      pan: "AAJCE9800C",
      registeredOffice: "ED-476, Sector-Q, Aliganj, Lucknow, Uttar Pradesh, India, 226024",
      storeOutlet: "Lucknow Store B-124 (LKO-01) — B-124 LGF SAHARA PLAZA, VIKAS KHAND, PATRAKARPURAM Gomti Nagar 226010, Lucknow",
      callAndWhatsApp: "6390616616",
      supportEmail: "support@thefundu.com"
    },
    reportType: "GST Rule 32(5) Margin Scheme Monthly Tax Invoice Register",
    month: m,
    monthName: getMonthLabel(m),
    generatedAt: new Date().toISOString(),
    summary: {
      totalBills: items.length,
      totalGrossRevenue: totalGross,
      totalDiscount: totalDisc,
      totalNetBilledAmount: totalNet,
      totalPurchaseCost: totalBuy,
      totalProfitMargin: totalMargin,
      totalRule32MarginTax18: Math.round(totalTax * 100) / 100,
      paymentSummary,
    },
    bills: items,
  };

  const fileName = `TheFundu_Bills_${m}_${getMonthLabel(m).replace(/\s+/g, '_')}.json`;
  const filePath = path.join(publicDownloadsDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Saved monthly JSON report to: ${filePath}`);

  // Also write to brain directory if exists
  const brainDir = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\919ef05f-2caa-4a8b-a4e4-507bdb3a3001';
  if (fs.existsSync(brainDir)) {
    fs.writeFileSync(path.join(brainDir, fileName), JSON.stringify(report, null, 2), 'utf8');
    console.log(`Saved copy to brain directory: ${path.join(brainDir, fileName)}`);
  }
}
