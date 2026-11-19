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
    const cashAmt = isSplit && s.splitPayment ? s.splitPayment.cashAmount : (s.paymentMethod === "Cash" ? s.finalAmount : 0);
    const onlineAmt = isSplit && s.splitPayment ? s.splitPayment.onlineAmount : (s.paymentMethod !== "Cash" ? s.finalAmount : 0);
    const txn = s.splitPayment?.onlineTxnId || (s as any).paymentTxnId || "N/A";
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
