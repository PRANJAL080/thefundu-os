"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  Printer,
  Download,
  Share2,
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BuybackRecord } from "@/lib/types";
import { downloadInvoicePDF, downloadInvoiceImage } from "@/lib/pdfDownloader";
import { useApp } from "@/lib/store";
import { StorePurchaseReceipt, formatReceiptDate } from "./StorePurchaseReceipt";

interface StorePurchaseReceiptModalProps {
  record: BuybackRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenKycReport?: () => void;
}

export function StorePurchaseReceiptModal({
  record,
  isOpen,
  onClose,
  onOpenKycReport,
}: StorePurchaseReceiptModalProps) {
  const { showToast } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingImg, setIsDownloadingImg] = useState(false);

  // Series Prefix Option:
  // User request: "iska serial no bhi same rakhna series bass changes kar dena pata chal jaye ki sell ka bill ha"
  // Default series: TF-PUR- (Purchase/Sell) or TF- (as in uploaded sample)
  const [seriesPrefix, setSeriesPrefix] = useState<string>("TF-PUR-");
  const [customServiceNo, setCustomServiceNo] = useState<string>("");

  const receiptRef = useRef<HTMLDivElement>(null);

  // Compute standard service number
  const computedServiceNumber = useMemo(() => {
    if (customServiceNo.trim()) return customServiceNo.trim();
    if (record?.serviceNumber) {
      if (seriesPrefix === "TF-" && record.serviceNumber.startsWith("TF-")) {
        return record.serviceNumber;
      }
    }
    const rawDate = (record?.date || new Date().toISOString().split("T")[0]).replace(/-/g, "");
    const rawId = record?.id ? record.id.replace(/\D/g, "").slice(-3) : "001";
    const seq = rawId.padStart(3, "0");

    if (seriesPrefix === "TF-") {
      return `TF-${rawDate}-${seq}`;
    }
    if (seriesPrefix === "TF-PUR-") {
      return `TF-PUR-${rawDate}-${seq}`;
    }
    if (seriesPrefix === "TF-SP-") {
      return `TF-SP-${rawDate}-${seq}`;
    }
    return `${seriesPrefix}${rawDate}-${seq}`;
  }, [record, seriesPrefix, customServiceNo]);

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const fileName = `The_Fundu_Store_Purchase_Receipt_${record.finalOfferedPrice || 14000}_${computedServiceNumber}.pdf`;
      const targetEl =
        document.getElementById("store-purchase-receipt-sheet") || receiptRef.current;
      if (!targetEl) throw new Error("Receipt element not found");

      const ok = await downloadInvoicePDF(targetEl, fileName);
      if (ok) {
        showToast("Store Purchase Receipt downloaded directly to your laptop!", "success");
      } else {
        showToast("Direct download failed. Falling back to print dialog.", "error");
        window.print();
      }
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (isDownloadingImg) return;
    setIsDownloadingImg(true);
    try {
      const fileName = `Store_Purchase_Receipt_${computedServiceNumber}.png`;
      const targetEl =
        document.getElementById("store-purchase-receipt-sheet") || receiptRef.current;
      if (!targetEl) throw new Error("Receipt element not found");

      const ok = await downloadInvoiceImage(targetEl, fileName);
      if (ok) {
        showToast("Receipt PNG image downloaded to laptop!", "success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingImg(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `The Fundu - Store Purchase Receipt\nService No: ${computedServiceNumber}\nCustomer: ${record.sellerName}\nDevice: ${record.brand} ${record.model} (${record.storage})\nIMEI: ${record.imei1}\nAmount Paid: ₹${Number(record.finalOfferedPrice).toLocaleString("en-IN")}\nStore: The Fundu Gomti Nagar, Lucknow\nsupport@thefundu.com`;
    const cleanPhone = record.sellerPhone.replace(/\D/g, "");
    const waUrl = cleanPhone
      ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      {/* ========================================================== */}
      {/* TOP CONTROLS & ACTION HEADER BAR                            */}
      {/* ========================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900 border-b border-slate-700 print:hidden text-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Smartphone className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Store Purchase Receipt (Sell Bill)
              </h3>
              <Badge variant="outline" className="text-[10px] bg-teal-950/60 text-teal-300 border-teal-700">
                Customer Buy-in
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              Official Indemnity Bond &amp; Store Purchase Voucher
            </p>
          </div>
        </div>

        {/* Quick Series Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Series Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Series:
            </span>
            <select
              value={seriesPrefix}
              onChange={(e) => {
                setSeriesPrefix(e.target.value);
                setCustomServiceNo("");
              }}
              className="bg-transparent text-white text-xs font-mono font-bold outline-none cursor-pointer"
              title="Change series prefix to clearly identify as a customer sell / store purchase bill"
            >
              <option value="TF-PUR-" className="bg-slate-900 text-white">
                TF-PUR- (Sell / Purchase)
              </option>
              <option value="TF-" className="bg-slate-900 text-white">
                TF- (Standard Sample)
              </option>
              <option value="TF-SP-" className="bg-slate-900 text-white">
                TF-SP- (Store Purchase)
              </option>
            </select>
          </div>

          {/* Direct PDF Download to Laptop */}
          <Button
            size="sm"
            variant="primary"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs h-8 gap-1.5 shadow-sm shadow-teal-900/30"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
          </Button>

          {/* Direct PNG Image Download */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadImage}
            disabled={isDownloadingImg}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8 gap-1.5"
            title="Download Receipt as PNG image"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PNG</span>
          </Button>

          {/* Print Receipt */}
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </Button>

          {/* WhatsApp Share */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleWhatsAppShare}
            className="border-emerald-700/60 text-emerald-400 hover:bg-emerald-950/40 text-xs h-8 gap-1.5"
            title="Share purchase voucher details on WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>

          {/* Optional Link to Police KYC Report */}
          {onOpenKycReport && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenKycReport}
              className="border-blue-700/60 text-blue-400 hover:bg-blue-950/40 text-xs h-8 gap-1.5"
              title="Switch to Aadhaar & Police CEIR Ledger Report"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Police KYC</span>
            </Button>
          )}

          {/* Close Modal */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Service Number Quick Info Sub-bar */}
      <div className="bg-slate-950 px-5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-[11px]">Service Number:</span>
          <span className="font-mono font-bold text-teal-400 text-xs">
            {computedServiceNumber}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span>Date:</span>
          <span className="font-semibold text-slate-200">
            {formatReceiptDate(record.date)}
          </span>
          <span className="mx-1">•</span>
          <span>Offered:</span>
          <span className="font-bold text-emerald-400">
            ₹{Number(record.finalOfferedPrice).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* ========================================================== */}
      {/* RECEIPT PREVIEW BODY (Scrollable White Sheet on Canvas)     */}
      {/* ========================================================== */}
      <div
        ref={receiptRef}
        className="overflow-y-auto max-h-[80vh] p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/50 flex justify-center items-start print:p-0 print:bg-white print:max-h-none"
      >
        <div className="w-full max-w-[794px] bg-white rounded-lg shadow-xl overflow-hidden print:shadow-none print:rounded-none">
          <StorePurchaseReceipt
            record={record}
            serviceNumber={computedServiceNumber}
            receiptDate={record.date}
            sellerName={record.sellerName}
            sellerPhone={record.sellerPhone}
            sellerAddress={record.sellerAddress}
            imei={record.imei1}
            schemeTitle={record.schemeTitle || "Store Purchase"}
            pickupType={record.pickupType || "Store"}
            totalAmount={record.finalOfferedPrice}
            storePartnerName={record.storeLocation || "The Fundu – Gomti Nagar, Lucknow"}
          />
        </div>
      </div>
    </Dialog>
  );
}
