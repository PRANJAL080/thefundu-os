"use client";

import React from "react";
import { BuybackRecord } from "@/lib/types";

export interface StorePurchaseReceiptProps {
  record?: BuybackRecord | null;
  serviceNumber?: string;
  receiptDate?: string;
  sellerName?: string;
  sellerPhone?: string;
  sellerAddress?: string;
  deviceTitle?: string;
  imei?: string;
  schemeTitle?: string;
  pickupType?: string;
  totalAmount?: number;
  storePartnerName?: string;
  storePartnerAddress?: string;
  id?: string;
}

export function formatReceiptDate(dateStr?: string): string {
  if (!dateStr) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day}/${months[now.getMonth()]}/${now.getFullYear()}`;
  }
  if (dateStr.includes("/")) return dateStr;
  const clean = dateStr.split("T")[0];
  const parts = clean.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parts[2].padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[monthIdx] || "Nov";
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

export function StorePurchaseReceipt({
  record,
  serviceNumber,
  receiptDate,
  sellerName,
  sellerPhone,
  sellerAddress,
  deviceTitle,
  imei,
  schemeTitle = "Store Purchase",
  pickupType = "Store",
  totalAmount,
  storePartnerName,
  storePartnerAddress,
  id = "store-purchase-receipt-sheet",
}: StorePurchaseReceiptProps) {
  // Extract and compute display fields with graceful fallbacks
  const name = (sellerName || record?.sellerName || "Kaustubh Singh").trim();
  const phone = (sellerPhone || record?.sellerPhone || "9758244973").trim();
  const address = (
    sellerAddress ||
    record?.sellerAddress ||
    "Flat No. 211, Block-B, Azea Botanica Apartment, Sector 11, Vrindavan Yojana, Raebareilly Road, Lucknow – 226029, Uttar Pradesh"
  ).trim();

  const formattedDate = formatReceiptDate(receiptDate || record?.date);

  // Compute Service Number if not provided
  const computedServiceNo =
    serviceNumber ||
    record?.serviceNumber ||
    `TF-${(record?.date || "2026-11-20").replace(/-/g, "")}-001`;

  // Compute clean device specs line
  let fullDeviceTitle = deviceTitle;
  if (!fullDeviceTitle && record) {
    const parts = [record.brand, record.model];
    const specs: string[] = [];
    if (record.colour) specs.push(record.colour);
    if (record.storage) specs.push(record.storage);
    const specsStr = specs.length > 0 ? ` (${specs.join(", ")})` : "";
    fullDeviceTitle = `${parts.join(" ")}${specsStr}`;
  }
  if (!fullDeviceTitle) {
    fullDeviceTitle = "Samsung Galaxy S24 5G Snapdragon (Amber Yellow, 8 GB/256 GB)";
  }

  const deviceImei = imei || record?.imei1 || "356016370598456";
  const amount = totalAmount !== undefined ? totalAmount : (record?.finalOfferedPrice ?? 14000);
  const formattedAmount = Number(amount).toFixed(2);

  const partnerName = storePartnerName || "The Fundu – Gomti Nagar, Lucknow";
  const partnerAddress =
    storePartnerAddress ||
    "B-124 LGF, Sahara Plaza, Vikas Khand, Patrakar Puram,\nGomti Nagar, Lucknow, Uttar Pradesh 226010";

  return (
    <div
      id={id}
      data-invoice-sheet="true"
      data-purchase-receipt="true"
      className="bg-white text-black font-sans w-full max-w-[794px] mx-auto p-8 sm:p-12 shadow-sm selection:bg-teal-100 print:shadow-none print:p-8 print:max-w-none print:w-full"
      style={{ minHeight: "1050px", boxSizing: "border-box" }}
    >
      {/* ============================================================== */}
      {/* 1. TOP HEADER: LEFT (Receipt Info) & RIGHT (Company Branding)  */}
      {/* ============================================================== */}
      <div className="flex justify-between items-start gap-4">
        {/* Left Side: Receipt Title, Date, Service No, Buyer */}
        <div className="space-y-1.5 pt-1">
          <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight mb-2">
            Store Purchase Receipt
          </h1>
          <div className="text-xs text-black space-y-1 font-normal">
            <div>
              <span className="font-bold">Date:</span> {formattedDate}
            </div>
            <div>
              <span className="font-bold">Service Number:</span> {computedServiceNo}
            </div>
            <div>
              <span className="font-bold">Buyer:</span> The Fundu
            </div>
          </div>
        </div>

        {/* Right Side: The Fundu Branding & Official Addresses */}
        <div className="text-right flex flex-col items-end">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#009688] uppercase leading-none">
            THE FUNDU
          </div>
          <div className="text-[11px] text-slate-500 font-normal mt-0.5 mb-2">
            thefundu.com
          </div>
          <div className="font-bold text-[10.5px] text-black uppercase leading-tight max-w-[320px]">
            ESTERLINE BONAPARTE CORPORATION PRIVATE LIMITED
          </div>
          <div className="text-[10px] text-black leading-tight mt-0.5">
            Office Address: Lucknow, Uttar Pradesh
          </div>
          <div className="text-[10px] text-black leading-tight">
            Store Address: B-124 LGF, Sahara Plaza, Vikas Khand,
          </div>
          <div className="text-[10px] text-black leading-tight">
            Patrakar Puram, Gomti Nagar, Lucknow – 226010
          </div>
          <div className="text-[10px] text-black leading-tight mt-0.5">
            <span className="font-semibold">GSTIN:</span> 09AAJCE9800C1ZP |{" "}
            <span className="font-semibold">Phone:</span> 6390616616
          </div>
          <div className="text-[10px] text-black leading-tight">
            <span className="font-semibold">Email:</span> support@thefundu.com
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SELLER DETAILS (Shaded Box)                                 */}
      {/* ============================================================== */}
      <div className="mt-7 bg-[#f3f4f6] p-4 text-xs text-black rounded-sm border-0">
        <div className="font-bold mb-2 text-black">Seller Details:</div>
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 mb-1">
          <div>
            <span className="font-bold">Name:</span> {name}
          </div>
          <div className="sm:text-right">
            <span className="font-bold">Contact No.:</span> {phone}
          </div>
        </div>
        <div className="leading-snug">
          <span className="font-bold">Address:</span> {address}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. DEVICE DETAILS & TOTAL AMOUNT TABLE                         */}
      {/* ============================================================== */}
      <div className="mt-7">
        {/* Table Header */}
        <div className="flex justify-between items-center pb-1">
          <div className="font-bold text-xs sm:text-sm text-black">
            Device Details:
          </div>
          <div className="font-bold text-xs sm:text-sm text-black text-right">
            Total Amount
          </div>
        </div>

        {/* Content Row */}
        <div className="flex justify-between items-start gap-4 text-xs text-black pt-1">
          {/* Left Column: Device Title, IMEI, Scheme, Pickup */}
          <div className="space-y-1">
            <div className="font-normal text-black text-[12.5px]">
              {fullDeviceTitle}
            </div>
            <div>
              <span className="font-normal text-black">IMEI/Serial No.:</span> {deviceImei}
            </div>
            <div>
              <span className="font-normal text-black">Scheme Title:</span> {schemeTitle}
            </div>
            <div>
              <span className="font-normal text-black">Pickup Type:</span> {pickupType}
            </div>
          </div>

          {/* Right Column: Total Amount */}
          <div className="text-right font-bold text-sm sm:text-base text-black pt-0.5">
            {formattedAmount}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. VIA RETAIL STORE PARTNER                                    */}
      {/* ============================================================== */}
      <div className="mt-7 text-xs text-black space-y-0.5">
        <div className="font-bold text-black mb-1">Via Retail Store Partner:</div>
        <div>{partnerName}</div>
        {partnerAddress.split("\n").map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 5. INDEMNITY BOND (Legal Clause)                               */}
      {/* ============================================================== */}
      <div className="mt-8 space-y-2">
        <div className="font-bold uppercase tracking-wider text-xs text-black">
          INDEMNITY BOND
        </div>
        <p className="text-[11px] leading-relaxed text-black text-justify">
          This Bond of Indemnity is made and executed by{" "}
          <span className="font-bold">{name}</span> (hereinafter referred to as
          “Seller”) who has transferred the above-mentioned device to{" "}
          <span className="font-bold">The Fundu</span> (hereinafter referred to as
          “Buyer”). The Seller confirms ownership of the device and declares that
          the details provided are true and correct, to the best of their
          knowledge, on the date of purchase{" "}
          <span className="font-bold">{formattedDate}</span>.
        </p>
      </div>

      {/* ============================================================== */}
      {/* 6. SELLER NAME & SIGNATURE LINE                                */}
      {/* ============================================================== */}
      <div className="mt-8 text-xs text-black space-y-0.5">
        <div className="font-bold text-black">{name}</div>
        <div className="text-[11px] text-slate-700">Seller Name</div>
      </div>

      {/* ============================================================== */}
      {/* 7. BLACK FOOTER BAR                                            */}
      {/* ============================================================== */}
      <div className="mt-14 bg-black text-white text-center py-2.5 px-4 font-bold tracking-[0.28em] text-[11px] sm:text-xs uppercase select-none">
        T H A N K S &nbsp; F O R &nbsp; C H O O S I N G &nbsp; T H E &nbsp; F U N D U
      </div>

      {/* ============================================================== */}
      {/* 8. COMPUTER GENERATED FOOTNOTE                                 */}
      {/* ============================================================== */}
      <div className="mt-3 text-center text-[10px] text-slate-600">
        This is a Computer Generated Purchase Receipt and does not require signature or stamp.
      </div>
    </div>
  );
}
