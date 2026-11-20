"use client";

import React, { useRef } from "react";
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Info,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Device, SalesOrder } from "@/lib/types";
import { CompanyInvoiceSheet } from "./CompanyInvoiceSheet";
import { formatINR } from "@/lib/utils";
import { useApp } from "@/lib/store";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device?: Device | null;
  order?: SalesOrder | null;
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
    purchasePrice?: number; // X (Internal Only - Hidden from Customer)
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
  channel?: any;
  typeOfSale?: any;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceTime?: string;
}

export function InvoiceModal({
  isOpen,
  onClose,
  device,
  order,
  customCustomer,
  financials,
  paymentInfo,
  channel,
  typeOfSale,
  invoiceNumber,
  invoiceDate,
  invoiceTime,
}: InvoiceModalProps) {
  const { warehouses, selectedStoreId, invoiceSettings, addSale, showToast } = useApp();
  const currentStore = warehouses.find((w) => w.id === selectedStoreId || w.code === selectedStoreId) || warehouses[0];
  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Sourcing & Profit Calculation for Internal Admin Preview Bar
  const buyCostX = financials?.purchasePrice !== undefined 
    ? financials.purchasePrice 
    : (device?.costs.purchasePrice || 25000);

  const sellPriceY = financials?.sellingPrice !== undefined 
    ? financials.sellingPrice 
    : (Number(order?.sellingPrice) || Number(device?.costs.sellingPrice) || 30000);

  const discountD = financials?.discount !== undefined 
    ? financials.discount 
    : (Number(order?.discount) || 0);

  const finalSellingPrice = Math.max(0, sellPriceY - discountD);
  const profitMarginZ = Math.max(0, finalSellingPrice - buyCostX);
  const marginTax18 = Math.round((profitMarginZ * 18 / 118) * 100) / 100;

  const handlePrint = () => {
    if (device && device.status !== "Sold") {
      const rawId = device.id.replace(/\D/g, "") || "26001";
      const storeCode = (currentStore?.code || "LKO-01").replace(/-/g, "");
      const invNumber = `INV${storeCode}2611-${rawId}`;
      const cleanTitle = `${device.brand} ${device.model} (${device.storage}) Refurbished ${device.colour && device.colour !== "Default Edition" ? device.colour : ""}`.replace(/\s+/g, " ").trim();
      addSale({
        invoiceNumber: invNumber,
        deviceId: device.id,
        deviceModel: cleanTitle,
        imei: device.imei1,
        serialNumber: device.serialNumber || `SN${rawId}`,
        sellingPrice: sellPriceY,
        discount: discountD,
        taxAmount: marginTax18,
        finalAmount: finalSellingPrice,
        paymentMethod: (paymentInfo?.mode as any) || "UPI",
        customerName: customCustomer?.name?.trim() || "Retail Customer",
        customerPhone: customCustomer?.phone?.trim() || "",
        customerEmail: customCustomer?.email?.trim() || "",
        customerAddress: customCustomer?.address?.trim() || "Lucknow, Uttar Pradesh",
        customerAadhaar: customCustomer?.aadhaar || "",
        placeOfSupply: customCustomer?.placeOfSupply || "Uttar Pradesh",
      });
    }
    window.print();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      {/* ACTION & AUDIT HEADER (HIDDEN DURING PRINT) */}
      <div className="space-y-3 pb-3 border-b print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="fundu" size="sm">
              GST Rule 32(5) Margin Scheme Invoice
            </Badge>
            <span className="text-xs text-slate-500 font-mono">
              Format: Certified Refurbished Retail
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs font-semibold"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Invoice</span>
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
          </div>
        </div>

        {/* INTERNAL MARGIN AUDIT BADGE (VISIBLE ONLY TO SELLER/ADMIN, NOT ON BILL) */}
        <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
            <Info className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>
              <strong>Rule 32(5) Valuation:</strong> Buy Cost (X):{" "}
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatINR(buyCostX)}
              </span>{" "}
              | Sell Price (Y):{" "}
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatINR(finalSellingPrice)}
              </span>{" "}
              | Margin (Z):{" "}
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {formatINR(profitMarginZ)}
              </span>{" "}
              | 18% Margin GST:{" "}
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {formatINR(marginTax18)}
              </span>
            </span>
          </div>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded">
            🔒 X ({formatINR(buyCostX)}) is 100% hidden on customer bill
          </span>
        </div>
      </div>

      {/* PRINTABLE SHEET CONTAINER (THEFUNDU STANDARD RETAIL LAYOUT) */}
      <div ref={printContainerRef} className="py-2 overflow-x-auto print:p-0 print:m-0 print:overflow-visible">
        <CompanyInvoiceSheet
          device={device}
          order={order}
          selectedStore={currentStore}
          customTerms={invoiceSettings?.termsAndConditions}
          customCompanyConfig={invoiceSettings}
          customCustomer={customCustomer}
          financials={{
            purchasePrice: buyCostX,
            sellingPrice: sellPriceY,
            discount: discountD,
            taxMode: financials?.taxMode || "inclusive",
          }}
          paymentInfo={paymentInfo}
          channel={channel || order?.channel}
          typeOfSale={typeOfSale || order?.typeOfSale}
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          invoiceTime={invoiceTime}
        />
      </div>
    </Dialog>
  );
}
