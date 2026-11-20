/**
 * GST Rule 32(5) Margin Scheme CA Audit & GSTR-1 Excel/CSV Export Engine
 * Specifically designed for Chartered Accountants & GST Compliance.
 * 
 * Mandated under Rule 32(5) of Central Goods and Services Tax Rules, 2017:
 * "Where a taxable supply is provided by a person dealing in buying and 
 * selling of second hand goods... the value of supply shall be the 
 * difference between the selling price and the purchase price."
 */

import { Device, SalesOrder } from "./types";
import { COMPANY_CONFIG } from "./company-config";

export function exportGSTRule32AuditCSV(devices: Device[], filename = "TheFundu_GST_Rule_32_5_Margin_Report.csv") {
  // Column Headers for CA Audit
  const headers = [
    "Invoice No",
    "Invoice Date",
    "Place of Supply",
    "Customer Name",
    "Customer GSTIN",
    "Handset Brand",
    "Handset Model",
    "Storage",
    "Condition",
    "Primary IMEI",
    "Secondary IMEI",
    "Purchase Cost (X)",
    "Selling Price (Y)",
    "Margin / Taxable Base (Z = Y - X)",
    "CGST Rate",
    "CGST Amount (Rs)",
    "SGST Rate",
    "SGST Amount (Rs)",
    "IGST Rate",
    "IGST Amount (Rs)",
    "Total Tax on Margin (Rs)",
    "Net Invoice Value (Y)",
    "Valuation Rule",
    "Status"
  ];

  const rows = devices.map((dev, idx) => {
    const invNo = `INVMUM2600${String(idx + 1).padStart(3, "0")}`;
    const invDate = dev.purchaseDate || "2026-11-14";
    const pos = "Uttar Pradesh (09)";
    const customer = "Retail Walk-in Customer";
    const gstin = "URP (Unregistered)";
    
    const x = dev.costs.purchasePrice || 25000;
    const y = dev.costs.sellingPrice || 30000;
    const z = Math.max(0, y - x); // Taxable margin
    
    // Intra-state standard calculation (CGST 9% + SGST 9% = 18%)
    // Under Rule 32(5), tax is inclusive in the margin
    const totalTax = z > 0 ? Math.round((z * 18 / 118) * 100) / 100 : 0;
    const cgst = Math.round((totalTax / 2) * 100) / 100;
    const sgst = Math.round((totalTax - cgst) * 100) / 100;

    return [
      invNo,
      invDate,
      pos,
      `"${customer.replace(/"/g, '""')}"`,
      gstin,
      dev.brand,
      `"${dev.model}"`,
      dev.storage,
      "Certified Refurbished",
      `="${dev.imei1}"`, // Format as text formula so Excel does not convert 15 digits into scientific 3.54E+14
      dev.imei2 ? `="${dev.imei2}"` : '="N/A"',
      x.toFixed(2),
      y.toFixed(2),
      z.toFixed(2),
      "9.00%",
      cgst.toFixed(2),
      "9.00%",
      sgst.toFixed(2),
      "0.00%",
      "0.00",
      totalTax.toFixed(2),
      y.toFixed(2),
      "Rule 32(5) CGST (Margin Scheme)",
      dev.status
    ];
  });

  // Prepend UTF-8 BOM so Excel opens Hindi/Special chars and formatting flawlessly
  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export All Saved Tax Invoices with Fun Code, IMEI, Aadhaar, Addresses, and Payment Breakdown
 */
export function exportSavedBillsCSV(sales: SalesOrder[], filename = "TheFundu_Saved_Bills_Register.csv") {
  const headers = [
    "Invoice Number",
    "Invoice Date",
    "Fun Code / Device ID",
    "Handset Model",
    "Primary IMEI",
    "Serial Number",
    "Customer Name",
    "Customer Mobile",
    "Customer Aadhaar UID",
    "Local Address",
    "Permanent Address",
    "Customer GSTIN",
    "Selling Price (Rs)",
    "Discount (Rs)",
    "Final Billed Amount (Rs)",
    "Margin GST (18%)",
    "Payment Mode",
    "Payment Method",
    "Cash Amount (Rs)",
    "Online Amount (Rs)",
    "Txn ID / UTR",
    "Store Outlet",
    "Warranty Months",
    "Payment Status"
  ];

  const rows = sales.map((s) => {
    const isSplit = Boolean(s.splitPayment || s.paymentMethod?.includes("Split"));
    const cashAmt = isSplit && s.splitPayment
      ? Number(s.splitPayment.cashAmount ?? (s.splitPayment.mode1 === "Cash" ? s.splitPayment.amount1 : s.splitPayment.mode2 === "Cash" ? s.splitPayment.amount2 : s.splitPayment.amount1) ?? 0)
      : (s.paymentMethod === "Cash" ? s.finalAmount : 0);
    const onlineAmt = isSplit && s.splitPayment
      ? Number(s.splitPayment.onlineAmount ?? (s.splitPayment.mode1 !== "Cash" ? s.splitPayment.amount1 : s.splitPayment.amount2) ?? 0)
      : (s.paymentMethod !== "Cash" ? s.finalAmount : 0);
    const txn = s.splitPayment
      ? `Txn 1: ${s.splitPayment.txnId1 || (s.splitPayment.mode1 === "Cash" ? "Cash Desk" : "N/A")} | Txn 2: ${s.splitPayment.txnId2 || s.splitPayment.onlineTxnId || (s.splitPayment.mode2 === "Cash" ? "Cash Desk" : "N/A")}`
      : ((s as any).paymentTxnId || "N/A");
    const funCode = s.deviceId?.startsWith("Fun-") ? s.deviceId : `Fun-${s.deviceId?.replace(/\D/g, "") || "26000"}`;

    return [
      `"${s.invoiceNumber || s.id}"`,
      `"${s.date}"`,
      `"${funCode}"`,
      `"${(s.deviceModel || "").replace(/"/g, '""')}"`,
      `="${s.imei || "N/A"}"`,
      `"${s.serialNumber || "N/A"}"`,
      `"${(s.customerName || "").replace(/"/g, '""')}"`,
      `="${s.customerPhone || ""}"`,
      s.customerAadhaar ? `="${s.customerAadhaar}"` : '="N/A"',
      `"${(s.customerLocalAddress || s.customerAddress || "").replace(/"/g, '""')}"`,
      `"${(s.customerPermanentAddress || s.customerLocalAddress || s.customerAddress || "").replace(/"/g, '""')}"`,
      `"${s.customerGstin || "URP (Unregistered)"}"`,
      Number(s.sellingPrice || 0).toFixed(2),
      Number(s.discount || 0).toFixed(2),
      Number(s.finalAmount || 0).toFixed(2),
      Number(s.taxAmount || 0).toFixed(2),
      `"${s.paymentMethod || "UPI"}"`,
      `"${s.splitPayment?.onlineMode || s.paymentMethod || "Google Pay"}"`,
      cashAmt.toFixed(2),
      onlineAmt.toFixed(2),
      `"${txn}"`,
      `"${s.channelName || "Lucknow Flagship Store (LKO-01)"}"`,
      s.warrantyMonths || 6,
      `"${s.paymentStatus || "Completed"}"`
    ];
  });

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getMonthLabel(yearMonth: string): string {
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

export interface MonthlyBillExportItem {
  invoiceNumber: string;
  orderNo?: string;
  date: string;
  time?: string;
  channel?: string;
  typeOfSale?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    aadhaar: string;
    localAddress: string;
    permanentAddress: string;
    gstin: string;
    placeOfSupply: string;
  };
  handset: {
    deviceId: string;
    deviceModel: string;
    imei: string;
    serialNumber: string;
  };
  pricingAndTax: {
    sellingPrice: number;
    purchaseCost: number;
    discount: number;
    finalBilledAmount: number;
    taxableMargin: number;
    taxScheme: string;
    gstRule32_5_Breakdown: {
      cgstRate: string;
      cgstAmount: number;
      sgstRate: string;
      sgstAmount: number;
      igstRate: string;
      igstAmount: number;
      totalTaxOnMargin: number;
    };
  };
  payment: {
    method: string;
    mode: string;
    paymentTxnId: string;
    isSplitPayment: boolean;
    splitDetails?: any;
    paymentStatus: string;
  };
  store: {
    storeName: string;
    storeCode: string;
  };
  warranty: {
    warrantyMonths: number;
    warrantyExpiry?: string;
  };
}

export interface MonthWiseBillsReport {
  company: {
    legalName: string;
    cin: string;
    gstin: string;
    pan: string;
    registeredAddress: string;
    storeOutlet: string;
  };
  reportType: string;
  month: string;
  monthName: string;
  exportedAt: string;
  summary: {
    totalBills: number;
    totalGrossRevenue: number;
    totalDiscount: number;
    totalNetBilledAmount: number;
    totalPurchaseCost: number;
    totalProfitMargin: number;
    totalRule32Tax18: number;
    paymentSummary: Record<string, { count: number; amount: number }>;
  };
  bills: MonthlyBillExportItem[];
}

/**
 * Exports Bills grouped per month into structured JSON files and triggers direct download to laptop.
 */
export function exportMonthWiseBillsJSON(
  sales: SalesOrder[],
  selectedMonth: string = "all"
) {
  if (!sales || sales.length === 0) {
    alert("No bills available to export.");
    return;
  }

  const mapSaleToItem = (s: SalesOrder): MonthlyBillExportItem => {
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
        mode: (s as any).paymentMode || (s.paymentMethod?.includes("Split") ? "Split" : s.paymentMethod) || "UPI",
        paymentTxnId: (s as any).paymentTxnId || "N/A",
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

  const grouped: Record<string, SalesOrder[]> = {};
  sales.forEach((s) => {
    const m = (s.date || "").slice(0, 7) || "2026-11";
    if (!grouped[m]) grouped[m] = [];
    grouped[m].push(s);
  });

  const availableMonths = Object.keys(grouped).sort();

  if (selectedMonth !== "all" && grouped[selectedMonth]) {
    const monthSales = grouped[selectedMonth];
    const items = monthSales.map(mapSaleToItem);
    const totalGross = items.reduce((sum, i) => sum + i.pricingAndTax.sellingPrice, 0);
    const totalDisc = items.reduce((sum, i) => sum + i.pricingAndTax.discount, 0);
    const totalNet = items.reduce((sum, i) => sum + i.pricingAndTax.finalBilledAmount, 0);
    const totalBuy = items.reduce((sum, i) => sum + i.pricingAndTax.purchaseCost, 0);
    const totalMargin = items.reduce((sum, i) => sum + i.pricingAndTax.taxableMargin, 0);
    const totalTax = items.reduce((sum, i) => sum + i.pricingAndTax.gstRule32_5_Breakdown.totalTaxOnMargin, 0);

    const paymentSummary: Record<string, { count: number; amount: number }> = {};
    items.forEach((i) => {
      const p = i.payment.method || "Other";
      if (!paymentSummary[p]) paymentSummary[p] = { count: 0, amount: 0 };
      paymentSummary[p].count += 1;
      paymentSummary[p].amount += i.pricingAndTax.finalBilledAmount;
    });

    const report: MonthWiseBillsReport = {
      company: {
        legalName: COMPANY_CONFIG.legalName,
        cin: COMPANY_CONFIG.cin,
        gstin: COMPANY_CONFIG.gstin,
        pan: COMPANY_CONFIG.pan,
        registeredAddress: COMPANY_CONFIG.registeredAddress,
        storeOutlet: `${COMPANY_CONFIG.primaryStore.name} — ${COMPANY_CONFIG.primaryStore.address}`,
      },
      reportType: "GST Rule 32(5) Monthly Tax Invoice Register",
      month: selectedMonth,
      monthName: getMonthLabel(selectedMonth),
      exportedAt: new Date().toISOString(),
      summary: {
        totalBills: items.length,
        totalGrossRevenue: totalGross,
        totalDiscount: totalDisc,
        totalNetBilledAmount: totalNet,
        totalPurchaseCost: totalBuy,
        totalProfitMargin: totalMargin,
        totalRule32Tax18: Math.round(totalTax * 100) / 100,
        paymentSummary,
      },
      bills: items,
    };

    const fileName = `TheFundu_Bills_${selectedMonth}_(${getMonthLabel(selectedMonth).replace(/\s+/g, "_")}).json`;
    downloadJSON(report, fileName);
  } else {
    const allMonthsData: Record<string, any> = {};
    availableMonths.forEach((m) => {
      const monthSales = grouped[m];
      const items = monthSales.map(mapSaleToItem);
      const totalNet = items.reduce((sum, i) => sum + i.pricingAndTax.finalBilledAmount, 0);
      const totalTax = items.reduce((sum, i) => sum + i.pricingAndTax.gstRule32_5_Breakdown.totalTaxOnMargin, 0);

      allMonthsData[m] = {
        month: m,
        monthName: getMonthLabel(m),
        totalBills: items.length,
        totalRevenue: totalNet,
        totalMarginTax: Math.round(totalTax * 100) / 100,
        bills: items,
      };
    });

    const masterReport = {
      company: {
        legalName: COMPANY_CONFIG.legalName,
        cin: COMPANY_CONFIG.cin,
        gstin: COMPANY_CONFIG.gstin,
        pan: COMPANY_CONFIG.pan,
        registeredAddress: COMPANY_CONFIG.registeredAddress,
      },
      reportType: "TheFundu Multi-Month Consolidated Bills Register",
      exportedAt: new Date().toISOString(),
      totalMonthsCount: availableMonths.length,
      availableMonths,
      totalBillsAllMonths: sales.length,
      months: allMonthsData,
    };

    downloadJSON(masterReport, "TheFundu_Bills_All_Months_Consolidated.json");
  }
}

function downloadJSON(data: any, fileName: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
