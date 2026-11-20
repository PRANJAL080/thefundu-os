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
  const rawId = device?.id ? device.id.replace("Fun-", "").replace("TFD-", "") : (order?.deviceId ? order.deviceId.replace("Fun-", "").replace("TFD-", "") : "26001");
  
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

  // Active Store Outlet (Dynamic multi-store support)
  const store = selectedStore || COMPANY_CONFIG.primaryStore;
  const storeCode = store.code || "LKO-01";
  const cleanStoreCode = storeCode.replace(/-/g, "");
  const storeName = store.name || "Lucknow Store B-124 (LKO-01)";
  const storeAddress = store.address || "B-124 LGF SAHARA PLAZA,VIKAS KHAND, PATRAKARPURAM Gomti Nagar 226010, Lucknow";
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
    `INVLKO012611-${rawId}`;

  // Date & Time formatted (Exact format DD:Mmm:YYYY • hh:mm a as per original paper invoices)
  const today = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDefaultDate = `${String(today.getDate()).padStart(2, "0")}:${months[today.getMonth()]}:${today.getFullYear()}`;
  const formattedDefaultTime = today.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formatColonDate = (dStr: string) => {
    try {
      const parts = dStr.split("-");
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        const d = parts[2].padStart(2, "0");
        return `${d}:${months[m] || "Nov"}:${y}`;
      }
    } catch (e) {}
    return dStr;
  };
  const invoiceDate = customInvoiceDate || (order?.date ? (order.date.includes(":") && !order.date.includes("-") ? order.date : formatColonDate(order.date)) : formattedDefaultDate);
  const invoiceTime = customInvoiceTime || order?.time || formattedDefaultTime;

  // Effective Terms & Conditions in Legal English
  const effectiveTerms = customTerms && customTerms.length > 0 ? customTerms : DEFAULT_INVOICE_TERMS;

  // Customer Data
  const customerName = customCustomer?.name?.trim() || order?.customerName?.trim() || "Retail Customer";
  const customerPhone = customCustomer?.phone?.trim() || order?.customerPhone?.trim() || "";
  const customerEmail = customCustomer?.email?.trim() || order?.customerEmail?.trim() || "NA";
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
  const customerGstin = customCustomer?.gstin || order?.customerGstin || "NA";
  const customerAadhaar =
    customCustomer?.aadhaar ||
    order?.customerAadhaar ||
    "";
  const placeOfSupply = customCustomer?.placeOfSupply || order?.placeOfSupply || "Uttar Pradesh (09)";

  // Phone Specifications - STRICTLY WITHOUT GRADING (No A+, No Grade tags)
  const brand = device?.brand || "Apple";
  const model = device?.model || "iPhone 14 pro";
  const storage = device?.storage || "128GB";
  const colour = device?.colour || "White";
  const barcode = device?.sku || `TFD-${rawId}-APP`;
  const imei1 = device?.imei1 || order?.imei || "356983557725459";
  const serialNo = device?.serialNumber || order?.serialNumber || `SN${rawId}`;

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
    : (device?.costs.purchasePrice || order?.purchasePrice || 35100);

  const sellingPriceY = financials?.sellingPrice !== undefined 
    ? financials.sellingPrice 
    : (Number(order?.sellingPrice) || Number(device?.costs.sellingPrice) || 43000);

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

  if (order?.taxAmount && order.taxAmount > 0) {
    totalTax = Number(order.taxAmount);
    marginCgst = Math.round((totalTax / 2) * 100) / 100;
    marginSgst = Math.round((totalTax - marginCgst) * 100) / 100;
    marginIgst = 0.00;
  } else if (profitMarginZ > 0) {
    if (taxMode === "inclusive") {
      totalTax = Math.round((profitMarginZ * 18 / 118) * 100) / 100;
    } else {
      totalTax = Math.round((profitMarginZ * 0.18) * 100) / 100;
    }

    marginCgst = Math.round((totalTax / 2) * 100) / 100;
    marginSgst = Math.round((totalTax - marginCgst) * 100) / 100;
    marginIgst = 0.00;
  }

  // Payment Details
  const paymentMethod = paymentInfo?.method || (order?.invoiceNumber === "INVLKO012611-26083" ? "Google Pay" : order?.paymentMethod || "Google Pay");
  const paymentMode = paymentInfo?.mode || (order?.invoiceNumber === "INVLKO012611-26083" ? "UPI" : (order?.splitPayment ? "Split" : (order?.paymentMethod === "UPI" ? "UPI" : order?.paymentMethod || "Google Pay")));
  const txnId = paymentInfo?.txnId || order?.paymentTxnId || `T2611141902345516542965`;

  const splitPaymentData = paymentInfo?.splitPayment || order?.splitPayment;
  const isSplitPayment = Boolean(
    splitPaymentData &&
      ((splitPaymentData.amount1 !== undefined && splitPaymentData.amount1 > 0) ||
       (splitPaymentData.amount2 !== undefined && splitPaymentData.amount2 > 0) ||
       (splitPaymentData.cashAmount !== undefined && splitPaymentData.cashAmount > 0) ||
       (splitPaymentData.onlineAmount !== undefined && splitPaymentData.onlineAmount > 0))
  ) || (paymentMode && paymentMode.toLowerCase().includes("split"));

  // Universal Part 1 & Part 2 Dual Payment Breakdown
  const part1Mode = splitPaymentData?.mode1 || (splitPaymentData?.cashAmount !== undefined && splitPaymentData?.cashAmount > 0 ? "Cash Desk" : "Card");
  const part1Method = splitPaymentData?.method1 || (part1Mode === "Cash Desk" ? "Cash on Counter" : "Credit Card Swipe");
  const part1Txn = splitPaymentData?.txnId1 || (part1Mode.toLowerCase().includes("cash") ? "Store Cash Counter" : `POSLKO2611-${rawId}`);
  const part1Amount = Number(splitPaymentData?.amount1 ?? splitPaymentData?.cashAmount ?? Math.round(finalAmount / 2));

  const part2Mode = splitPaymentData?.mode2 || (splitPaymentData?.onlineMode ? "UPI / Online" : "Google Pay");
  const part2Method = splitPaymentData?.method2 || splitPaymentData?.onlineMode || "Google Pay";
  const part2Txn = splitPaymentData?.txnId2 || (part2Mode.toLowerCase().includes("cash") ? "Store Cash Counter" : txnId || `GPAYLKO2611-${rawId}`);
  const part2Amount = Number(splitPaymentData?.amount2 ?? splitPaymentData?.onlineAmount ?? Math.max(0, finalAmount - part1Amount));

  return (
    <div
      className="bg-white text-black p-4 sm:p-6 print:p-0 print:m-0 w-full max-w-[850px] mx-auto text-[10px] leading-tight select-text"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#000000",
      }}
    >
      {/* TOP HEADER */}
      <div className="flex justify-between items-center text-[10.5px] font-bold pb-1 px-1">
        <span className="tracking-tight">
          <strong>CIN:</strong> <span className="font-mono font-bold tracking-wide">{companyCin}</span>
        </span>
        <span className="uppercase tracking-wider mr-12 text-black font-extrabold text-[9.5px]">
          Original for Recipient
        </span>
      </div>

      {/* SINGLE UNIFIED CRISP OUTER BORDER BOX */}
      <div className="border border-black">
        {/* ROW 1: TAX INVOICE TITLE */}
        <div className="text-center py-1.5 border-b border-black bg-slate-50">
          <h1 className="text-base font-black uppercase tracking-wider text-black">
            TAX INVOICE
          </h1>
        </div>

        {/* ROW 2: SUPPLIER NAME & ADDRESS */}
        <div className="border-b border-black flex">
          <div className="w-[28%] p-2 font-bold border-r border-black bg-white flex items-center">
            Supplier Name &amp; Address
          </div>
          <div className="w-[72%] p-2 space-y-0.5">
            <p className="font-bold text-[11px]">
              {companyLegalName}
            </p>
            <p>
              <strong>Registered Office Address:</strong> {companyRegisteredAddress}
            </p>
            <p>
              <strong>Store Outlet:</strong> <span className="font-bold text-black">{storeName}</span> — {storeAddress}
            </p>
            <p className="font-semibold">
              GSTIN: {companyGstin} &nbsp;&nbsp;&nbsp; CIN: {companyCin} &nbsp;&nbsp;&nbsp; PAN: {companyPan}
            </p>
          </div>
        </div>

        {/* ROW 3: ORDER & INVOICE METADATA GRID */}
        <div className="border-b border-black text-[9px]">
          {/* Row 3.1 */}
          <div className="flex border-b border-black">
            <div className="w-[38%] p-1.5 border-r border-black">
              Channel Order No.: <span className="font-bold">{channelOrderNo}</span> ({activeChannelCode})
            </div>
            <div className="w-[34%] p-1.5 border-r border-black">
              Order No.: <span className="font-bold">{orderNo}</span>
            </div>
            <div className="w-[28%] p-1.5">
              Type of Sales: <span className="font-bold">{activeTypeOfSale}</span>
            </div>
          </div>

          {/* Row 3.2 */}
          <div className="flex border-b border-black">
            <div className="w-[38%] p-1.5 border-r border-black truncate">
              Invoice Number: <span className="font-bold font-mono">{invoiceNumber}</span>
            </div>
            <div className="w-[34%] p-1.5 border-r border-black truncate">
              Date &amp; Time: <span className="font-bold">{invoiceDate}{invoiceTime ? ` • ${invoiceTime}` : ""}</span>
            </div>
            <div className="w-[14%] p-1.5 border-r border-black">
              Sales Channel: <span className="font-bold">{activeChannelCode}</span>
            </div>
            <div className="w-[14%] p-1.5">
              Place of Supply: <span className="font-bold">{companyStateName} ({companyStateCode})</span>
            </div>
          </div>

          {/* Row 3.3 */}
          <div className="flex">
            <div className="w-[72%] p-1.5 border-r border-black">
              Store Location: <span className="font-bold">{displayStoreLocation}</span>
            </div>
            <div className="w-[28%] p-1.5 font-bold">
              GSTIN: {companyGstin}
            </div>
          </div>
        </div>

        {/* ROW 4: BILL TO & SHIP TO SECTION */}
        <div className="border-b border-black flex text-[8.5px] leading-tight">
          {/* Bill To */}
          <div className="w-1/2 p-1.5 border-r border-black space-y-0.5">
            <div className="flex">
              <span className="font-bold w-14 shrink-0 text-black">Bill To:</span>
              <div className="flex-1 space-y-0.5">
                <p className="font-bold text-[10px] text-black uppercase">{customerName}</p>
                <p><span className="font-semibold">Ph:</span> {customerPhone} {customerEmail ? <span>&nbsp;|&nbsp; <span className="font-semibold">Email:</span> {customerEmail}</span> : null}</p>
                {customerAadhaar ? (
                  <p className="font-mono font-bold text-black"><span className="font-sans font-bold">KYC NO:</span> {customerAadhaar}</p>
                ) : null}
                <p><span className="font-semibold">Local Address:</span> {customerLocalAddress}</p>
                {customerPermanentAddress ? (
                  <p><span className="font-semibold">Permanent Address:</span> {customerPermanentAddress}</p>
                ) : null}
                <p><span className="font-semibold">GSTIN:</span> {customerGstin} &nbsp;|&nbsp; <span className="font-semibold">Place of Supply:</span> {placeOfSupply}</p>
              </div>
            </div>
          </div>

          {/* Ship To */}
          <div className="w-1/2 p-1.5 space-y-0.5">
            <div className="flex">
              <span className="font-bold w-14 shrink-0 text-black">Ship To:</span>
              <div className="flex-1 space-y-0.5">
                <p className="font-bold text-[10px] text-black uppercase">{customerName} &nbsp;&nbsp; <span className="font-normal text-[8.5px] font-semibold">Ph: {customerPhone}</span></p>
                <p><span className="font-semibold">Delivery Address:</span> {customerLocalAddress}</p>
                {customerPermanentAddress && customerPermanentAddress !== customerLocalAddress ? (
                  <p><span className="font-semibold">Permanent Address:</span> {customerPermanentAddress}</p>
                ) : null}
                {customerAadhaar ? (
                  <p className="font-mono text-[8.5px] font-bold text-black"><span className="font-sans font-bold">KYC NO:</span> {customerAadhaar}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 5: MAIN ITEMS TABLE */}
        <div className="border-b border-black">
          <table className="w-full text-[9px] border-collapse">
            <thead>
              <tr className="border-b border-black text-center font-bold">
                <th className="p-1 border-r border-black w-[4%]">S. No.</th>
                <th className="p-1 border-r border-black w-[13%]">Barcode</th>
                <th className="p-1 border-r border-black w-[35%] text-left">Description of Goods</th>
                <th className="p-1 border-r border-black w-[12%]">Product Type</th>
                <th className="p-1 border-r border-black w-[8%]">HSN / SAC</th>
                <th className="p-1 border-r border-black w-[7%]">Warranty</th>
                <th className="p-1 border-r border-black w-[9%]">Warranty Type</th>
                <th className="p-1 border-r border-black w-[4%]">Qty</th>
                <th className="p-1 border-r border-black w-[9%] text-right">Price (INR)</th>
                <th className="p-1 w-[9%] text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black align-top">
                <td className="p-1 text-center border-r border-black font-semibold">1</td>
                <td className="p-1 border-r border-black font-mono text-[8px] text-center">{barcode}</td>
                <td className="p-1 border-r border-black text-left font-semibold">
                  {goodsDescription}
                </td>
                <td className="p-1 border-r border-black text-center">
                  Refurbished Mobiles
                </td>
                <td className="p-1 border-r border-black text-center font-mono">
                  851712
                </td>
                <td className="p-1 border-r border-black text-center font-bold">
                  {warrantyDays} Days
                </td>
                <td className="p-1 border-r border-black text-center">
                  TheFundu Warranty
                </td>
                <td className="p-1 border-r border-black text-center font-bold">
                  1
                </td>
                <td className="p-1 border-r border-black text-right font-semibold">
                  {sellingPriceY.toFixed(2)}
                </td>
                <td className="p-1 text-right font-bold">
                  {sellingPriceY.toFixed(2)}
                </td>
              </tr>

              {/* Subtotal */}
              <tr className="border-b border-black">
                <td colSpan={7} className="p-1 text-right font-bold border-r border-black pr-2">Sub Total (Before Tax &amp; Discount):</td>
                <td className="p-1 text-center font-bold border-r border-black">1</td>
                <td className="p-1 text-right font-bold border-r border-black">{sellingPriceY.toFixed(2)}</td>
                <td className="p-1 text-right font-bold">{sellingPriceY.toFixed(2)}</td>
              </tr>

              {/* Total Tax on Margin */}
              <tr className="border-b border-black">
                <td colSpan={7} className="p-1 text-right font-semibold border-r border-black pr-2">Total GST on Margin (Rule 32(5)):</td>
                <td className="border-r border-black"></td>
                <td className="p-1 text-right font-semibold border-r border-black">18%</td>
                <td className="p-1 text-right font-bold">{totalTax.toFixed(2)}</td>
              </tr>

              {/* Discount */}
              {discountD > 0 && (
                <tr className="border-b border-black">
                  <td colSpan={7} className="p-1 text-right font-semibold border-r border-black pr-2">Promotional Discount:</td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="p-1 text-right font-bold text-rose-700">-{discountD.toFixed(2)}</td>
                </tr>
              )}

              {/* Grand Total */}
              <tr>
                <td colSpan={7} className="p-1 text-right font-black border-r border-black pr-2 text-[10px]">Grand Total (Billed Amount):</td>
                <td className="p-1 text-center font-black border-r border-black">1</td>
                <td className="border-r border-black"></td>
                <td className="p-1 text-right font-black text-[10px] font-mono">{finalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ROW 6: AMOUNT IN WORDS */}
        <div className="border-b border-black p-1.5 flex text-[9px]">
          <span className="font-bold w-28">Amount in words:</span>
          <span className="font-bold flex-1">{numberToWords(finalAmount)}</span>
        </div>

        {/* ROW 7: THREE-COLUMN SUMMARY ROW */}
        <div className="border-b border-black flex">
          {/* Box 1: IMEI / SERIAL NO. */}
          <div className="w-[24%] p-1.5 border-r border-black space-y-1 text-[8.5px]">
            <p className="font-bold uppercase tracking-wider text-[9px] border-b border-black pb-0.5">
              IMEI / SERIAL NO.
            </p>
            <div>
              <p className="font-bold">IMEI No:</p>
              <p className="font-mono font-bold">[{imei1}]</p>
            </div>
            <div>
              <p className="font-bold">Serial No: [{serialNo}]</p>
            </div>
          </div>

          {/* Box 2: PAYMENT SUMMARY */}
          <div className="w-[46%] p-1.5 border-r border-black text-[8.5px]">
            <div className="border-b border-black pb-0.5 mb-1 flex items-center justify-between">
              <p className="font-bold uppercase tracking-wider text-[9px]">
                PAYMENT SUMMARY
              </p>
              {isSplitPayment && (
                <span className="text-[7px] font-black uppercase tracking-wider bg-black text-white px-1 py-0.2 rounded-sm">
                  Split ({part1Mode} + {part2Mode})
                </span>
              )}
            </div>
            {isSplitPayment ? (
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold bg-slate-50">
                    <th className="p-0.5 border-r border-black text-left pl-1">Payment Mode</th>
                    <th className="p-0.5 border-r border-black">Payment Method</th>
                    <th className="p-0.5 border-r border-black">Transaction ID / UPI Ref</th>
                    <th className="p-0.5 text-right pr-1">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black/40">
                    <td className="p-0.5 border-r border-black font-bold text-left pl-1">
                      {part1Mode}
                    </td>
                    <td className="p-0.5 border-r border-black font-medium">
                      {part1Method}
                    </td>
                    <td className="p-0.5 border-r border-black font-mono font-semibold text-[7.5px] max-w-[130px] break-all">
                      {part1Txn}
                    </td>
                    <td className="p-0.5 text-right font-bold pr-1 font-mono">
                      {part1Amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-black/40">
                    <td className="p-0.5 border-r border-black font-bold text-left pl-1">
                      {part2Mode}
                    </td>
                    <td className="p-0.5 border-r border-black font-medium">
                      {part2Method}
                    </td>
                    <td className="p-0.5 border-r border-black font-mono font-semibold text-[7.5px] max-w-[130px] break-all">
                      {part2Txn}
                    </td>
                    <td className="p-0.5 text-right font-bold pr-1 font-mono">
                      {part2Amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="font-bold bg-slate-100">
                    <td colSpan={3} className="p-0.5 border-r border-black text-right pr-1 font-bold">
                      Total Received (INR):
                    </td>
                    <td className="p-0.5 text-right font-black pr-1 font-mono">
                      {finalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-black font-bold">
                    <th className="p-0.5 border-r border-black">Payment Mode</th>
                    <th className="p-0.5 border-r border-black">Payment Method</th>
                    <th className="p-0.5 border-r border-black">Transaction ID</th>
                    <th className="p-0.5 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-0.5 border-r border-black font-bold">{paymentMode}</td>
                    <td className="p-0.5 border-r border-black font-medium">{paymentMethod}</td>
                    <td className="p-0.5 border-r border-black font-mono text-[8px] truncate max-w-[120px]">
                      {paymentMode === "Cash" ? "Store Cash Counter" : txnId}
                    </td>
                    <td className="p-0.5 text-right font-bold font-mono">{finalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Box 3: TAX SUMMARY (MARGIN GST RULE 32(5)) */}
          <div className="w-[30%] p-1.5 text-[8.5px]">
            <p className="font-bold uppercase tracking-wider text-[9px] border-b border-black pb-0.5 mb-1">
              TAX SUMMARY (RULE 32(5))
            </p>
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-black font-bold">
                  <th className="p-0.5 border-r border-black text-left">Tax Category</th>
                  <th className="p-0.5 border-r border-black">Tax %</th>
                  <th className="p-0.5 text-right">Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black/40">
                  <td className="p-0.5 border-r border-black text-left font-semibold">Margin SGST@9%</td>
                  <td className="p-0.5 border-r border-black">9</td>
                  <td className="p-0.5 text-right font-mono">{marginSgst.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-black/40">
                  <td className="p-0.5 border-r border-black text-left font-semibold">Margin IGST@18%</td>
                  <td className="p-0.5 border-r border-black">18</td>
                  <td className="p-0.5 text-right font-mono">{marginIgst.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-0.5 border-r border-black text-left font-semibold">Margin CGST@9%</td>
                  <td className="p-0.5 border-r border-black">9</td>
                  <td className="p-0.5 text-right font-mono">{marginCgst.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 8: TERMS & CONDITIONS + AUTHORISED SIGNATORY (STRICTLY WITHOUT DIGITAL STAMP) */}
        <div className="border-b border-black flex">
          {/* Left: Dynamic Legal Terms and GST Rule 32(5) Declaration */}
          <div className="w-[72%] p-2 border-r border-black space-y-1 text-[7.5px] leading-tight">
            <p className="font-bold text-[9px] uppercase tracking-wide border-b border-black/30 pb-0.5 mb-1">
              Terms &amp; Conditions (Warranty Policy &amp; Jurisdiction)
            </p>
            {effectiveTerms.map((term, tIdx) => (
              <p key={tIdx} className="text-black font-normal">
                {term}
              </p>
            ))}
          </div>

          {/* Right: Signature Area (Without Stamp) */}
          <div className="w-[28%] p-2 flex flex-col justify-between items-center text-center min-h-[90px]">
            <p className="font-bold text-[8.5px]">
              For {companyLegalName}
            </p>
            
            {/* Blank Space for Physical Signature / Manual Rubber Stamp */}
            <div className="my-auto py-5" />

            <p className="font-bold text-[9px] border-t border-black w-full pt-1">
              Authorised Signatory
            </p>
          </div>
        </div>

        {/* ROW 9: BARCODE & REGISTERED FOOTER BOX */}
        <div className="flex items-center p-2 text-[8px]">
          {/* Left Barcode & Invoice Identifier */}
          <div className="w-[38%] flex flex-col items-center justify-center border-r border-black pr-3">
            <BarcodeSVG value={invoiceNumber} />
            <span className="font-mono text-[7px] text-neutral-600 mt-0.5">INVOICE SERIAL BARCODE</span>
          </div>

          {/* Right Legal Corporate Declaration */}
          <div className="w-[62%] pl-3 grid grid-cols-2 gap-2 text-[7.5px] leading-tight">
            <div className="space-y-0.5">
              <p>
                <strong>Registered Office:</strong> {companyRegisteredAddress}
              </p>
              <p>
                <strong>Store Outlet:</strong> {storeName} — {storeAddress}
              </p>
            </div>
            <div className="space-y-0.5 pl-2 border-l border-black/20">
              <p>
                <strong>CIN:</strong> {companyCin}
              </p>
              <p>
                <strong>GSTIN:</strong> {companyGstin} &nbsp;|&nbsp; <strong>PAN:</strong> {companyPan}
              </p>
              <p>
                <strong>State:</strong> {companyStateName} ({companyStateCode})
              </p>
              <p className="pt-0.5 font-medium">
                <strong>Call &amp; WhatsApp:</strong> 6390616616 &nbsp;|&nbsp; <strong>Mail:</strong> {companySupportEmail}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL FOOTNOTE */}
      <div className="flex justify-between items-center pt-1 text-[7.5px] text-black">
        <span>
          Digitally signed tax invoice | {companyLegalName} | CIN: {companyCin} | GSTIN: {companyGstin}
        </span>
        <span className="font-bold">Page 1 of 1</span>
      </div>
    </div>
  );
}
