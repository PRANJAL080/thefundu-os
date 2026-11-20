"use client";

import React, { useMemo } from "react";
import { Device, SalesOrder, SalesChannelCode, SaleTypeCode, Warehouse } from "@/lib/types";
import { COMPANY_CONFIG, DEFAULT_INVOICE_TERMS } from "@/lib/company-config";
import { formatDate } from "@/lib/utils";
import { BarcodeSVG } from "@/components/common/BarcodeSVG";

export interface CompanyInvoiceSheetProps {
  device?: Device | null;
  order?: SalesOrder | null;
  selectedStore?: Warehouse | null;
  customTerms?: string[];
  customCompanyConfig?: any;
  customCustomer?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    localAddress?: string;
    permanentAddress?: string;
    aadhaar?: string;
    gstin?: string;
    placeOfSupply?: string;
  };
  financials?: {
    purchasePrice?: number; // X (Internal Only - STRICTLY NOT PRINTED ON INVOICE)
    sellingPrice?: number;  // Y
    discount?: number;      // D
    taxMode?: "inclusive" | "exclusive";
  };
  paymentInfo?: {
    method?: string;
    mode?: string;
    txnId?: string;
    gatewayTxnId?: string;
    splitPayment?: {
      cashAmount?: number;
      onlineAmount?: number;
      onlineMode?: string;
      onlineTxnId?: string;
      mode1?: string;
      method1?: string;
      amount1?: number;
      txnId1?: string;
      mode2?: string;
      method2?: string;
      amount2?: number;
      txnId2?: string;
    };
  };
  channel?: SalesChannelCode;
  typeOfSale?: SaleTypeCode;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceTime?: string;
  channelOrderNo?: string;
  orderNo?: string;
  warrantyDays?: number;
}

// Official Round Blue Seal & Corporate Stamp (Compact, 100% Contained in Circle - No Individual Name)
function CompanyStamp() {
  return (
    <div className="relative w-20 h-20 mx-auto flex items-center justify-center select-none pointer-events-none my-1">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full text-blue-800 dark:text-blue-700 transform -rotate-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Top Arc for Company Name: clockwise along upper circular ring */}
          <path
            id="stamp-top-arc-path"
            d="M 16.5,60 A 43.5,43.5 0 0,1 103.5,60"
            fill="none"
          />
          {/* Bottom Arc for Location: curves along lower circular ring */}
          <path
            id="stamp-bot-arc-path"
            d="M 19,60 A 41,41 0 0,0 101,60"
            fill="none"
          />
        </defs>

        {/* Outer Dashed Border */}
        <circle
          cx="60"
          cy="60"
          r="57"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeDasharray="3.5 1.5"
          opacity="0.9"
        />

        {/* Outer Solid Ring */}
        <circle
          cx="60"
          cy="60"
          r="52.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.95"
        />

        {/* Inner Solid Circular Boundary */}
        <circle
          cx="60"
          cy="60"
          r="33.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.9"
        />
        {/* Innermost Dotted Ring */}
        <circle
          cx="60"
          cy="60"
          r="30.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 1"
          opacity="0.75"
        />

        {/* Top Curved Text - Follows circle radius 43.5 perfectly inside the ring */}
        <text
          fontSize="5.2"
          fontWeight="900"
          letterSpacing="0.4"
          fill="currentColor"
        >
          <textPath href="#stamp-top-arc-path" startOffset="50%" textAnchor="middle">
            ★ ESTERLINE BONAPARTE CORP PVT LTD ★
          </textPath>
        </text>

        {/* Bottom Curved Text - Follows circle radius 41 perfectly inside the ring */}
        <text
          fontSize="4.8"
          fontWeight="800"
          letterSpacing="0.5"
          fill="currentColor"
        >
          <textPath href="#stamp-bot-arc-path" startOffset="50%" textAnchor="middle">
            ★ LUCKNOW • UTTAR PRADESH ★
          </textPath>
        </text>

        {/* Center Details - Strictly inside center circle (radius 30.5) */}
        <text
          x="60"
          y="47"
          textAnchor="middle"
          fontSize="6"
          fontWeight="900"
          fill="currentColor"
        >
          ★ ★ ★
        </text>

        <text
          x="60"
          y="57"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          letterSpacing="1"
          fill="currentColor"
        >
          OFFICIAL
        </text>

        <text
          x="60"
          y="67"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          letterSpacing="1.2"
          fill="currentColor"
        >
          SEAL
        </text>

        <text
          x="60"
          y="75"
          textAnchor="middle"
          fontSize="4.2"
          fontWeight="bold"
          letterSpacing="0.6"
          fill="currentColor"
        >
          CERTIFIED
        </text>
      </svg>
    </div>
  );
}

// Convert numbers to Indian Rupees in words
function numberToWords(num: number): string {
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ",
    "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const nVal = Math.round(num);
  if (nVal === 0) return "Zero Rupees Only";
  const n = ("000000000" + nVal).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return `${num} Rupees Only`;

  let str = "";
  str += n[1] != "00" ? (a[Number(n[1])] || b[Number(n[1][0])] + " " + a[Number(n[1][1])]) + "Crore " : "";
  str += n[2] != "00" ? (a[Number(n[2])] || b[Number(n[2][0])] + " " + a[Number(n[2][1])]) + "Lakh " : "";
  str += n[3] != "00" ? (a[Number(n[3])] || b[Number(n[3][0])] + " " + a[Number(n[3][1])]) + "Thousand " : "";
  str += n[4] != "0" ? (a[Number(n[4])] || b[Number(n[4][0])] + " " + a[Number(n[4][1])]) + "Hundred " : "";
  str += n[5] != "00" ? ((str != "") ? "and " : "") + (a[Number(n[5])] || b[Number(n[5][0])] + " " + a[Number(n[5][1])]) + "Rupees Only" : "Rupees Only";
  return str.trim();
}

export function CompanyInvoiceSheet({
  device,
  order,
  selectedStore,
  customTerms,
  customCompanyConfig,
  customCustomer,
  financials,
  paymentInfo,
  channel: customChannel,
  typeOfSale: customTypeOfSale,
  invoiceNumber: customInvoiceNumber,
  invoiceDate: customInvoiceDate,
  invoiceTime: customInvoiceTime,
  channelOrderNo: customChannelOrderNo,
  orderNo: customOrderNo,
  warrantyDays = 180,
}: CompanyInvoiceSheetProps) {
  // Serial extraction (e.g. Fun-26001 -> 26001)
  const rawId = device?.id ? device.id.replace("Fun-", "").replace("TFD-", "") : "26001";
  
  // Dynamic Company Configuration
  const companyLegalName = customCompanyConfig?.companyLegalName || customCompanyConfig?.legalName || COMPANY_CONFIG.legalName;
  const companyCin =
    (customCompanyConfig?.cin && String(customCompanyConfig.cin).trim())
      ? String(customCompanyConfig.cin).trim()
      : (COMPANY_CONFIG.cin || "U95111UP2026PTC252407");
  const companyGstin = customCompanyConfig?.gstin || COMPANY_CONFIG.gstin;
  const companyPan = customCompanyConfig?.pan || COMPANY_CONFIG.pan;
  const companyRegisteredAddress = customCompanyConfig?.registeredAddress || COMPANY_CONFIG.registeredAddress;
  const companyStateName = customCompanyConfig?.stateName || COMPANY_CONFIG.stateName;
  const companyStateCode = customCompanyConfig?.stateCode || COMPANY_CONFIG.stateCode;
  const companySupportEmail = customCompanyConfig?.supportEmail || COMPANY_CONFIG.supportEmail || "support@thefundu.com";
  const companyCallWhatsApp = customCompanyConfig?.callAndWhatsApp || customCompanyConfig?.phone || "6390616616";

  // Active Store Outlet (Dynamic multi-store support)
  const store = selectedStore || COMPANY_CONFIG.primaryStore;
  const storeCode = store.code || "LKO-01";
  const cleanStoreCode = storeCode.replace(/-/g, "");
  const storeName = store.name || "Lucknow Aliganj Flagship Store (LKO-01)";
  const storeAddress = store.address || companyRegisteredAddress;
  const storePhone = (store as any).managerPhone || (store as any).phone || COMPANY_CONFIG.phone;
  const displayStoreLocation = storeName.includes(storeCode) ? storeName : `${storeName} (${storeCode})`;

  // Active Sales Channel (Default FSO = Outlet)
  const activeChannelCode: SalesChannelCode =
    customChannel || order?.channel || "FSO";

  // Active Type of Sales (Default B2C)
  const activeTypeOfSale: SaleTypeCode =
    customTypeOfSale || order?.typeOfSale || "B2C";

  // Systematic Sequential Order Number: TFD-{CHANNEL}-2611-{RAW_ID}
  const orderNo =
    customOrderNo ||
    order?.orderNo ||
    `TFD-${activeChannelCode}-2611-${rawId}`;

  // Systematic Channel Reference with Store Code
  const channelOrderNo =
    customChannelOrderNo ||
    order?.channelOrderNo ||
    `#${activeChannelCode}-${storeCode}-${rawId}`;

  // Systematic Invoice Number: INV{STORE_CODE}2611-{RAW_ID}
  const invoiceNumber =
    customInvoiceNumber ||
    order?.invoiceNumber ||
    `INV${cleanStoreCode}2611-${rawId}`;

  // Date & Time formatted as "19:Nov:2026" and "05:47 PM"
  const today = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDefaultDate = `${String(today.getDate()).padStart(2, "0")}:${months[today.getMonth()]}:${today.getFullYear()}`;
  const formattedDefaultTime = today.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const invoiceDate = customInvoiceDate || (order?.date ? (order.date.includes(":") && !order.date.includes("-") ? order.date : formatDate(order.date)) : formattedDefaultDate);
  const invoiceTime = customInvoiceTime || order?.time || formattedDefaultTime;

  // Effective Terms & Conditions in Legal English
  const effectiveTerms = customTerms && customTerms.length > 0 ? customTerms : DEFAULT_INVOICE_TERMS;

  // Customer Data
  const customerName = customCustomer?.name?.trim() || order?.customerName?.trim() || "Retail Customer";
  const customerPhone = customCustomer?.phone?.trim() || order?.customerPhone?.trim() || "";
  const customerEmail = customCustomer?.email?.trim() || order?.customerEmail?.trim() || "";
  const customerLocalAddress =
    customCustomer?.localAddress?.trim() ||
    order?.customerLocalAddress?.trim() ||
    customCustomer?.address?.trim() ||
    order?.customerAddress?.trim() ||
    "Lucknow, Uttar Pradesh";
  const customerPermanentAddress =
    customCustomer?.permanentAddress?.trim() ||
    order?.customerPermanentAddress?.trim() ||
    customerLocalAddress;
  const customerAddress = customerLocalAddress;
  const customerGstin = customCustomer?.gstin || order?.customerGstin || "URP (Unregistered)";
  const customerAadhaar =
    customCustomer?.aadhaar ||
    order?.customerAadhaar ||
    "";
  const placeOfSupply = customCustomer?.placeOfSupply || order?.placeOfSupply || "Uttar Pradesh (09)";

  // Phone Specifications - STRICTLY WITHOUT GRADING (No A+, No Grade tags)
  const brand = device?.brand || "Apple";
  const model = device?.model || "iPhone 15 Pro";
  const storage = device?.storage || "128 GB";
  const colour = device?.colour || "Deep Blue";
  const barcode = device?.sku || `TFD${rawId}LKO`;
  const imei1 = device?.imei1 || order?.imei || "359078245961126";
  const serialNo = device?.serialNumber || `SN${rawId}`;

  // Description of Goods: Always includes "Refurbished", strictly NO grading tags (no A+, Grade A, etc.)
  const goodsDescription = useMemo(() => {
    if (device) {
      const cleanBrand = device.brand || "Apple";
      const cleanModel = (device.model || "iPhone")
        .replace(/\b(Refurbished|Grade\s*[A-D]\+?|A\+|B\+|B|C|D|Scrap)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      const storageStr = device.storage && !cleanModel.includes(device.storage) ? `(${device.storage})` : "";
      const cleanColour = device.colour && device.colour !== "Default Edition" ? device.colour : "";
      const parts = [cleanBrand, cleanModel, storageStr, "Refurbished", cleanColour].filter(Boolean);
      return parts.join(" ").replace(/\s+/g, " ").trim();
    }
    if (order?.deviceModel) {
      let desc = order.deviceModel
        .replace(/\b(Grade\s*[A-D]\+?|A\+|B\+|B|C|D|Scrap)\b/gi, "")
        .replace(/-\s*$/, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!desc.toLowerCase().includes("refurbished")) {
        desc = `${desc} Refurbished`;
      }
      return desc.replace(/\s+/g, " ").trim();
    }
    return `${brand} ${model} (${storage}) Refurbished ${colour}`.trim();
  }, [device, order, brand, model, storage, colour]);

  // -------------------------------------------------------------
  // RULE 32(5) MARGIN SCHEME TAX LOGIC:
  // Purchase Price = X (INTERNAL ONLY - STRICTLY HIDDEN ON BILL!)
  // Selling Price = Y
  // Discount = D
  // Final Selling Price = Y - D
  // Margin (Profit) = Z = max(0, (Y - D) - X)
  // GST 18% is applied ON MARGIN (Z)!
  // -------------------------------------------------------------
  const purchasePriceX = financials?.purchasePrice !== undefined 
    ? financials.purchasePrice 
    : (device?.costs.purchasePrice || 25000); // Internal buy cost X

  const sellingPriceY = financials?.sellingPrice !== undefined 
    ? financials.sellingPrice 
    : (Number(order?.sellingPrice) || Number(device?.costs.sellingPrice) || 30000); // Customer sell price Y

  const discountD = financials?.discount !== undefined 
    ? financials.discount 
    : (Number(order?.discount) || 0);

  const finalAmount = Math.max(0, sellingPriceY - discountD);
  const profitMarginZ = Math.max(0, finalAmount - purchasePriceX);

  const taxMode = financials?.taxMode || "inclusive";

  let totalTax = 0;
  let marginCgst = 0;
  let marginSgst = 0;
  let marginIgst = 0;

  if (profitMarginZ > 0) {
    if (taxMode === "inclusive") {
      // 18% tax included in margin: Tax = Z * 18 / 118
      totalTax = Math.round((profitMarginZ * 18 / 118) * 100) / 100;
    } else {
      // 18% tax added on margin: Tax = Z * 0.18
      totalTax = Math.round((profitMarginZ * 0.18) * 100) / 100;
    }

    // Split 9% CGST + 9% SGST for intra-state supply (Uttar Pradesh 09)
    marginCgst = Math.round((totalTax / 2) * 100) / 100;
    marginSgst = Math.round((totalTax - marginCgst) * 100) / 100;
    marginIgst = 0.00;
  }

  // Payment Details
  const paymentMethod = paymentInfo?.method || order?.paymentMethod || "Google Pay";
  const paymentMode = paymentInfo?.mode || (order?.splitPayment ? "Split" : "UPI");
  const txnId = paymentInfo?.txnId || `TXN${rawId}LKO982`;

  const splitPaymentData = paymentInfo?.splitPayment || order?.splitPayment;
  const isSplitPayment = Boolean(
    splitPaymentData &&
      ((splitPaymentData.amount1 !== undefined && splitPaymentData.amount1 > 0) ||
       (splitPaymentData.amount2 !== undefined && splitPaymentData.amount2 > 0) ||
       (splitPaymentData.cashAmount !== undefined && splitPaymentData.cashAmount > 0) ||
       (splitPaymentData.onlineAmount !== undefined && splitPaymentData.onlineAmount > 0))
  ) || (paymentMode && paymentMode.toLowerCase().includes("split"));

  // Universal Part 1 & Part 2 Dual Payment Breakdown
  const part1Mode = splitPaymentData?.mode1 || (splitPaymentData?.cashAmount !== undefined && splitPaymentData?.cashAmount > 0 ? "Cash Desk" : "UPI");
  const part1Method = splitPaymentData?.method1 || (part1Mode === "Cash Desk" ? "Cash on Counter" : "Google Pay");
  const part1Txn = splitPaymentData?.txnId1 || (part1Mode.toLowerCase().includes("cash") ? "Store Cash Counter" : `TXN${rawId}-1`);
  const part1Amount = Number(splitPaymentData?.amount1 ?? splitPaymentData?.cashAmount ?? Math.round(finalAmount / 2));

  const part2Mode = splitPaymentData?.mode2 || (splitPaymentData?.onlineMode ? "UPI / Online" : "Card");
  const part2Method = splitPaymentData?.method2 || splitPaymentData?.onlineMode || "Credit / Debit Card";
  const part2Txn = splitPaymentData?.txnId2 || (part2Mode.toLowerCase().includes("cash") ? "Store Cash Counter" : txnId || `TXN${rawId}-2`);
  const part2Amount = Number(splitPaymentData?.amount2 ?? splitPaymentData?.onlineAmount ?? Math.max(0, finalAmount - part1Amount));

  return (
    <div
      className="bg-white text-black p-4 sm:p-8 print:p-0 print:m-0 w-full max-w-[850px] mx-auto text-[10px] leading-normal select-text"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#000000",
      }}
    >
      {/* SECTION 1: CLEAN CORPORATE HEADER (BORDERLESS & LINE-FREE) */}
      <div className="flex justify-between items-start pb-3 gap-6">
        {/* Left: Brand & Supplier Details */}
        <div className="w-[60%] space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-black">TheFundu</h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800">
              Tax Invoice
            </span>
          </div>
          <p className="font-bold text-[11px] text-neutral-900 leading-tight">
            {companyLegalName}
          </p>
          <p className="text-[8.5px] text-neutral-600 leading-tight">
            <strong>Registered Office:</strong> {companyRegisteredAddress}
          </p>
          <p className="text-[8.5px] text-neutral-700 leading-tight">
            <strong>Store Outlet:</strong> <span className="font-semibold text-black">{storeName}</span> — {storeAddress}
          </p>
          <p className="text-[8.5px] text-neutral-700 font-mono">
            <strong>GSTIN:</strong> {companyGstin} &nbsp;|&nbsp; <strong>CIN:</strong> {companyCin} &nbsp;|&nbsp; <strong>PAN:</strong> {companyPan}
          </p>
        </div>

        {/* Right: Invoice Metadata */}
        <div className="w-[40%] text-right space-y-1">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-black">
              TAX INVOICE
            </h1>
            <p className="text-[8.5px] font-bold uppercase tracking-widest text-neutral-500">
              Original for Recipient
            </p>
          </div>
          <div className="text-[9px] space-y-0.5 pt-1 text-neutral-700">
            <div>
              Invoice Number: <strong className="font-mono text-black text-[10.5px]">{invoiceNumber}</strong>
            </div>
            <div>
              Date &amp; Time: <strong className="text-black">{invoiceDate}{invoiceTime ? ` • ${invoiceTime}` : ""}</strong>
            </div>
            <div>
              Place of Supply: <strong className="text-black">{companyStateName} ({companyStateCode})</strong>
            </div>
            <div>
              Channel: <strong className="text-black">{activeTypeOfSale}</strong> ({activeChannelCode})
            </div>
          </div>
        </div>
      </div>

      {/* SUBTLE HORIZONTAL DIVIDER */}
      <div className="border-b border-neutral-300 my-2.5" />

      {/* SECTION 2: BUYER & DELIVERY DETAILS (CLEAN 2-COLUMN, NO BOXES) */}
      <div className="flex justify-between items-start text-[9px] py-1 gap-6">
        {/* Bill To */}
        <div className="w-1/2 space-y-0.5">
          <p className="font-extrabold uppercase text-[9.5px] tracking-wider text-neutral-500 mb-1">
            Billed To (Buyer Details)
          </p>
          <p className="font-bold text-[12px] text-black">
            {customerName}
          </p>
          <p className="text-neutral-700">
            <strong>Mobile:</strong> <span className="font-semibold text-black">{customerPhone}</span>
            {customerEmail ? <span> &nbsp;|&nbsp; <strong>Email:</strong> {customerEmail}</span> : null}
          </p>
          {customerAadhaar ? (
            <p className="font-mono font-bold text-black pt-0.5">
              <span className="font-sans font-semibold text-neutral-600">KYC NO (Aadhaar):</span> {customerAadhaar}
            </p>
          ) : null}
          <p className="text-neutral-700 pt-0.5 leading-snug">
            <strong>Local Address:</strong> {customerLocalAddress}
          </p>
          {customerPermanentAddress && customerPermanentAddress !== customerLocalAddress ? (
            <p className="text-neutral-700 leading-snug">
              <strong>Permanent Address:</strong> {customerPermanentAddress}
            </p>
          ) : null}
          <p className="text-neutral-600 pt-0.5">
            <strong>GSTIN:</strong> {customerGstin} &nbsp;|&nbsp; <strong>State of Supply:</strong> {placeOfSupply}
          </p>
        </div>

        {/* Ship To */}
        <div className="w-1/2 space-y-0.5">
          <p className="font-extrabold uppercase text-[9.5px] tracking-wider text-neutral-500 mb-1">
            Shipped To (Delivery Destination)
          </p>
          <p className="font-bold text-[12px] text-black">
            {customerName}
          </p>
          <p className="text-neutral-700">
            <strong>Mobile:</strong> <span className="font-semibold text-black">{customerPhone}</span>
          </p>
          {customerAadhaar ? (
            <p className="font-mono text-neutral-800 pt-0.5">
              <span className="font-sans text-neutral-600">KYC NO:</span> {customerAadhaar}
            </p>
          ) : null}
          <p className="text-neutral-700 pt-0.5 leading-snug">
            <strong>Delivery Address:</strong> {customerLocalAddress}
          </p>
        </div>
      </div>

      {/* SUBTLE HORIZONTAL DIVIDER */}
      <div className="border-b border-neutral-300 my-2.5" />

      {/* SECTION 3: ITEMS TABLE (CLEAN, NO VERTICAL COLUMN LINES) */}
      <div className="py-1">
        <table className="w-full text-[9px] border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-neutral-900 font-bold uppercase text-[8.5px]">
              <th className="py-1.5 px-1 text-left w-[4%]">#</th>
              <th className="py-1.5 px-1 text-left w-[42%]">Description of Goods</th>
              <th className="py-1.5 px-1 text-center w-[12%]">Product Type</th>
              <th className="py-1.5 px-1 text-center w-[10%]">HSN / SAC</th>
              <th className="py-1.5 px-1 text-center w-[14%]">Warranty</th>
              <th className="py-1.5 px-1 text-center w-[6%]">Qty</th>
              <th className="py-1.5 px-1 text-right w-[12%]">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-200 text-[9.5px] align-top">
              <td className="py-2 px-1 font-semibold">1</td>
              <td className="py-2 px-1">
                <p className="font-bold text-[10.5px] text-black">
                  {goodsDescription}
                </p>
                <p className="font-mono text-[8px] text-neutral-600 mt-0.5">
                  IMEI: {imei1} &nbsp;|&nbsp; Serial: {serialNo} &nbsp;|&nbsp; Barcode: {barcode}
                </p>
              </td>
              <td className="py-2 px-1 text-center text-neutral-700">
                Refurbished Mobiles
              </td>
              <td className="py-2 px-1 text-center font-mono text-neutral-700">
                851712
              </td>
              <td className="py-2 px-1 text-center font-bold text-black">
                {warrantyDays} Days (TheFundu)
              </td>
              <td className="py-2 px-1 text-center font-bold">
                1
              </td>
              <td className="py-2 px-1 text-right font-bold font-mono">
                {sellingPriceY.toFixed(2)}
              </td>
            </tr>

            {/* Subtotal */}
            <tr className="border-b border-neutral-100 text-[9px]">
              <td colSpan={6} className="py-1 px-1 text-right font-bold text-neutral-700 pr-3">
                Sub Total (Before Tax &amp; Discount):
              </td>
              <td className="py-1 px-1 text-right font-bold font-mono">
                {sellingPriceY.toFixed(2)}
              </td>
            </tr>

            {/* Total GST on Margin (Rule 32(5)) */}
            <tr className="border-b border-neutral-100 text-[9px]">
              <td colSpan={6} className="py-1 px-1 text-right text-neutral-700 pr-3">
                Total GST on Margin (Rule 32(5)):
              </td>
              <td className="py-1 px-1 text-right font-semibold font-mono text-neutral-800">
                {totalTax.toFixed(2)}
              </td>
            </tr>

            {/* Discount (if applicable) */}
            {discountD > 0 && (
              <tr className="border-b border-neutral-100 text-[9px]">
                <td colSpan={6} className="py-1 px-1 text-right text-neutral-700 pr-3">
                  Promotional Discount:
                </td>
                <td className="py-1 px-1 text-right font-bold font-mono text-rose-600">
                  -{discountD.toFixed(2)}
                </td>
              </tr>
            )}

            {/* Grand Total */}
            <tr className="border-t-2 border-black text-black">
              <td colSpan={6} className="py-2 px-1 text-right font-black uppercase text-[11px] pr-3">
                Grand Total (Billed Amount):
              </td>
              <td className="py-2 px-1 text-right font-black font-mono text-[13px]">
                ₹{finalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 4: AMOUNT IN WORDS */}
      <div className="py-1.5 px-2 bg-neutral-50 border-l-2 border-black my-2 text-[9px] flex items-center justify-between">
        <span>
          <strong>Amount in words:</strong> {numberToWords(finalAmount)}
        </span>
      </div>

      {/* SECTION 5: PAYMENT & MARGIN TAX SUMMARY (CLEAN 2-COLUMN, NO BOXES) */}
      <div className="flex justify-between items-start text-[8.5px] py-2 gap-6">
        {/* Left: Payment Details */}
        <div className="w-1/2 space-y-1">
          <p className="font-extrabold uppercase text-[9px] tracking-wider text-neutral-600 mb-1">
            Payment Summary
          </p>
          {isSplitPayment ? (
            <div className="space-y-1 bg-neutral-50/70 p-2 rounded">
              <div className="flex justify-between text-neutral-800">
                <span>{part1Method} ({part1Mode}):</span>
                <span className="font-mono font-bold">₹{part1Amount.toFixed(2)}</span>
              </div>
              <p className="font-mono text-[7.5px] text-neutral-500">Txn: {part1Txn}</p>
              <div className="flex justify-between text-neutral-800 pt-1 border-t border-neutral-200">
                <span>{part2Method} ({part2Mode}):</span>
                <span className="font-mono font-bold">₹{part2Amount.toFixed(2)}</span>
              </div>
              <p className="font-mono text-[7.5px] text-neutral-500">Txn: {part2Txn}</p>
            </div>
          ) : (
            <div className="space-y-0.5 text-neutral-700">
              <p>Payment Mode: <strong className="text-black">{paymentMode}</strong></p>
              <p>Payment Method: <strong className="text-black">{paymentMethod}</strong></p>
              <p>Transaction ID: <strong className="font-mono text-black">{txnId}</strong></p>
              <p>Payment Status: <strong className="text-emerald-700">Completed (Paid in Full)</strong></p>
            </div>
          )}
        </div>

        {/* Right: Tax Breakdown */}
        <div className="w-1/2 space-y-1">
          <p className="font-extrabold uppercase text-[9px] tracking-wider text-neutral-600 mb-1">
            Tax Breakdown (GST Margin Rule 32(5))
          </p>
          <table className="w-full text-[8px] border-collapse">
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="py-0.5 text-neutral-600">Margin SGST @ 9%</td>
                <td className="py-0.5 text-right font-mono font-semibold">₹{marginSgst.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-0.5 text-neutral-600">Margin CGST @ 9%</td>
                <td className="py-0.5 text-right font-mono font-semibold">₹{marginCgst.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-0.5 text-neutral-600">Margin IGST @ 18%</td>
                <td className="py-0.5 text-right font-mono font-semibold">₹{marginIgst.toFixed(2)}</td>
              </tr>
              <tr className="font-bold text-black">
                <td className="py-1">Total Margin Tax:</td>
                <td className="py-1 text-right font-mono">₹{totalTax.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBTLE HORIZONTAL DIVIDER */}
      <div className="border-b border-neutral-300 my-2" />

      {/* SECTION 6: TERMS & CONDITIONS + AUTHORISED SIGNATORY */}
      <div className="flex justify-between items-start text-[7.5px] py-1 gap-6">
        {/* Left: Terms and Conditions */}
        <div className="w-[70%] space-y-0.5 text-neutral-700 leading-tight">
          <p className="font-bold uppercase tracking-wider text-[8.5px] text-neutral-900 mb-1">
            Terms &amp; Conditions (Warranty Policy &amp; Jurisdiction)
          </p>
          {effectiveTerms.map((term, tIdx) => (
            <p key={tIdx} className="leading-tight">
              {term}
            </p>
          ))}
        </div>

        {/* Right: Signature & Stamp */}
        <div className="w-[30%] text-center flex flex-col justify-between items-center min-h-[90px]">
          <p className="font-bold text-[8.5px] text-neutral-800">
            For {companyLegalName}
          </p>
          
          <div className="my-1">
            <CompanyStamp />
          </div>

          <p className="font-bold text-[9px] border-t border-black w-4/5 pt-1 text-black">
            Authorised Signatory
          </p>
        </div>
      </div>

      {/* SUBTLE HORIZONTAL DIVIDER */}
      <div className="border-b border-neutral-300 my-2" />

      {/* SECTION 7: BARCODE & REGISTERED FOOTER */}
      <div className="flex justify-between items-center text-[7.5px] text-neutral-600 pt-1">
        <div className="flex items-center gap-3">
          <BarcodeSVG value={invoiceNumber} />
          <div className="space-y-0.5">
            <p className="font-mono text-black font-bold text-[8px]">{invoiceNumber}</p>
            <p>Digitally signed tax invoice | {companyLegalName} | GSTIN: {companyGstin}</p>
            <p>Support &amp; WhatsApp: 6390616616 &nbsp;|&nbsp; Email: {companySupportEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-bold text-black">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
