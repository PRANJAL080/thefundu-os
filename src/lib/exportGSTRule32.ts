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
