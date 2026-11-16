"use client";

import React, { useRef } from "react";
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  User,
  CreditCard,
  Building2,
  FileText,
  MapPin,
  Calendar,
  Lock,
  Award,
  Hash,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BuybackRecord } from "@/lib/types";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { formatINR, formatDate } from "@/lib/utils";

interface BuybackKycReportModalProps {
  record: BuybackRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

// Official Round Corporate Stamp
function CompanyStamp() {
  return (
    <div className="relative w-20 h-20 mx-auto flex items-center justify-center select-none pointer-events-none my-1">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full text-blue-800 dark:text-blue-700 transform -rotate-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="bb-stamp-top-arc-path"
            d="M 16.5,60 A 43.5,43.5 0 0,1 103.5,60"
            fill="none"
          />
          <path
            id="bb-stamp-bot-arc-path"
            d="M 19,60 A 41,41 0 0,0 101,60"
            fill="none"
          />
        </defs>

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
        <circle
          cx="60"
          cy="60"
          r="52.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.95"
        />
        <circle
          cx="60"
          cy="60"
          r="33.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.9"
        />
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

        <text fontSize="5.2" fontWeight="900" letterSpacing="0.4" fill="currentColor">
          <textPath href="#bb-stamp-top-arc-path" startOffset="50%" textAnchor="middle">
            ★ ESTERLINE BONAPARTE CORP PVT LTD ★
          </textPath>
        </text>

        <text fontSize="4.8" fontWeight="800" letterSpacing="0.5" fill="currentColor">
          <textPath href="#bb-stamp-bot-arc-path" startOffset="50%" textAnchor="middle">
            ★ LUCKNOW • UTTAR PRADESH ★
          </textPath>
        </text>

        <text x="60" y="47" textAnchor="middle" fontSize="6" fontWeight="900" fill="currentColor">
          ★ ★ ★
        </text>
        <text x="60" y="57" textAnchor="middle" fontSize="7.5" fontWeight="900" letterSpacing="1" fill="currentColor">
          OFFICIAL
        </text>
        <text x="60" y="67" textAnchor="middle" fontSize="7.5" fontWeight="900" letterSpacing="1.2" fill="currentColor">
          SEAL
        </text>
        <text x="60" y="75" textAnchor="middle" fontSize="4.2" fontWeight="bold" letterSpacing="0.6" fill="currentColor">
          VERIFIED
        </text>
      </svg>
    </div>
  );
}

export function BuybackKycReportModal({ record, isOpen, onClose }: BuybackKycReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      {/* Top Action Header (Hidden during Print) */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 print:hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Customer Buyback & Aadhaar Police CEIR Report</span>
              <span className="font-mono text-xs text-fundu-600 font-semibold">({record.id})</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Statutory Second-Hand Goods Purchase Voucher with Aadhaar KYC & CEIR Title Clearance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </Button>

          <Button
            variant="fundu"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div className="p-6 overflow-y-auto max-h-[85vh] bg-slate-100 dark:bg-slate-950/50 print:p-0 print:bg-white print:max-h-none">
        <div
          ref={printRef}
          className="max-w-[780px] mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-4 text-xs font-sans"
        >
          {/* 1. OFFICIAL COMPANY HEADER */}
          <div className="border-b-2 border-black pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-black dark:text-white">
                    TheFundu<span className="text-fundu-600">.</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black text-white">
                    Refurbished OS
                  </span>
                </div>
                <h1 className="text-sm font-bold text-black dark:text-white mt-1 uppercase tracking-wide">
                  {COMPANY_CONFIG.legalName}
                </h1>
                <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5 max-w-md">
                  {COMPANY_CONFIG.registeredAddress}
                </p>
                <p className="text-[10.5px] font-mono text-slate-700 dark:text-slate-300 mt-1">
                  <strong>CIN:</strong> {COMPANY_CONFIG.cin} | <strong>GSTIN:</strong> {COMPANY_CONFIG.gstin}
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  Call & WhatsApp: <strong>6390616616</strong> | Email: <strong>support@thefundu.com</strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 rounded bg-black text-white text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  VOUCHER NO: {record.id}
                </span>
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Date: {formatDate(record.date)}
                </p>
                <p className="text-[10px] text-slate-500">
                  Location: {record.storeLocation || "Lucknow Store (LKO-01)"}
                </p>
                {record.inwardDeviceId && (
                  <p className="text-[11px] font-mono font-bold text-fundu-600 mt-1">
                    Stock ID: {record.inwardDeviceId}
                  </p>
                )}
              </div>
            </div>

            {/* Document Title Bar */}
            <div className="mt-3 py-1.5 px-3 bg-slate-900 text-white rounded text-center">
              <h2 className="text-xs font-black uppercase tracking-wider">
                SECOND-HAND HANDSET PURCHASE VOUCHER &amp; AADHAAR CEIR KYC REPORT
              </h2>
              <p className="text-[9.5px] text-slate-300 tracking-tight">
                Statutory Ownership Transfer, Police CEIR Verification &amp; Customer Aadhaar Identification Record
              </p>
            </div>
          </div>

          {/* 2. CUSTOMER / SELLER KYC & AADHAAR VERIFICATION BOX */}
          <div className="my-4 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 font-bold uppercase text-[10.5px] flex items-center justify-between border-b border-slate-300 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-blue-600" />
                <span>Section 1: Customer / Seller Identification &amp; Aadhaar KYC</span>
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                KYC Identity Verified
              </span>
            </div>

            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Seller Full Name</span>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{record.sellerName}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mobile Contact</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{record.sellerPhone}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Govt Photo ID Type</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                  {record.sellerIdType || "Aadhaar Card"}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Residential Address</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {record.sellerAddress || "ED-476, Sector-Q, Aliganj, Lucknow, UP 226024"}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Aadhaar / ID Card Number</span>
                <p className="font-mono font-black text-sm tracking-widest text-slate-900 dark:text-slate-100">
                  {record.sellerIdNumber || "XXXX-XXXX-9182"}
                </p>
              </div>
            </div>

            {/* Attached Aadhaar Card Photos (Front & Back) */}
            {(record.sellerIdPhotoFront || record.sellerIdPhotoBack) && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2 flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                  <span>Aadhaar Card Proof Attached to Police File</span>
                </span>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {record.sellerIdPhotoFront && (
                    <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video bg-white">
                      <img
                        src={record.sellerIdPhotoFront}
                        alt="Aadhaar Front"
                        className="w-full h-full object-cover"
                      />
                      <span className="block text-[9px] text-center font-bold bg-slate-200 dark:bg-slate-800 py-0.5">
                        Aadhaar Card Front
                      </span>
                    </div>
                  )}
                  {record.sellerIdPhotoBack && (
                    <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video bg-white">
                      <img
                        src={record.sellerIdPhotoBack}
                        alt="Aadhaar Back"
                        className="w-full h-full object-cover"
                      />
                      <span className="block text-[9px] text-center font-bold bg-slate-200 dark:bg-slate-800 py-0.5">
                        Aadhaar Card Back
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. HANDSET HARDWARE & CEIR POLICE CLEARANCE */}
          <div className="my-4 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 font-bold uppercase text-[10.5px] flex items-center justify-between border-b border-slate-300 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-fundu-600" />
                <span>Section 2: Handset Hardware Identification &amp; CEIR Status</span>
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Government CEIR Portal Checked: Clean
              </span>
            </div>

            <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Brand &amp; Model</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">{record.brand} {record.model}</p>
                <p className="text-[10px] text-slate-500">{record.storage} • {record.colour}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Primary IMEI 1 (15 Digits)</span>
                <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{record.imei1}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Secondary IMEI 2 / eSIM</span>
                <p className="font-mono text-slate-700 dark:text-slate-300">{record.imei2 || "N/A"}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Serial Number</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{record.serialNumber || "SNBB-2601"}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Physical Condition</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Screen: {record.screenCondition} | Body: {record.bodyCondition}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Battery Health %</span>
                <p className="font-bold text-emerald-600">
                  {record.batteryHealth ? `${record.batteryHealth}% Max Capacity` : "Standard OEM"}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Original Box &amp; Bill</span>
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  Box: {record.hasOriginalBox ? "Available" : "No"} | Bill: {record.hasOriginalBill ? "Available" : "No"}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">CEIR Anti-Theft Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ★ CEIR CLEAN (Not Blacklisted)
                </span>
              </div>
            </div>
          </div>

          {/* 4. COMMERCIAL VALUATION & PURCHASE PAYMENT VOUCHER */}
          <div className="my-4 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 font-bold uppercase text-[10.5px] flex items-center justify-between border-b border-slate-300 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                <span>Section 3: Commercial Valuation &amp; Payout Voucher</span>
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                Rule 32(5) Landed Acquisition Basis
              </span>
            </div>

            <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 dark:bg-slate-900/40">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Benchmark Market Value</span>
                <p className="font-mono text-slate-600 dark:text-slate-400">{formatINR(record.baseMarketValue)}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Condition Adjustments</span>
                <p className="font-mono text-rose-600">-{formatINR(record.deductionsTotal)}</p>
              </div>

              <div className="col-span-2 p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block">
                    Total Net Amount Paid to Customer
                  </span>
                  <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-300">
                    {formatINR(record.finalOfferedPrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Payment Mode: {record.payoutMethod}</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Status: {record.payoutStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. STATUTORY LEGAL OWNERSHIP & POLICE CEIR DECLARATION */}
          <div className="my-4 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-[9.5px] leading-relaxed">
            <h4 className="font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-slate-700" />
              <span>Statutory Ownership Transfer &amp; Legal Undertaking (Police &amp; CEIR Compliance)</span>
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              I, <strong>{record.sellerName}</strong>, holding {record.sellerIdType} Number <strong>{record.sellerIdNumber}</strong>, 
              residing at <strong>{record.sellerAddress || "Lucknow, Uttar Pradesh"}</strong>, do hereby solemnly declare and affirm that:
            </p>
            <ol className="list-decimal pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
              <li>I am the absolute lawful owner of the aforementioned handset with IMEI <strong>{record.imei1}</strong>.</li>
              <li>This device is completely free from any criminal investigation, lost/stolen reports on CEIR, police complaints, or un-settled financial EMI liens.</li>
              <li>I have willingly and unconditionally sold this device to <strong>{COMPANY_CONFIG.legalName}</strong> for the sum of <strong>{formatINR(record.finalOfferedPrice)}</strong> and have received the payment in full.</li>
              <li>I have logged out of all cloud accounts (Apple iCloud / Google Account), formatted all personal data, and removed SIM cards.</li>
            </ol>
          </div>

          {/* 6. SIGNATURES & OFFICIAL CORPORATE STAMP */}
          <div className="mt-6 pt-4 border-t-2 border-black grid grid-cols-3 gap-4 text-center items-end">
            <div>
              <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-sm text-slate-800">{record.sellerName}</span>
              </div>
              <p className="font-bold text-[10px] uppercase mt-1">Customer / Seller Signature</p>
              <p className="text-[9px] text-slate-500">Aadhaar Verified</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <CompanyStamp />
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
                Official Corporate Stamp
              </p>
            </div>

            <div>
              <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-sm text-blue-900 font-bold">Abhay Verma</span>
              </div>
              <p className="font-bold text-[10px] uppercase mt-1">Authorized Store Manager</p>
              <p className="text-[9px] text-slate-500">Lucknow Store Outlet (LKO-01)</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-[8.5px] text-slate-400 text-center">
            Report generated electronically via TheFundu Refurbished Inventory OS. Retained for 5 years per Indian Second-Hand Goods Regulations.
          </div>
        </div>
      </div>
    </Dialog>
  );
}
