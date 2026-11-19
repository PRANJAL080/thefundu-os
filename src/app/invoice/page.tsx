"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Printer,
  Download,
  Search,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  User,
  DollarSign,
  Lock,
  EyeOff,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  BadgePercent,
  Calculator,
  MessageSquare,
  Share2,
  Store,
  MapPin,
  Sliders,
  ReceiptText,
  Copy,
  Trash2,
  ExternalLink,
  RefreshCw,
  Eye,
  Calendar,
  CreditCard,
  Building2,
  Filter,
  Phone,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Device, SalesOrder, SalesChannelCode, SaleTypeCode } from "@/lib/types";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CompanyInvoiceSheet } from "@/components/invoice/CompanyInvoiceSheet";
import { InvoiceModal } from "@/components/invoice/InvoiceModal";
import { InvoiceSettingsModal } from "@/components/invoice/InvoiceSettingsModal";
import { formatINR } from "@/lib/utils";
import { exportGSTRule32AuditCSV, exportSavedBillsCSV } from "@/lib/exportGSTRule32";

export default function InvoiceGeneratorPage() {
  const {
    devices,
    warehouses,
    selectedStoreId,
    setSelectedStoreId,
    invoiceSettings,
    addSale,
    deleteSale,
    sales,
    showToast,
    isCashierMode,
  } = useApp();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Active Tab: "generator" (create/print bill) or "history" (all saved bills)
  const [activeTab, setActiveTab] = useState<"generator" | "history">("generator");

  // Saved Bills History filters and state
  const [historySearch, setHistorySearch] = useState("");
  const [historyPaymentFilter, setHistoryPaymentFilter] = useState("all");
  const [historyStoreFilter, setHistoryStoreFilter] = useState("all");
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState<SalesOrder | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [copiedImei, setCopiedImei] = useState<string | null>(null);

  // Auto-switch to history tab if ?tab=history is in the URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "history" || params.get("tab") === "saved") {
        setActiveTab("history");
      }
    }
  }, []);

  // Active Store Outlet (Dynamic multi-store support)
  const currentStore =
    warehouses.find((w) => w.id === selectedStoreId || w.code === selectedStoreId) ||
    warehouses[0] ||
    COMPANY_CONFIG.primaryStore;

  const storeCode = currentStore?.code || "LKO-01";
  const cleanStoreCode = storeCode.replace(/-/g, "");

  // Active In-Stock devices available for billing (automatically excludes Sold handsets!)
  const inStockDevices = useMemo(() => {
    return devices.filter((d) => d.status === "In Stock" || d.status === "Ready for Sale");
  }, [devices]);

  // Selected device for invoicing (defaults to first in-stock handset)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    devices.find((d) => d.status === "In Stock" || d.status === "Ready for Sale")?.id || devices[0]?.id || "Fun-26001"
  );
  const selectedDevice =
    devices.find((d) => d.id === selectedDeviceId) ||
    inStockDevices[0] ||
    devices[0];

  // Customer State
  const [customerName, setCustomerName] = useState("Abhay verma");
  const [customerPhone, setCustomerPhone] = useState("7991990508");
  const [customerEmail, setCustomerEmail] = useState("abhayverma7380@gmail.com");
  const [customerAadhaar, setCustomerAadhaar] = useState("");
  const [customerLocalAddress, setCustomerLocalAddress] = useState(
    "Gomti nagar, Lucknow, Uttar Pradesh, 226010"
  );
  const [customerPermanentAddress, setCustomerPermanentAddress] = useState(
    "Gomti nagar, Lucknow, Uttar Pradesh, 226010"
  );
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [customerGstin, setCustomerGstin] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("Uttar Pradesh");

  // Address & Aadhaar handler helpers
  const handleLocalAddressChange = (addr: string) => {
    setCustomerLocalAddress(addr);
    if (isSameAddress) {
      setCustomerPermanentAddress(addr);
    }
  };

  const handleSameAddressToggle = (checked: boolean) => {
    setIsSameAddress(checked);
    if (checked) {
      setCustomerPermanentAddress(customerLocalAddress);
    }
  };

  const handleAadhaarChange = (val: string) => {
    const cleaned = val.replace(/[^\d]/g, "").slice(0, 12);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCustomerAadhaar(formatted);
  };

  // -------------------------------------------------------------
  // GST RULE 32(5) MARGIN SCHEME COMMERCIALS:
  // X = Buy / Sourcing Price (CONFIDENTIAL - HIDDEN ON CUSTOMER BILL)
  // Y = Sell / Retail Price
  // D = Promotional Discount
  // Z = Profit Margin (Y - D - X)
  // 18% GST applies strictly on Z!
  // -------------------------------------------------------------
  const [purchasePriceX, setPurchasePriceX] = useState<number>(
    selectedDevice?.costs.purchasePrice || 25000
  );
  const [sellingPriceY, setSellingPriceY] = useState<number>(
    selectedDevice?.costs.sellingPrice || 30000
  );
  const [discountD, setDiscountD] = useState<number>(0);
  const [taxMode, setTaxMode] = useState<"inclusive" | "exclusive">("inclusive");

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState("Google Pay");
  const [paymentMode, setPaymentMode] = useState<string>("UPI");
  // Split Payment (Cash + Online / UPI) breakdown
  const [splitCashAmount, setSplitCashAmount] = useState<number>(10000);
  const [splitOnlineAmount, setSplitOnlineAmount] = useState<number>(20000);
  const [splitOnlineMode, setSplitOnlineMode] = useState<string>("Google Pay");

  const [txnId, setTxnId] = useState("TXN26001LKO982");
  const [warrantyDays, setWarrantyDays] = useState(180);
  const [channel, setChannel] = useState<SalesChannelCode>("FSO");
  const [typeOfSale, setTypeOfSale] = useState<SaleTypeCode>("B2C");

  // Derived Financials
  const finalSellingPrice = Math.max(0, sellingPriceY - discountD);
  const profitMarginZ = Math.max(0, finalSellingPrice - purchasePriceX);

  const totalMarginTax =
    profitMarginZ > 0
      ? taxMode === "inclusive"
        ? Math.round((profitMarginZ * 18 / 118) * 100) / 100
        : Math.round((profitMarginZ * 0.18) * 100) / 100
      : 0;

  const marginCgst = Math.round((totalMarginTax / 2) * 100) / 100;
  const marginSgst = Math.round((totalMarginTax - marginCgst) * 100) / 100;
  const netProfitAfterTax = Math.round((profitMarginZ - (taxMode === "inclusive" ? totalMarginTax : 0)) * 100) / 100;

  const rawId = selectedDevice?.id ? selectedDevice.id.replace("Fun-", "").replace("TFD-", "") : "26001";
  const invoiceNumber = `INV${cleanStoreCode}2611-${rawId}`;
  const channelOrderNo = `#${channel}-${storeCode}-${rawId}`;
  const orderNo = `TFD-${channel}-2611-${rawId}`;

  // Split payment helper functions
  const handlePaymentModeChange = (newMode: string) => {
    setPaymentMode(newMode);
    if (newMode === "Cash") {
      setPaymentMethod("Cash Desk");
      setTxnId("Store Cash Counter");
    } else if (newMode === "UPI") {
      setPaymentMethod("Google Pay");
      if (!txnId || txnId === "Store Cash Counter") setTxnId(`TXN${rawId}LKO982`);
    } else if (newMode === "Card") {
      setPaymentMethod("Credit Card");
      if (!txnId || txnId === "Store Cash Counter") setTxnId(`POS${rawId}LKO`);
    } else if (newMode === "NetBanking") {
      setPaymentMethod("Net Banking");
      if (!txnId || txnId === "Store Cash Counter") setTxnId(`NEFT${rawId}LKO`);
    }
    if (newMode === "Split") {
      const half = Math.round(finalSellingPrice / 2);
      setSplitCashAmount(half);
      setSplitOnlineAmount(Math.max(0, finalSellingPrice - half));
      if (!txnId || txnId === "Store Cash Counter") setTxnId(`UPI${rawId}LKO`);
    }
  };

  const handleSplitCashChange = (cashVal: number) => {
    const cash = Math.max(0, isNaN(cashVal) ? 0 : cashVal);
    setSplitCashAmount(cash);
    setSplitOnlineAmount(Math.max(0, finalSellingPrice - cash));
  };

  const handleSplitOnlineChange = (onlineVal: number) => {
    const online = Math.max(0, isNaN(onlineVal) ? 0 : onlineVal);
    setSplitOnlineAmount(online);
    setSplitCashAmount(Math.max(0, finalSellingPrice - online));
  };

  const handleSetEqualSplit = () => {
    const half = Math.round(finalSellingPrice / 2);
    setSplitCashAmount(half);
    setSplitOnlineAmount(Math.max(0, finalSellingPrice - half));
  };

  // When device dropdown changes, pre-fill its costs
  const handleDeviceChange = (devId: string) => {
    setSelectedDeviceId(devId);
    const dev = devices.find((d) => d.id === devId);
    if (dev) {
      setPurchasePriceX(dev.costs.purchasePrice || 25000);
      const newSell = dev.costs.sellingPrice || 30000;
      setSellingPriceY(newSell);
      const newFinal = Math.max(0, newSell - discountD);
      const half = Math.round(newFinal / 2);
      setSplitCashAmount(half);
      setSplitOnlineAmount(Math.max(0, newFinal - half));
    }
  };

  // Centralized Auto-Record Invoice Function:
  // Automatically saves complete bill details (IMEI, Fun Code, Aadhaar, Addresses, Split Payments, Store)
  // whenever someone Prints, Downloads PDF, sends WhatsApp, or Issues an Invoice!
  const autoRecordCurrentInvoice = () => {
    if (!selectedDevice) return null;
    const cleanTitle = `${selectedDevice.brand} ${selectedDevice.model} (${selectedDevice.storage}) Refurbished ${selectedDevice.colour && selectedDevice.colour !== "Default Edition" ? selectedDevice.colour : ""}`.replace(/\s+/g, " ").trim();

    const recordedSale = addSale({
      customerName,
      customerPhone,
      customerEmail,
      customerAddress: customerLocalAddress,
      customerLocalAddress,
      customerPermanentAddress,
      customerAadhaar: customerAadhaar.trim() || undefined,
      customerGstin,
      placeOfSupply,
      channel,
      typeOfSale,
      invoiceNumber,
      deviceId: selectedDevice.id,
      deviceModel: cleanTitle,
      imei: selectedDevice.imei1,
      serialNumber: selectedDevice.serialNumber || `SN${rawId}`,
      sellingPrice: sellingPriceY,
      discount: discountD,
      taxAmount: totalMarginTax,
      finalAmount: finalSellingPrice,
      purchasePrice: purchasePriceX,
      profitMargin: profitMarginZ,
      paymentMethod: paymentMode === "Split" ? "Split (Cash + Online)" : (paymentMode as any),
      paymentTxnId: paymentMode === "Cash" ? "Store Cash Counter" : (txnId || "Store Cash Counter"),
      splitPayment: paymentMode === "Split" ? {
        cashAmount: splitCashAmount,
        onlineAmount: splitOnlineAmount,
        onlineMode: splitOnlineMode,
        onlineTxnId: txnId,
      } : undefined,
      paymentStatus: "Completed",
      deliveryStatus: "Delivered",
      warrantyMonths: Math.round(warrantyDays / 30),
      storeName: currentStore.name,
      storeCode: currentStore.code,
    });

    // Automatically advance the desk to the next available in-stock handset
    const nextInStock = devices.find(
      (d) =>
        (d.status === "In Stock" || d.status === "Ready for Sale") &&
        d.id !== selectedDevice.id
    );
    if (nextInStock) {
      setTimeout(() => {
        handleDeviceChange(nextInStock.id);
      }, 50);
    }

    return recordedSale;
  };

  const handlePrint = () => {
    autoRecordCurrentInvoice();
    window.print();
    showToast(`Tax Invoice ${invoiceNumber} for ${selectedDevice?.id || "Handset"} saved & printed!`, "success");
  };

  const handleSendWhatsApp = () => {
    autoRecordCurrentInvoice();
    const cleanPhone = customerPhone.replace(/\D/g, "");
    const serialNo = selectedDevice?.serialNumber || `SN${selectedDevice?.id.replace(/\D/g, "") || "26001"}`;
    const cleanTitle = selectedDevice
      ? `${selectedDevice.brand} ${selectedDevice.model} (${selectedDevice.storage}) Refurbished ${selectedDevice.colour && selectedDevice.colour !== "Default Edition" ? selectedDevice.colour : ""}`.replace(/\s+/g, " ").trim()
      : "Apple iPhone Refurbished";

    const paymentSummaryText = paymentMode === "Split"
      ? `Split Payment (Cash: ₹${splitCashAmount.toLocaleString()} + ${splitOnlineMode}: ₹${splitOnlineAmount.toLocaleString()})`
      : paymentMode;

    const msg = 
`Hi ${customerName}! Thank you for choosing TheFundu (${invoiceSettings?.companyLegalName || "Esterline Bonaparte Corp"})! 🎉

Your ${cleanTitle} Tax Invoice (${invoiceNumber}) & ${warrantyDays}-day official warranty card are ready!

📄 Invoice Amount: ₹${finalSellingPrice.toLocaleString()}
💳 Payment Method: ${paymentSummaryText}
🛡️ Digital Warranty & 42-Point QC Pass Certificate:
https://thefundu.com/verify/${serialNo}

📍 Store Outlet: ${currentStore.name} — ${currentStore.address}
📞 Helpline: ${invoiceSettings?.tollFree || "1800-THE-FUNDU"}

Have a wonderful experience with your device!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${cleanPhone}?text=${encoded}`, "_blank");
    showToast(`WhatsApp bill dispatched & recorded for ${customerName}!`, "success");
  };

  const handleSaveAndIssue = () => {
    if (!selectedDevice) return;
    if (selectedDevice.status === "Sold") {
      showToast(`Handset ${selectedDevice.id} pehle se Sold ho chuka hai! Doosra phone select karein.`, "error");
      return;
    }
    autoRecordCurrentInvoice();
    setActiveTab("history");
    showToast(`Tax Invoice ${invoiceNumber} created & recorded! Handset stock se hata diya gaya.`, "success");
  };

  const handleCopyImei = (imei: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(imei);
      setCopiedImei(imei);
      showToast(`IMEI ${imei} copied to clipboard!`, "info");
      setTimeout(() => setCopiedImei(null), 2500);
    }
  };

  const handleSendWhatsAppForOrder = (order: SalesOrder) => {
    const cleanPhone = order.customerPhone.replace(/\D/g, "");
    const serialNo = order.serialNumber || `SN${order.deviceId?.replace(/\D/g, "") || "26001"}`;
    const paymentSummaryText = order.splitPayment
      ? `Split Payment (Cash: ₹${order.splitPayment.cashAmount?.toLocaleString()} + ${order.splitPayment.onlineMode}: ₹${order.splitPayment.onlineAmount?.toLocaleString()})`
      : order.paymentMethod;

    const msg = 
`Hi ${order.customerName}! Here is your duplicate tax invoice & warranty certificate from TheFundu! 🎉

Handset: ${order.deviceModel}
Invoice No: ${order.invoiceNumber || order.id}
Handset Code: ${order.deviceId}
Primary IMEI: ${order.imei}
Billed Amount: ₹${Number(order.finalAmount || order.sellingPrice).toLocaleString()}
Payment Method: ${paymentSummaryText}

🛡️ Official Digital Warranty Certificate:
https://thefundu.com/verify/${serialNo}

📍 Store: ${order.storeName || "Lucknow Flagship Store (LKO-01)"}
📞 Helpline: ${invoiceSettings?.tollFree || "1800-THE-FUNDU"}`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${cleanPhone}?text=${encoded}`, "_blank");
    showToast(`WhatsApp invoice dispatched to ${order.customerName}!`, "success");
  };

  // Saved Bills History Filter Logic
  const filteredHistorySales = sales.filter((s) => {
    const q = historySearch.toLowerCase().trim();
    const cleanQNoSpaces = q.replace(/\s+/g, "");
    const matchesSearch =
      !q ||
      (s.imei && s.imei.includes(q)) ||
      (s.deviceId && s.deviceId.toLowerCase().includes(q)) ||
      (s.deviceId && s.deviceId.replace(/\D/g, "").includes(q)) ||
      (s.invoiceNumber && s.invoiceNumber.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.customerName && s.customerName.toLowerCase().includes(q)) ||
      (s.customerPhone && s.customerPhone.includes(q)) ||
      (s.customerAadhaar && s.customerAadhaar.replace(/\s+/g, "").includes(cleanQNoSpaces)) ||
      (s.deviceModel && s.deviceModel.toLowerCase().includes(q));

    const matchesPayment =
      historyPaymentFilter === "all" ||
      (historyPaymentFilter === "Split" && (s.paymentMethod?.includes("Split") || s.splitPayment)) ||
      (historyPaymentFilter === "Cash" && s.paymentMethod === "Cash" && !s.splitPayment) ||
      (historyPaymentFilter === "UPI" && s.paymentMethod === "UPI" && !s.splitPayment) ||
      (historyPaymentFilter === "Card" && s.paymentMethod === "Card" && !s.splitPayment);

    const matchesStore =
      historyStoreFilter === "all" ||
      (s.storeCode && s.storeCode === historyStoreFilter) ||
      (s.channelName && s.channelName.includes(historyStoreFilter));

    return matchesSearch && matchesPayment && matchesStore;
  });

  const totalBilledRevenue = sales.reduce((acc, s) => acc + (s.finalAmount || s.sellingPrice || 0), 0);
  const totalMarginTaxAudited = sales.reduce((acc, s) => acc + (s.taxAmount || 0), 0);
  const totalSplitBills = sales.filter((s) => s.paymentMethod?.includes("Split") || s.splitPayment).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Tax Invoice & GST Margin Bill Desk
            </h1>
            <Badge variant="fundu" size="sm">
              GST Rule 32(5) Compliant
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise refurbished smartphone billing desk. 18% GST applies strictly on profit margin (Y - X), with internal purchase price (X) 100% hidden on the customer bill.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportGSTRule32AuditCSV(devices);
              showToast("Downloaded GST Rule 32(5) GSTR-1 Margin Report for CA Audit!", "success");
            }}
            className="gap-1.5 border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/40"
            title="Download Excel/CSV with Rule 32(5) Tax Margin Breakdown for Chartered Accountants"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export CA Margin Audit</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 shadow-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Invoice</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSendWhatsApp}
            className="gap-1.5 shadow-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
            title="Dispatch 1-Click WhatsApp Invoice & Warranty Link to Customer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Send WhatsApp Bill</span>
          </Button>

          <Button
            variant="fundu"
            size="sm"
            onClick={handleSaveAndIssue}
            className="gap-1.5 shadow-xs font-semibold"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Issue & Record Sale</span>
          </Button>
        </div>
      </div>

      {/* SECTION TABS: Generator vs Saved Bills & Invoices History */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3 flex-wrap print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
              activeTab === "generator"
                ? "bg-fundu-600 text-white shadow-fundu-200 dark:shadow-none ring-2 ring-fundu-600/30"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Create &amp; Print Bill (नया बिल बनाएं)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
              activeTab === "history"
                ? "bg-fundu-600 text-white shadow-fundu-200 dark:shadow-none ring-2 ring-fundu-600/30"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80"
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Saved Bills Ledger (सुरक्षित बिलों का लेजर)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === "history"
                  ? "bg-white/20 text-white"
                  : "bg-fundu-100 dark:bg-fundu-950/80 text-fundu-700 dark:text-fundu-300"
              }`}
            >
              {sales.length} Bills
            </span>
          </button>
        </div>

        {activeTab === "generator" ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("history")}
            className="text-xs gap-1.5 font-semibold text-slate-700 dark:text-slate-300"
          >
            <ReceiptText className="w-3.5 h-3.5 text-fundu-600" />
            <span>View All Saved Bills ({sales.length})</span>
          </Button>
        ) : (
          <Button
            variant="fundu"
            size="sm"
            onClick={() => setActiveTab("generator")}
            className="text-xs gap-1.5 font-semibold"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>+ Create New Tax Invoice</span>
          </Button>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INVOICE GENERATOR & CUSTOMER BILL PREVIEW               */}
      {/* ============================================================== */}
      {activeTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Input Parameters & Margin Calculator (Hidden in Print) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          {/* Card 0: Store Outlet & Billing Location */}
          <Card className="border-fundu-200 dark:border-fundu-900 bg-gradient-to-r from-fundu-50/40 via-white to-transparent dark:from-fundu-950/20 dark:via-slate-900">
            <CardHeader className="pb-2.5 border-b border-fundu-100 dark:border-fundu-950">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Store className="h-4 w-4 text-fundu-600" />
                  <span>Store Outlet (Billing Branch)</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="h-7 text-[11px] gap-1 border-fundu-300 text-fundu-700 bg-white hover:bg-fundu-50 dark:bg-slate-900 dark:border-fundu-800 dark:text-fundu-300 shadow-2xs"
                >
                  <Sliders className="h-3 w-3" />
                  <span>Invoice &amp; Store Settings</span>
                </Button>
              </div>
              <CardDescription className="text-[11px]">
                Invoice supplier box, jurisdiction, and order numbers automatically track this store outlet.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Active Store Outlet *</label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code}) — {w.city}
                    </option>
                  ))}
                </select>
              </div>

              {currentStore && (
                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-fundu-100 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-fundu-600 shrink-0" />
                      <span>{currentStore.name}</span>
                    </span>
                    <Badge variant="fundu" size="sm">
                      {currentStore.code}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[10.5px] pl-5">
                    {currentStore.address}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pl-5 pt-0.5 border-t border-slate-100 dark:border-slate-800/80">
                    <span>Head: {currentStore.managerName || "Store Head"}</span>
                    <span className="font-mono">{(currentStore as any).managerPhone || (currentStore as any).phone || "+91 79919 90508"}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 1: Select Handset */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-fundu-600" />
                  <span>1. Select In-Stock Handset</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  {inStockDevices.length} In-Stock Available
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  Choose Available Handset *{" "}
                  <span className="text-slate-400 font-normal text-[10px]">
                    (Bill bante hi phone automatic stock se hat jayega)
                  </span>
                </label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  {inStockDevices.length === 0 ? (
                    <option value="">No In-Stock Handsets Left (All Sold)</option>
                  ) : (
                    inStockDevices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.id} — {d.brand} {d.model} ({d.storage}, {d.colour}) • ₹{d.costs.sellingPrice?.toLocaleString()}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {selectedDevice?.status === "Sold" && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse shrink-0" />
                  <span>Yeh handset ({selectedDevice.id}) SOLD ho chuka hai (Bill Already Issued).</span>
                </div>
              )}

              {selectedDevice && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border text-[11px] space-y-1">
                  <p>
                    <strong>Brand & Model:</strong> {selectedDevice.brand} {selectedDevice.model} ({selectedDevice.storage}, {selectedDevice.colour})
                  </p>
                  <p>
                    <strong>IMEI 1:</strong> <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedDevice.imei1}</span>
                  </p>
                  {selectedDevice.imei2 && (
                    <p>
                      <strong>IMEI 2:</strong> <span className="font-mono text-slate-600 dark:text-slate-400">{selectedDevice.imei2}</span>
                    </p>
                  )}
                  <p>
                    <strong>Battery Health:</strong> {selectedDevice.batteryHealth}% (Apple Maximum Capacity)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: RULE 32(5) MARGIN SCHEME PRICING & SIMULATOR */}
          <Card className="border-fundu-200 dark:border-fundu-900 bg-gradient-to-b from-fundu-50/20 to-transparent">
            <CardHeader className="pb-3 border-b border-fundu-100 dark:border-fundu-950">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Calculator className="h-4 w-4 text-fundu-600" />
                  <span>2. Commercials & GST Rule 32(5)</span>
                </CardTitle>
                <Badge variant="fundu" size="sm">
                  Margin Scheme
                </Badge>
              </div>
              <CardDescription className="text-[11px]">
                18% GST applies only on Profit Margin (Z = Y - X). Purchase Cost (X) is strictly hidden from the customer invoice.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-3 space-y-4 text-xs">
              {/* Inputs for X, Y, D */}
              <div className="grid grid-cols-2 gap-3">
                {/* Buy Cost X (Hidden in Cashier Mode) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>Buy Cost (X)</span>
                      <span title={isCashierMode ? "Protected by Cashier Mode" : "Hidden from Customer"}>
                        <Lock className="h-3 w-3 text-amber-600" />
                      </span>
                    </label>
                    <span className="text-[9px] text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-1 rounded">
                      {isCashierMode ? "Cashier Protected" : "Internal Only"}
                    </span>
                  </div>
                  {isCashierMode ? (
                    <div className="h-9 px-3 flex items-center rounded-lg border border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono text-xs select-none">
                      •••••••• (Restricted)
                    </div>
                  ) : (
                    <Input
                      type="number"
                      value={purchasePriceX}
                      onChange={(e) => setPurchasePriceX(Number(e.target.value))}
                      className="font-mono font-semibold"
                    />
                  )}
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    {isCashierMode ? "Sourcing cost hidden in cashier mode" : `Phone sourcing cost (X = ₹${purchasePriceX.toLocaleString()})`}
                  </p>
                </div>

                {/* Sell Price Y */}
                <div>
                  <label className="font-semibold block mb-1">
                    Sell Price (Y) *
                  </label>
                  <Input
                    type="number"
                    value={sellingPriceY}
                    onChange={(e) => setSellingPriceY(Number(e.target.value))}
                    className="font-mono font-bold text-fundu-700 dark:text-fundu-400"
                  />
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    Customer retail price (Y = ₹{sellingPriceY.toLocaleString()})
                  </p>
                </div>
              </div>

              {/* Discount & Tax Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Discount (D)</label>
                  <Input
                    type="number"
                    value={discountD}
                    onChange={(e) => setDiscountD(Number(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Margin Tax Mode</label>
                  <select
                    value={taxMode}
                    onChange={(e) => setTaxMode(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="inclusive">Inclusive (Cashify / B2C Standard)</option>
                    <option value="exclusive">Exclusive (Add 18% on Margin)</option>
                  </select>
                </div>
              </div>

              {/* LIVE MARGIN AUDIT CARD */}
              <div className="p-3.5 rounded-xl border border-fundu-200 dark:border-fundu-800 bg-fundu-50/40 dark:bg-fundu-950/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold border-b border-fundu-200/60 pb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Rule 32(5) Valuation Breakdown:</span>
                  <span className="text-fundu-700 dark:text-fundu-400 font-mono">
                    {isCashierMode ? "•••••• (Locked)" : `Margin Z = ${formatINR(profitMarginZ)}`}
                  </span>
                </div>

                {isCashierMode ? (
                  <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-lg text-center space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      POS Cashier Mode Active
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Customer Retail Price: <strong>{formatINR(finalSellingPrice)}</strong>. Purchase cost and gross margins are restricted to Store Manager / Admin.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone Purchase Cost (X):</span>
                      <span className="font-mono font-semibold">{formatINR(purchasePriceX)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer Selling Price (Y):</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {formatINR(finalSellingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-emerald-700 dark:text-emerald-400 border-t pt-1">
                      <span>Gross Profit Margin (Z = Y - X):</span>
                      <span className="font-mono">{formatINR(profitMarginZ)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>18% GST on Margin:</span>
                      <span className="font-mono font-bold">{formatINR(totalMarginTax)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pl-3">
                      <span>• Margin SGST (9%):</span>
                      <span className="font-mono">{formatINR(marginSgst)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pl-3">
                      <span>• Margin CGST (9%):</span>
                      <span className="font-mono">{formatINR(marginCgst)}</span>
                    </div>
                  </div>
                )}

                {/* Privacy Guarantee Note */}
                <div className="mt-2 pt-2 border-t border-fundu-200/60 flex items-start gap-1.5 text-[10px] text-emerald-800 dark:text-emerald-300">
                  <EyeOff className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                  <span>
                    <strong>Customer Privacy Guard:</strong> Sourcing cost ({formatINR(purchasePriceX)}) is strictly internal. The customer bill displays Selling Price ({formatINR(finalSellingPrice)}) and the statutory Margin GST breakdown.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

                    {/* Sales Channel & Type of Sale */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sales Channel &amp; Commercial Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Sales Channel *</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as SalesChannelCode)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="FSO">FSO — Fundu Store Outlet (Retail)</option>
                    <option value="ONS">ONS — Online Store (Web/Marketplace)</option>
                    <option value="FOR">FOR — Repair &amp; Service Desk</option>
                    <option value="DS">DS — Doorstep Direct Sales</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Type of Sale *</label>
                  <select
                    value={typeOfSale}
                    onChange={(e) => setTypeOfSale(e.target.value as SaleTypeCode)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="B2C">B2C — Retail Individual Customer</option>
                    <option value="B2B">B2B — Wholesale / Dealer / Reseller</option>
                    <option value="Corporate">Corporate — Enterprise / Fleet</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Customer Details */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-fundu-600" />
                  <span>3. Buyer / Customer Information</span>
                </CardTitle>
                <Badge variant="outline" size="sm" className="text-[10px]">
                  KYC &amp; Invoice Billing
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Customer Full Name *</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full legal customer name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Mobile Number *</label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email Address</label>
                  <Input
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>
              </div>

              {/* AADHAAR CARD FIELD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Aadhaar Card Number (12-Digit UID)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Government KYC</span>
                </div>
                <Input
                  value={customerAadhaar}
                  onChange={(e) => handleAadhaarChange(e.target.value)}
                  placeholder="e.g. 5482 9102 3847"
                  className="font-mono tracking-wider font-semibold"
                  maxLength={14}
                />
              </div>

              {/* LOCAL / CURRENT ADDRESS */}
              <div>
                <label className="font-semibold block mb-1 text-slate-800 dark:text-slate-200">
                  📍 Local / Current Address * <span className="text-[10.5px] font-normal text-slate-500">(स्थानीय पता / Delivery Address)</span>
                </label>
                <Input
                  value={customerLocalAddress}
                  onChange={(e) => handleLocalAddressChange(e.target.value)}
                  placeholder="House/Flat No, Area, Landmark, City, Pincode"
                />
              </div>

              {/* PERMANENT ADDRESS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block text-slate-800 dark:text-slate-200">
                    🏠 Permanent Address * <span className="text-[10.5px] font-normal text-slate-500">(स्थायी पता / Aadhaar Address)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-fundu-700 dark:text-fundu-400 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isSameAddress}
                      onChange={(e) => handleSameAddressToggle(e.target.checked)}
                      className="rounded border-slate-300 text-fundu-600 focus:ring-fundu-500 h-3.5 w-3.5"
                    />
                    <span>Same as Local Address</span>
                  </label>
                </div>
                <Input
                  value={customerPermanentAddress}
                  disabled={isSameAddress}
                  onChange={(e) => setCustomerPermanentAddress(e.target.value)}
                  placeholder="Permanent village / hometown / Aadhaar address"
                  className={isSameAddress ? "bg-slate-50 dark:bg-slate-800/50 text-slate-500" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Customer GSTIN (Optional)</label>
                  <Input
                    placeholder="e.g. 09AALCR4945H1ZW"
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Place of Supply</label>
                  <Input
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Payment & Warranty */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-fundu-600" />
                <span>4. Payment & Warranty Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => handlePaymentModeChange(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-medium"
                  >
                    <option value="UPI">UPI (GooglePay / PhonePe / QR)</option>
                    <option value="Card">Credit / Debit Card (POS)</option>
                    <option value="NetBanking">Net Banking / NEFT / IMPS</option>
                    <option value="Cash">Cash on Counter</option>
                    <option value="Split">⚡ Split Payment (Cash + Online / UPI)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-medium"
                  >
                    <option value="Google Pay">Google Pay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="BHIM UPI">BHIM UPI / QR</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash Desk">Cash Desk</option>
                  </select>
                </div>
              </div>

              {/* SPLIT PAYMENT BREAKDOWN UI */}
              {paymentMode === "Split" && (
                <div className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 dark:text-emerald-300">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>Split Payment Breakdown (Cash + Online)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSetEqualSplit}
                      className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-800"
                    >
                      50/50 Equal Split
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold block mb-1 text-[11px] text-slate-700 dark:text-slate-300">
                        💵 Cash Amount (₹)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={splitCashAmount}
                        onChange={(e) => handleSplitCashChange(Number(e.target.value))}
                        placeholder="Cash amount in ₹"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-[11px] text-slate-700 dark:text-slate-300">
                        📱 Online / UPI Amount (₹)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={splitOnlineAmount}
                        onChange={(e) => handleSplitOnlineChange(Number(e.target.value))}
                        placeholder="Online amount in ₹"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold block mb-1 text-[11px] text-slate-700 dark:text-slate-300">
                        Online Method
                      </label>
                      <select
                        value={splitOnlineMode}
                        onChange={(e) => setSplitOnlineMode(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                      >
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BHIM UPI">BHIM UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Net Banking">Net Banking</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-[11px] text-slate-700 dark:text-slate-300">
                        Transaction ID / UPI Ref
                      </label>
                      <Input
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder="UPI Ref / UTR / Txn ID"
                      />
                    </div>
                  </div>

                  {/* Verification / Match Status Bar */}
                  <div className={`p-2 rounded-lg text-[11px] flex items-center justify-between font-medium border ${
                    splitCashAmount + splitOnlineAmount === finalSellingPrice
                      ? "bg-emerald-100/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
                      : "bg-amber-100/70 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
                  }`}>
                    <div>
                      <span>Total: ₹{finalSellingPrice.toLocaleString()}</span>
                      <span className="mx-1.5">•</span>
                      <span>Cash: ₹{splitCashAmount.toLocaleString()}</span>
                      <span className="mx-1">+</span>
                      <span>Online: ₹{splitOnlineAmount.toLocaleString()}</span>
                    </div>

                    {splitCashAmount + splitOnlineAmount === finalSellingPrice ? (
                      <span className="font-bold flex items-center gap-1 text-emerald-800 dark:text-emerald-200">
                        ✓ Exactly Matched
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSplitOnlineAmount(Math.max(0, finalSellingPrice - splitCashAmount))}
                        className="underline font-bold text-amber-800 dark:text-amber-200 hover:text-amber-900"
                      >
                        Diff: ₹{Math.abs(finalSellingPrice - (splitCashAmount + splitOnlineAmount))} (Auto-Balance)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {paymentMode !== "Split" && paymentMode !== "Cash" && (
                <div>
                  <label className="font-semibold block mb-1">Transaction ID / UPI Ref *</label>
                  <Input
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="e.g. TXN26001LKO982 or 12-digit UPI UTR"
                  />
                </div>
              )}

              {paymentMode === "Cash" && (
                <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                    <span className="text-base">💵</span>
                    <span>Full Cash Payment: Transaction ID not required</span>
                  </div>
                  <span className="font-semibold font-mono text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                    Store Cash Counter
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">TheFundu Warranty (Days)</label>
                <select
                  value={warrantyDays}
                  onChange={(e) => setWarrantyDays(Number(e.target.value))}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value={180}>180 Days (6 Months Cashify Standard)</option>
                  <option value={365}>365 Days (12 Months Annual Comprehensive)</option>
                  <option value={90}>90 Days (Quarterly Guarantee)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Live Customer Tax Invoice (Identical to Cashify PDF) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 space-y-2">
            <div className="flex items-center justify-between pb-1 print:hidden">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-fundu-600" />
                <span>Live PDF Invoice Preview (A4 Formatted)</span>
              </span>
              <span className="text-[10px] text-slate-400">
                Click &quot;Print Invoice&quot; to print or save as PDF
              </span>
            </div>

            {/* LIVE INVOICE SHEET CONTAINER WITH BOX SHADOW */}
            <div className="bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md overflow-x-auto print:p-0 print:border-0 print:bg-white print:shadow-none">
              <CompanyInvoiceSheet
                device={selectedDevice}
                selectedStore={currentStore}
                customTerms={invoiceSettings?.termsAndConditions}
                customCompanyConfig={invoiceSettings}
                customCustomer={{
                  name: customerName,
                  phone: customerPhone,
                  email: customerEmail,
                  address: customerLocalAddress,
                  localAddress: customerLocalAddress,
                  permanentAddress: customerPermanentAddress,
                  aadhaar: customerAadhaar,
                  gstin: customerGstin,
                  placeOfSupply,
                }}
                financials={{
                  purchasePrice: purchasePriceX,
                  sellingPrice: sellingPriceY,
                  discount: discountD,
                  taxMode,
                }}
                paymentInfo={{
                  method: paymentMethod,
                  mode: paymentMode === "Split" ? "Split (Cash + Online)" : paymentMode,
                  txnId: paymentMode === "Cash" ? "Store Cash Counter" : txnId,
                  splitPayment: paymentMode === "Split" ? {
                    cashAmount: splitCashAmount,
                    onlineAmount: splitOnlineAmount,
                    onlineMode: splitOnlineMode,
                    onlineTxnId: txnId,
                  } : undefined,
                }}
                invoiceNumber={invoiceNumber}
                channelOrderNo={channelOrderNo}
                orderNo={orderNo}
                warrantyDays={warrantyDays}
                channel={channel}
                typeOfSale={typeOfSale}
              />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PERMANENT SAVED BILLS & TAX INVOICE LEDGER               */}
      {/* ============================================================== */}
      {activeTab === "history" && (
        <div className="space-y-5 print:hidden">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-fundu-200 dark:border-fundu-900 bg-gradient-to-br from-fundu-50/60 to-white dark:from-fundu-950/30 dark:to-slate-900 shadow-2xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Saved Invoices</span>
                  <div className="h-8 w-8 rounded-lg bg-fundu-100 dark:bg-fundu-900/60 text-fundu-600 flex items-center justify-center">
                    <ReceiptText className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
                  {sales.length}
                </div>
                <p className="text-[11px] text-fundu-700 dark:text-fundu-400 font-medium mt-1">
                  All issued &amp; printed bills recorded
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/60 to-white dark:from-blue-950/30 dark:to-slate-900 shadow-2xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Billed Revenue</span>
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
                  {formatINR(totalBilledRevenue)}
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium mt-1">
                  Gross retail sales value
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/30 dark:to-slate-900 shadow-2xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">GST Rule 32(5) Margin Tax</span>
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center">
                    <BadgePercent className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-2 font-mono">
                  {formatINR(totalMarginTaxAudited)}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  18% GST strictly audited on margin
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/30 dark:to-slate-900 shadow-2xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Split Payment Bills</span>
                  <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 flex items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
                  {totalSplitBills}
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1">
                  Cash + UPI hybrid settlement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search, Filter & Quick Action Bar */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 flex-wrap">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[280px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by IMEI (e.g. 359078...), Fun Code (e.g. Fun-26000), Invoice #, Customer Name, Mobile, Aadhaar..."
                    className="pl-9 pr-9 h-10 text-xs sm:text-sm bg-white dark:bg-slate-900"
                  />
                  {historySearch && (
                    <button
                      type="button"
                      onClick={() => setHistorySearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter by Payment Mode */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={historyPaymentFilter}
                    onChange={(e) => setHistoryPaymentFilter(e.target.value)}
                    className="h-10 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="all">All Payment Modes</option>
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash Desk</option>
                    <option value="Card">Card</option>
                    <option value="Split">Split (Cash + Online)</option>
                  </select>

                  {/* Filter by Store */}
                  <select
                    value={historyStoreFilter}
                    onChange={(e) => setHistoryStoreFilter(e.target.value)}
                    className="h-10 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="all">All Store Outlets</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.code}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>

                  {/* Export CSV Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      exportSavedBillsCSV(sales);
                      showToast("Exported all saved tax invoices with Fun Code & IMEI to CSV!", "success");
                    }}
                    className="h-10 text-xs gap-1.5 font-semibold border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shrink-0"
                    title="Export all saved tax invoices with IMEI, Fun Code, Aadhaar, Addresses, and GST Rule 32(5) breakdown"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Bills (CSV / Excel)</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Bills Table */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ReceiptText className="w-4 h-4 text-fundu-600" />
                  <span>Permanent Tax Invoice Ledger</span>
                  <Badge variant="fundu" size="sm">
                    {filteredHistorySales.length} of {sales.length} Bills
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Every bill issued, downloaded, or printed is permanently recorded here with Fun Code, 15-digit IMEI, Aadhaar UID, and GST Rule 32(5) tax split.
                </CardDescription>
              </div>

              <Button
                variant="fundu"
                size="sm"
                onClick={() => setActiveTab("generator")}
                className="text-xs gap-1 font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+ Create New Bill</span>
              </Button>
            </CardHeader>

            <div className="overflow-x-auto">
              {filteredHistorySales.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <ReceiptText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Koi bill nahi mila</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Search query ya filter adjust karein ya naya bill generate karein.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHistorySearch("");
                      setHistoryPaymentFilter("all");
                      setHistoryStoreFilter("all");
                    }}
                    className="mt-3 text-xs"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3.5">Invoice # &amp; Date</th>
                      <th className="py-3 px-3.5">Fun Code &amp; Handset</th>
                      <th className="py-3 px-3.5">IMEI &amp; Serial</th>
                      <th className="py-3 px-3.5">Customer &amp; Aadhaar</th>
                      <th className="py-3 px-3.5">Payment Details</th>
                      <th className="py-3 px-3.5 text-right">Billed Amount</th>
                      <th className="py-3 px-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredHistorySales.map((s) => {
                      const funCode = s.deviceId?.startsWith("Fun-")
                        ? s.deviceId
                        : `Fun-${s.deviceId?.replace(/\D/g, "") || "26000"}`;
                      const isSplit = Boolean(s.splitPayment || s.paymentMethod?.includes("Split"));

                      return (
                        <tr
                          key={s.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* 1. Invoice Number & Date */}
                          <td className="py-3 px-3.5 align-top">
                            <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                              {s.invoiceNumber || s.id}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{s.date}</span>
                              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono">
                                {s.channel || "FSO"}
                              </span>
                            </div>
                          </td>

                          {/* 2. Fun Code & Handset Model */}
                          <td className="py-3 px-3.5 align-top">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                                {funCode}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                                Refurbished
                              </span>
                            </div>
                            <div
                              className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 max-w-[210px] truncate"
                              title={s.deviceModel}
                            >
                              {s.deviceModel}
                            </div>
                          </td>

                          {/* 3. Primary IMEI & Serial */}
                          <td className="py-3 px-3.5 align-top">
                            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                              <span>{s.imei}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyImei(s.imei)}
                                className="text-slate-400 hover:text-fundu-600 p-0.5 rounded"
                                title="Copy 15-digit IMEI"
                              >
                                {copiedImei === s.imei ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                              SN: {s.serialNumber || `SN${funCode.replace(/\D/g, "")}`}
                            </div>
                          </td>

                          {/* 4. Customer Name, Mobile, Aadhaar UID, Address */}
                          <td className="py-3 px-3.5 align-top">
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {s.customerName}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              <span>{s.customerPhone}</span>
                            </div>
                            {s.customerAadhaar ? (
                              <div className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
                                <ShieldCheck className="w-2.5 h-2.5 text-blue-600" />
                                <span>UID: {s.customerAadhaar}</span>
                              </div>
                            ) : null}
                            <div
                              className="text-[10px] text-slate-400 truncate max-w-[190px] mt-0.5"
                              title={s.customerLocalAddress || s.customerAddress}
                            >
                              📍 {s.customerLocalAddress || s.customerAddress}
                            </div>
                          </td>

                          {/* 5. Payment Details */}
                          <td className="py-3 px-3.5 align-top">
                            {isSplit && s.splitPayment ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  Split Payment
                                </span>
                                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                                  💵 Cash: ₹{s.splitPayment.cashAmount?.toLocaleString()}
                                </div>
                                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                                  💳 {s.splitPayment.onlineMode || "UPI"}: ₹{s.splitPayment.onlineAmount?.toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  s.paymentMethod === "Cash"
                                    ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300"
                                    : "bg-fundu-100 text-fundu-800 dark:bg-fundu-950/60 dark:text-fundu-300 border border-fundu-300"
                                }`}>
                                  {s.paymentMethod}
                                </span>
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[140px]">
                                  Txn: {s.paymentTxnId || s.splitPayment?.onlineTxnId || "Completed"}
                                </div>
                              </div>
                            )}
                          </td>

                          {/* 6. Billed Amount & Margin GST */}
                          <td className="py-3 px-3.5 align-top text-right">
                            <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-mono">
                              {formatINR(s.finalAmount || s.sellingPrice || 0)}
                            </div>
                            <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                              GST Rule 32(5): {formatINR(s.taxAmount || 0)}
                            </div>
                            {Number(s.discount) > 0 && (
                              <div className="text-[10px] text-rose-500 font-medium">
                                -{formatINR(s.discount)} Off
                              </div>
                            )}
                          </td>

                          {/* 7. Action Buttons */}
                          <td className="py-3 px-3.5 align-top text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {/* 1-Click View & Reprint */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedHistoryOrder(s);
                                  setIsHistoryModalOpen(true);
                                }}
                                className="h-7 text-xs px-2 gap-1 font-bold border-fundu-300 text-fundu-700 bg-fundu-50/60 hover:bg-fundu-100 dark:bg-fundu-950/50 dark:text-fundu-300 dark:border-fundu-800 shadow-2xs"
                                title="Open certified Tax Invoice for Reprinting or PDF Download"
                              >
                                <Printer className="w-3 h-3 text-fundu-600" />
                                <span>Reprint</span>
                              </Button>

                              {/* WhatsApp Share */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendWhatsAppForOrder(s)}
                                className="h-7 text-xs px-2 gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 shadow-2xs"
                                title="Share invoice receipt and warranty certificate via WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </Button>

                              {/* Delete Record */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm(`Remove bill ${s.invoiceNumber || s.id} from ledger?`)) {
                                    deleteSale(s.id);
                                  }
                                }}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                title="Delete bill from ledger"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* View / Reprint Tax Invoice Sheet Modal for History */}
      {selectedHistoryOrder && (
        <InvoiceModal
          isOpen={isHistoryModalOpen}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setSelectedHistoryOrder(null);
          }}
          order={selectedHistoryOrder}
          device={
            devices.find(
              (d) =>
                d.id === selectedHistoryOrder.deviceId ||
                d.imei1 === selectedHistoryOrder.imei
            ) || ({
              id: selectedHistoryOrder.deviceId,
              brand: selectedHistoryOrder.deviceModel.split(" ")[0] || "Smartphone",
              model: selectedHistoryOrder.deviceModel,
              storage: "128 GB",
              colour: "Default Edition",
              imei1: selectedHistoryOrder.imei,
              serialNumber: selectedHistoryOrder.serialNumber || `SN${selectedHistoryOrder.deviceId?.replace(/\D/g, "") || "26001"}`,
              costs: {
                purchasePrice: selectedHistoryOrder.purchasePrice || 25000,
                sellingPrice: selectedHistoryOrder.sellingPrice,
                totalLandedCost: selectedHistoryOrder.purchasePrice || 25000,
              },
            } as any)
          }
          customCustomer={{
            name: selectedHistoryOrder.customerName,
            phone: selectedHistoryOrder.customerPhone,
            email: selectedHistoryOrder.customerEmail,
            address: selectedHistoryOrder.customerLocalAddress || selectedHistoryOrder.customerAddress,
            localAddress: selectedHistoryOrder.customerLocalAddress || selectedHistoryOrder.customerAddress,
            permanentAddress: selectedHistoryOrder.customerPermanentAddress || selectedHistoryOrder.customerLocalAddress || selectedHistoryOrder.customerAddress,
            aadhaar: selectedHistoryOrder.customerAadhaar,
            gstin: selectedHistoryOrder.customerGstin,
            placeOfSupply: selectedHistoryOrder.placeOfSupply,
          }}
          financials={{
            purchasePrice: selectedHistoryOrder.purchasePrice || 25000,
            sellingPrice: selectedHistoryOrder.sellingPrice,
            discount: selectedHistoryOrder.discount,
          }}
          paymentInfo={{
            method: selectedHistoryOrder.splitPayment?.onlineMode || selectedHistoryOrder.paymentMethod,
            mode: selectedHistoryOrder.splitPayment ? "Split" : selectedHistoryOrder.paymentMethod,
            txnId: selectedHistoryOrder.paymentTxnId || selectedHistoryOrder.splitPayment?.onlineTxnId,
            splitPayment: selectedHistoryOrder.splitPayment,
          }}
          invoiceNumber={selectedHistoryOrder.invoiceNumber || selectedHistoryOrder.id}
          invoiceDate={selectedHistoryOrder.date}
        />
      )}

      {/* Invoice & Multi-Store Settings Modal */}
      <InvoiceSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
