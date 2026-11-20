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
  Clock,
  ScanLine,
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
    clearAllSales,
    recoverAllSales,
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

  // Auto-switch to history tab or auto-select handset from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "history" || params.get("tab") === "saved") {
        setActiveTab("history");
      }
      const qDev = params.get("deviceId") || params.get("id");
      const qImei = params.get("imei");
      if (qDev) {
        const found = devices.find(
          (d) =>
            d.id.toUpperCase() === qDev.toUpperCase() ||
            d.id.replace(/[^A-Z0-9]/g, "").toUpperCase() === qDev.replace(/[^A-Z0-9]/g, "").toUpperCase()
        );
        if (found) {
          setSelectedDeviceId(found.id);
          setPurchasePriceX(found.costs.purchasePrice || 25000);
          const newSell = found.costs.sellingPrice || 30000;
          setSellingPriceY(newSell);
          setActiveTab("generator");
        }
      } else if (qImei) {
        const found = devices.find((d) => d.imei1 === qImei || d.imei2 === qImei);
        if (found) {
          setSelectedDeviceId(found.id);
          setPurchasePriceX(found.costs.purchasePrice || 25000);
          const newSell = found.costs.sellingPrice || 30000;
          setSellingPriceY(newSell);
          setActiveTab("generator");
        }
      }
    }
  }, [devices]);

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

  // Customer State - Default blank so each customer gets their own clean bill
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAadhaar, setCustomerAadhaar] = useState("");
  const [customerLocalAddress, setCustomerLocalAddress] = useState("");
  const [customerPermanentAddress, setCustomerPermanentAddress] = useState("");
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [customerGstin, setCustomerGstin] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("Uttar Pradesh");

  // Reset Customer Form for next bill
  const resetCustomerForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerAadhaar("");
    setCustomerLocalAddress("");
    setCustomerPermanentAddress("");
    setCustomerGstin("");
    setIsSameAddress(true);
    setTxnId("");
    setSplitTxnId1("");
    setSplitTxnId2("");
  };

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
  
  // Flexible Dual Multi-Payment / Split Payment state (Supports any 2 methods: 2 UPIs, UPI + Card, Cash + Card, etc.)
  const [splitMode1, setSplitMode1] = useState<string>("UPI");
  const [splitMethod1, setSplitMethod1] = useState<string>("Google Pay");
  const [splitAmount1, setSplitAmount1] = useState<number>(15000);
  const [splitTxnId1, setSplitTxnId1] = useState<string>("");

  const [splitMode2, setSplitMode2] = useState<string>("Card");
  const [splitMethod2, setSplitMethod2] = useState<string>("Credit / Debit Card");
  const [splitAmount2, setSplitAmount2] = useState<number>(15000);
  const [splitTxnId2, setSplitTxnId2] = useState<string>("");

  const [txnId, setTxnId] = useState("");
  const [warrantyDays, setWarrantyDays] = useState(180);
  const [channel, setChannel] = useState<SalesChannelCode>("FSO");
  const [typeOfSale, setTypeOfSale] = useState<SaleTypeCode>("B2C");

  // Helper functions for local date and time (Auto-fetched & manually editable)
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentTimeStr = () => {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [invoiceDate, setInvoiceDate] = useState<string>(getTodayDateStr());
  const [invoiceTime, setInvoiceTime] = useState<string>(getCurrentTimeStr());

  const handleSetToday = () => {
    setInvoiceDate(getTodayDateStr());
    setInvoiceTime(getCurrentTimeStr());
    showToast("Invoice date & time set to Today!", "info");
  };

  const handleSetYesterday = () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const year = y.getFullYear();
    const month = String(y.getMonth() + 1).padStart(2, "0");
    const day = String(y.getDate()).padStart(2, "0");
    setInvoiceDate(`${year}-${month}-${day}`);
    showToast("Invoice date set to Yesterday!", "info");
  };

  // Format date for printed invoice: "19:Nov:2026"
  const formattedInvoiceDate = useMemo(() => {
    if (!invoiceDate) return "";
    const parts = invoiceDate.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2].padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${day}:${months[monthIdx] || "Nov"}:${year}`;
    }
    return invoiceDate;
  }, [invoiceDate]);

  // Format time for printed invoice: "05:47 PM"
  const formattedInvoiceTime = useMemo(() => {
    if (!invoiceTime) return "";
    const [hStr, mStr] = invoiceTime.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr || "00";
    if (isNaN(h)) return invoiceTime;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
  }, [invoiceTime]);

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

  // Sequential Invoice Serial Number Generator (Strict line-by-line auto-increment: 0001, 0002, 0003...)
  const nextInvoiceSerial = useMemo(() => {
    let maxSeq = 0;
    sales.forEach((s) => {
      const invStr = s.invoiceNumber || s.id || "";
      const match = invStr.match(/-(?:0*)(\d+)$/) || invStr.match(/(\d+)$/);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val < 20000 && val > maxSeq) {
          maxSeq = val;
        }
      }
    });
    const nextVal = Math.max(sales.length + 1, maxSeq + 1);
    return String(nextVal).padStart(4, "0");
  }, [sales]);

  const defaultInvoiceNumber = `INV${cleanStoreCode}2611-${nextInvoiceSerial}`;
  const [customInvoiceNumber, setCustomInvoiceNumber] = useState("");
  const invoiceNumber = customInvoiceNumber.trim() || defaultInvoiceNumber;
  const channelOrderNo = `#${channel}-${storeCode}-${nextInvoiceSerial}`;
  const orderNo = `TFD-${channel}-2611-${nextInvoiceSerial}`;

  // Keep dual split amounts synchronized with final selling price
  useEffect(() => {
    const half = Math.round(finalSellingPrice / 2);
    setSplitAmount1(half);
    setSplitAmount2(Math.max(0, finalSellingPrice - half));
  }, [finalSellingPrice]);

  // Dual multi-payment helper functions
  const handlePaymentModeChange = (newMode: string) => {
    setPaymentMode(newMode);
    if (newMode === "Cash") {
      setPaymentMethod("Cash Desk");
      setTxnId("Store Cash Counter");
    } else if (newMode === "UPI") {
      setPaymentMethod("Google Pay");
      if (!txnId || txnId === "Store Cash Counter") setTxnId(`TXN${nextInvoiceSerial}982`);
    } else if (newMode === "Card") {
      setPaymentMethod("Credit Card");
      if (!txnId || txnId === "Store Cash Counter") setTxnId(`POS${nextInvoiceSerial}`);
    } else if (newMode === "NetBanking") {
      setPaymentMethod("Net Banking");
      if (!txnId || txnId === "Store Cash Counter") setTxnId(`NEFT${nextInvoiceSerial}`);
    } else if (newMode === "Split") {
      const half = Math.round(finalSellingPrice / 2);
      setSplitAmount1(half);
      setSplitAmount2(Math.max(0, finalSellingPrice - half));
      if (!splitTxnId1) setSplitTxnId1(`GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
      if (!splitTxnId2) setSplitTxnId2(`PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
    }
  };

  const handleSplitAmount1Change = (val: number) => {
    const a1 = Math.max(0, isNaN(val) ? 0 : val);
    setSplitAmount1(a1);
    setSplitAmount2(Math.max(0, finalSellingPrice - a1));
  };

  const handleSplitAmount2Change = (val: number) => {
    const a2 = Math.max(0, isNaN(val) ? 0 : val);
    setSplitAmount2(a2);
    setSplitAmount1(Math.max(0, finalSellingPrice - a2));
  };

  const handleSetEqualSplit = () => {
    const half = Math.round(finalSellingPrice / 2);
    setSplitAmount1(half);
    setSplitAmount2(Math.max(0, finalSellingPrice - half));
  };

  const applySplitPreset = (combo: "upi_card" | "two_upi" | "cash_upi" | "cash_card") => {
    const half = Math.round(finalSellingPrice / 2);
    setSplitAmount1(half);
    setSplitAmount2(Math.max(0, finalSellingPrice - half));
    if (combo === "upi_card") {
      setSplitMode1("Card");
      setSplitMethod1("Credit / Debit Card");
      setSplitTxnId1(`POS${cleanStoreCode}2611-${nextInvoiceSerial}-1`);
      setSplitMode2("UPI");
      setSplitMethod2("Google Pay");
      setSplitTxnId2(`GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
    } else if (combo === "two_upi") {
      setSplitMode1("UPI");
      setSplitMethod1("Google Pay");
      setSplitTxnId1(`GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
      setSplitMode2("UPI");
      setSplitMethod2("PhonePe");
      setSplitTxnId2(`PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
    } else if (combo === "cash_upi") {
      setSplitMode1("Cash");
      setSplitMethod1("Cash on Counter");
      setSplitTxnId1("Store Cash Counter");
      setSplitMode2("UPI");
      setSplitMethod2("Google Pay");
      setSplitTxnId2(`GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
    } else if (combo === "cash_card") {
      setSplitMode1("Cash");
      setSplitMethod1("Cash on Counter");
      setSplitTxnId1("Store Cash Counter");
      setSplitMode2("Card");
      setSplitMethod2("Credit / Debit Card");
      setSplitTxnId2(`POS${cleanStoreCode}2611-${nextInvoiceSerial}`);
    }
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
      setSplitAmount1(half);
      setSplitAmount2(Math.max(0, newFinal - half));
    }
  };

  // Barcode Gun Scanning State & Handler for Tax Invoice Desk
  const [barcodeScanQuery, setBarcodeScanQuery] = useState("");

  const playScanBeep = (success: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (success) {
        osc.frequency.setValueAtTime(1760, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch {}
  };

  const handleBarcodeScanDirect = (rawInput: string, isSubmit = false) => {
    const clean = rawInput.replace(/[\r\n\t]/g, "").trim().toUpperCase();
    if (!clean) return;

    const cleanNoDash = clean.replace(/[^A-Z0-9]/g, "");

    const found = devices.find((d) => {
      const dIdUpper = d.id.toUpperCase();
      const dIdNoDash = dIdUpper.replace(/[^A-Z0-9]/g, "");
      const dSerialUpper = d.serialNumber?.toUpperCase() || "";
      const dSkuUpper = d.sku?.toUpperCase() || "";

      return (
        d.imei1 === clean ||
        d.imei2 === clean ||
        dIdUpper === clean ||
        dIdNoDash === cleanNoDash ||
        dSerialUpper === clean ||
        dSkuUpper === clean ||
        (clean.length >= 5 && /^\d+$/.test(clean) && dIdNoDash.endsWith(clean))
      );
    });

    if (found) {
      handleDeviceChange(found.id);
      playScanBeep(true);
      showToast(`✓ Scanned: ${found.brand} ${found.model} (${found.id})`, "success");
      setBarcodeScanQuery("");
    } else if (isSubmit) {
      playScanBeep(false);
      showToast(`Koi handset nahi mila with Barcode/IMEI: "${clean}"`, "error");
    }
  };

  // Centralized Auto-Record Invoice Function:
  // Automatically saves complete bill details (IMEI, Fun Code, Aadhaar, Addresses, Split Payments, Store)
  // whenever someone Prints, Downloads PDF, sends WhatsApp, or Issues an Invoice!
  const autoRecordCurrentInvoice = () => {
    if (!selectedDevice) return null;
    const cleanTitle = `${selectedDevice.brand} ${selectedDevice.model} (${selectedDevice.storage}) Refurbished ${selectedDevice.colour && selectedDevice.colour !== "Default Edition" ? selectedDevice.colour : ""}`.replace(/\s+/g, " ").trim();

    const finalTxn1 = splitMode1 === "Cash" ? "Store Cash Counter" : (splitTxnId1.trim() || `GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
    const finalTxn2 = splitMode2 === "Cash" ? "Store Cash Counter" : (splitTxnId2.trim() || `PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);

    const recordedSale = addSale({
      customerName: customerName.trim() || "Retail Customer",
      customerPhone: customerPhone.trim() || "+91 98000 00000",
      customerEmail: customerEmail.trim(),
      customerAddress: customerLocalAddress.trim() || "Lucknow, Uttar Pradesh",
      customerLocalAddress: customerLocalAddress.trim() || "Lucknow, Uttar Pradesh",
      customerPermanentAddress: customerPermanentAddress.trim() || customerLocalAddress.trim() || "Lucknow, Uttar Pradesh",
      customerAadhaar: customerAadhaar.trim() || undefined,
      customerGstin,
      placeOfSupply,
      channel,
      typeOfSale,
      invoiceNumber,
      deviceId: selectedDevice.id,
      deviceModel: cleanTitle,
      imei: selectedDevice.imei1,
      serialNumber: selectedDevice.serialNumber || `SN${nextInvoiceSerial}`,
      sellingPrice: sellingPriceY,
      discount: discountD,
      taxAmount: totalMarginTax,
      finalAmount: finalSellingPrice,
      purchasePrice: purchasePriceX,
      profitMargin: profitMarginZ,
      paymentMethod: paymentMode === "Split"
        ? `Split (${splitMethod1} + ${splitMethod2})`
        : (paymentMethod || paymentMode),
      paymentTxnId: paymentMode === "Split"
        ? `Txn 1: ${finalTxn1} | Txn 2: ${finalTxn2}`
        : (paymentMode === "Cash" ? "Store Cash Counter" : (txnId || "Store Cash Counter")),
      splitPayment: paymentMode === "Split" ? {
        mode1: splitMode1,
        method1: splitMethod1,
        amount1: splitAmount1,
        txnId1: finalTxn1,
        mode2: splitMode2,
        method2: splitMethod2,
        amount2: splitAmount2,
        txnId2: finalTxn2,
        cashAmount: splitMode1 === "Cash" ? splitAmount1 : splitMode2 === "Cash" ? splitAmount2 : 0,
        onlineAmount: splitMode1 !== "Cash" ? splitAmount1 : splitMode2 !== "Cash" ? splitAmount2 : 0,
        onlineMode: splitMode1 !== "Cash" ? splitMethod1 : splitMethod2,
        onlineTxnId: splitMode1 !== "Cash" ? finalTxn1 : finalTxn2,
      } : undefined,
      paymentStatus: "Completed",
      deliveryStatus: "Delivered",
      warrantyMonths: Math.round(warrantyDays / 30),
      date: formattedInvoiceDate,
      time: formattedInvoiceTime,
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

    const finalTxn1 = splitMode1 === "Cash" ? "Store Cash Counter" : (splitTxnId1.trim() || `GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
    const finalTxn2 = splitMode2 === "Cash" ? "Store Cash Counter" : (splitTxnId2.trim() || `PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);

    const paymentSummaryText = paymentMode === "Split"
      ? `Dual Payment: ${splitMethod1} (₹${splitAmount1.toLocaleString()} - Txn: ${finalTxn1}) + ${splitMethod2} (₹${splitAmount2.toLocaleString()} - Txn: ${finalTxn2})`
      : `${paymentMethod} (${paymentMode === "Cash" ? "Cash Counter" : txnId})`;

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
    resetCustomerForm();
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
      ? `Dual Payment: ${order.splitPayment.method1 || order.splitPayment.mode1 || "Part 1"} (₹${Number(order.splitPayment.amount1 ?? order.splitPayment.cashAmount ?? 0).toLocaleString()} - Txn: ${order.splitPayment.txnId1 || "N/A"}) + ${order.splitPayment.method2 || order.splitPayment.mode2 || order.splitPayment.onlineMode || "Part 2"} (₹${Number(order.splitPayment.amount2 ?? order.splitPayment.onlineAmount ?? 0).toLocaleString()} - Txn: ${order.splitPayment.txnId2 || order.splitPayment.onlineTxnId || "N/A"})`
      : `${order.paymentMethod} (Txn: ${order.paymentTxnId || "Completed"})`;

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

          {/* Download Bill (PDF) Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 shadow-sm font-bold bg-blue-600 hover:bg-blue-700 text-white"
            title="Download & Save Tax Invoice as PDF file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Bill (PDF)</span>
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
              {/* Direct Barcode & Laser Gun Quick-Scan Box */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 p-2.5 rounded-lg space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <ScanLine className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Barcode Gun / Quick IMEI Scan</span>
                    <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      USB Scanner Gun Active
                    </span>
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Box / Sticker scan karein</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Scan Barcode or type 15-digit IMEI / Fun Code..."
                      value={barcodeScanQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBarcodeScanQuery(val);
                        // Fast instant match when full 15-digit IMEI or Fun-Code scanned
                        const clean = val.replace(/[\r\n\t]/g, "").trim().toUpperCase();
                        if (
                          (clean.length === 15 && /^\d+$/.test(clean)) ||
                          (clean.startsWith("FUN-26") && clean.length >= 9) ||
                          (clean.startsWith("FUN26") && clean.length >= 8)
                        ) {
                          handleBarcodeScanDirect(clean, false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleBarcodeScanDirect(barcodeScanQuery, true);
                        }
                      }}
                      className="h-8 text-xs font-mono bg-white dark:bg-slate-900 pr-7 border-emerald-300 focus:border-emerald-500"
                    />
                    {barcodeScanQuery && (
                      <button
                        type="button"
                        onClick={() => setBarcodeScanQuery("")}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="fundu"
                    onClick={() => handleBarcodeScanDirect(barcodeScanQuery, true)}
                    className="h-8 text-xs font-semibold px-3 shrink-0 gap-1"
                  >
                    <Search className="h-3 w-3" />
                    <span>Find</span>
                  </Button>
                </div>
              </div>

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
                    <option value="inclusive">Inclusive (TheFundu Standard / B2C)</option>
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

          {/* Card: Invoice Billing Date & Timing Configuration (Manual & Auto-Fetch) */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-fundu-600" />
                  <span>Invoice Serial, Date &amp; Timing</span>
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSetToday}
                    className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold border transition-colors ${
                      invoiceDate === getTodayDateStr()
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    ⚡ Today (आज)
                  </button>
                  <button
                    type="button"
                    onClick={handleSetYesterday}
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    📅 Yesterday (कल)
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              {/* Sequential Invoice Serial Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-fundu-600" />
                    <span>Invoice Serial Number (सीरियल नंबर - Line by line auto) *</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    Auto-Increment #{nextInvoiceSerial}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setCustomInvoiceNumber(e.target.value)}
                    placeholder={defaultInvoiceNumber}
                    className="w-full text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-slate-100"
                  />
                  {customInvoiceNumber && (
                    <button
                      type="button"
                      onClick={() => setCustomInvoiceNumber("")}
                      className="text-[11px] text-fundu-600 hover:underline shrink-0 font-medium"
                    >
                      Reset Auto
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-fundu-600" />
                    <span>Billing Date (तारीख) *</span>
                  </label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full text-xs font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-fundu-600" />
                    <span>Billing Time (समय) *</span>
                  </label>
                  <Input
                    type="time"
                    value={invoiceTime}
                    onChange={(e) => setInvoiceTime(e.target.value)}
                    className="w-full text-xs font-mono font-medium"
                  />
                </div>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-[11px]">
                <span className="text-emerald-900 dark:text-emerald-300 font-medium">Printed on Bill:</span>
                <span className="font-bold font-mono text-emerald-800 dark:text-emerald-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {invoiceNumber} • {formattedInvoiceDate} • {formattedInvoiceTime}
                </span>
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
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      resetCustomerForm();
                      showToast("Customer fields cleared for next bill!", "info");
                    }}
                    className="h-6 text-[10.5px] px-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    title="Clear customer details for fresh invoice"
                  >
                    Clear / New Customer
                  </Button>
                  <Badge variant="outline" size="sm" className="text-[10px]">
                    KYC &amp; Invoice Billing
                  </Badge>
                </div>
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

              {/* AADHAAR CARD FIELD - KYC NO */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>KYC NO / Aadhaar Card Number (12-Digit UID)</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                    Prints as &quot;KYC NO&quot; on Bill
                  </span>
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
              {/* Payment Settlement Mode Toggle */}
              <div className="space-y-1">
                <label className="font-semibold block text-[11px] text-slate-700 dark:text-slate-300">
                  Payment Settlement Method (भुगतान का प्रकार) *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handlePaymentModeChange("UPI")}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMode !== "Split"
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <span>💳 Single Payment (1 Mode)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentModeChange("Split")}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMode === "Split"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <span>⚡ Dual Payment (2 Modes / 2 UPI / Card + UPI)</span>
                  </button>
                </div>
              </div>

              {/* SINGLE PAYMENT (1 MODE) */}
              {paymentMode !== "Split" && (
                <div className="space-y-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
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

                  {paymentMode !== "Cash" ? (
                    <div>
                      <label className="font-semibold block mb-1 text-slate-800 dark:text-slate-200">
                        Transaction ID / UPI Ref *
                      </label>
                      <Input
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder="e.g. TXN26001LKO982 or 12-digit UPI UTR"
                        className="font-mono text-xs font-semibold"
                      />
                    </div>
                  ) : (
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
                </div>
              )}

              {/* DUAL PAYMENT (2 MODES - 2 UPI / CARD + UPI / CASH + UPI) */}
              {paymentMode === "Split" && (
                <div className="p-3.5 rounded-xl border-2 border-emerald-400 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/25 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 dark:border-emerald-800/80 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950 dark:text-emerald-200">
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                        <span>Dual Payment Breakdown (2 Modes: 2 UPI / Card + UPI / Cash + UPI)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Dono payment channels ke alag-alag amounts aur dono ke Transaction ID / UPI Ref darj karein:
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSetEqualSplit}
                      className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-800 self-start sm:self-auto"
                    >
                      50/50 Equal Split
                    </button>
                  </div>

                  {/* Quick Combination Presets */}
                  <div>
                    <label className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                      ⚡ Quick Mode Presets (1-Click Selection):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => applySplitPreset("two_upi")}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                          splitMode1 === "UPI" && splitMode2 === "UPI"
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400"
                        }`}
                      >
                        📱 2 UPI (Google Pay + PhonePe)
                      </button>
                      <button
                        type="button"
                        onClick={() => applySplitPreset("upi_card")}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                          (splitMode1 === "Card" && splitMode2 === "UPI") || (splitMode1 === "UPI" && splitMode2 === "Card")
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400"
                        }`}
                      >
                        💳 Card + Google Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => applySplitPreset("cash_upi")}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                          (splitMode1 === "Cash" && splitMode2 === "UPI") || (splitMode1 === "UPI" && splitMode2 === "Cash")
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400"
                        }`}
                      >
                        💵 Cash + UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => applySplitPreset("cash_card")}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                          (splitMode1 === "Cash" && splitMode2 === "Card") || (splitMode1 === "Card" && splitMode2 === "Cash")
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400"
                        }`}
                      >
                        🏧 Cash + Card
                      </button>
                    </div>
                  </div>

                  {/* PART 1 PAYMENT */}
                  <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                        <span>Payment 1: {splitMethod1} ({splitMode1})</span>
                      </span>
                      <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        ₹{splitAmount1.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Mode 1</label>
                        <select
                          value={splitMode1}
                          onChange={(e) => {
                            const m = e.target.value;
                            setSplitMode1(m);
                            if (m === "UPI") { setSplitMethod1("Google Pay"); setSplitTxnId1(`GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`); }
                            else if (m === "Card") { setSplitMethod1("Credit / Debit Card"); setSplitTxnId1(`POS${cleanStoreCode}2611-${nextInvoiceSerial}-1`); }
                            else if (m === "Cash") { setSplitMethod1("Cash on Counter"); setSplitTxnId1("Store Cash Counter"); }
                            else if (m === "NetBanking") { setSplitMethod1("Net Banking"); setSplitTxnId1(`NEFT${cleanStoreCode}2611-${nextInvoiceSerial}-1`); }
                          }}
                          className="w-full h-8 rounded border border-slate-200 bg-white px-2 text-[11px] font-medium dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <option value="UPI">UPI</option>
                          <option value="Card">Card</option>
                          <option value="Cash">Cash</option>
                          <option value="NetBanking">Net Banking</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Method 1</label>
                        <select
                          value={splitMethod1}
                          onChange={(e) => {
                            const meth = e.target.value;
                            setSplitMethod1(meth);
                            if (splitMode1 !== "Cash") {
                              if (meth === "Google Pay") setSplitTxnId1(`GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
                              else if (meth === "PhonePe") setSplitTxnId1(`PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
                              else if (meth === "Paytm") setSplitTxnId1(`PAYTM${cleanStoreCode}2611-${nextInvoiceSerial}`);
                              else if (meth.includes("Card")) setSplitTxnId1(`POS${cleanStoreCode}2611-${nextInvoiceSerial}-1`);
                            }
                          }}
                          className="w-full h-8 rounded border border-slate-200 bg-white px-2 text-[11px] font-medium dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <option value="Google Pay">Google Pay</option>
                          <option value="PhonePe">PhonePe</option>
                          <option value="Paytm">Paytm</option>
                          <option value="BHIM UPI">BHIM UPI</option>
                          <option value="Credit / Debit Card">Credit / Debit Card</option>
                          <option value="Cash on Counter">Cash on Counter</option>
                          <option value="Net Banking">Net Banking</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Amount 1 (₹) *</label>
                        <Input
                          type="number"
                          min="0"
                          value={splitAmount1}
                          onChange={(e) => handleSplitAmount1Change(Number(e.target.value))}
                          placeholder="Amount 1"
                          className="h-8 text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block mb-0.5 flex items-center justify-between">
                          <span>Transaction ID / UPI Ref 1 *</span>
                          {splitMode1 === "Cash" && (
                            <span className="text-[9px] text-emerald-600 font-normal">Cash Desk</span>
                          )}
                        </label>
                        <Input
                          value={splitMode1 === "Cash" ? "Store Cash Counter" : (splitTxnId1 || `GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`)}
                          disabled={splitMode1 === "Cash"}
                          onChange={(e) => setSplitTxnId1(e.target.value)}
                          placeholder={splitMode1 === "Cash" ? "Cash Counter" : "Enter Txn ID / UTR 1"}
                          className="h-8 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PART 2 PAYMENT */}
                  <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                        <span>Payment 2: {splitMethod2} ({splitMode2})</span>
                      </span>
                      <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        ₹{splitAmount2.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Mode 2</label>
                        <select
                          value={splitMode2}
                          onChange={(e) => {
                            const m = e.target.value;
                            setSplitMode2(m);
                            if (m === "UPI") { setSplitMethod2("PhonePe"); setSplitTxnId2(`PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`); }
                            else if (m === "Card") { setSplitMethod2("Credit / Debit Card"); setSplitTxnId2(`POS${cleanStoreCode}2611-${nextInvoiceSerial}-2`); }
                            else if (m === "Cash") { setSplitMethod2("Cash on Counter"); setSplitTxnId2("Store Cash Counter"); }
                            else if (m === "NetBanking") { setSplitMethod2("Net Banking"); setSplitTxnId2(`NEFT${cleanStoreCode}2611-${nextInvoiceSerial}-2`); }
                          }}
                          className="w-full h-8 rounded border border-slate-200 bg-white px-2 text-[11px] font-medium dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <option value="UPI">UPI</option>
                          <option value="Card">Card</option>
                          <option value="Cash">Cash</option>
                          <option value="NetBanking">Net Banking</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Method 2</label>
                        <select
                          value={splitMethod2}
                          onChange={(e) => {
                            const meth = e.target.value;
                            setSplitMethod2(meth);
                            if (splitMode2 !== "Cash") {
                              if (meth === "PhonePe") setSplitTxnId2(`PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`);
                              else if (meth === "Google Pay") setSplitTxnId2(`GPAY${cleanStoreCode}2611-${nextInvoiceSerial}-2`);
                              else if (meth === "Paytm") setSplitTxnId2(`PAYTM${cleanStoreCode}2611-${nextInvoiceSerial}`);
                              else if (meth.includes("Card")) setSplitTxnId2(`POS${cleanStoreCode}2611-${nextInvoiceSerial}-2`);
                            }
                          }}
                          className="w-full h-8 rounded border border-slate-200 bg-white px-2 text-[11px] font-medium dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <option value="PhonePe">PhonePe</option>
                          <option value="Google Pay">Google Pay</option>
                          <option value="Paytm">Paytm</option>
                          <option value="BHIM UPI">BHIM UPI</option>
                          <option value="Credit / Debit Card">Credit / Debit Card</option>
                          <option value="Cash on Counter">Cash on Counter</option>
                          <option value="Net Banking">Net Banking</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Amount 2 (₹) *</label>
                        <Input
                          type="number"
                          min="0"
                          value={splitAmount2}
                          onChange={(e) => handleSplitAmount2Change(Number(e.target.value))}
                          placeholder="Amount 2"
                          className="h-8 text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block mb-0.5 flex items-center justify-between">
                          <span>Transaction ID / UPI Ref 2 *</span>
                          {splitMode2 === "Cash" && (
                            <span className="text-[9px] text-emerald-600 font-normal">Cash Desk</span>
                          )}
                        </label>
                        <Input
                          value={splitMode2 === "Cash" ? "Store Cash Counter" : (splitTxnId2 || `PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`)}
                          disabled={splitMode2 === "Cash"}
                          onChange={(e) => setSplitTxnId2(e.target.value)}
                          placeholder={splitMode2 === "Cash" ? "Cash Counter" : "Enter Txn ID / UTR 2"}
                          className="h-8 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Verification / Match Status Bar */}
                  <div className={`p-2.5 rounded-lg text-[11px] flex items-center justify-between font-medium border ${
                    splitAmount1 + splitAmount2 === finalSellingPrice
                      ? "bg-emerald-100/80 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
                      : "bg-amber-100/80 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
                  }`}>
                    <div>
                      <span>Total: ₹{finalSellingPrice.toLocaleString()}</span>
                      <span className="mx-1.5">•</span>
                      <span>{splitMethod1}: ₹{splitAmount1.toLocaleString()}</span>
                      <span className="mx-1">+</span>
                      <span>{splitMethod2}: ₹{splitAmount2.toLocaleString()}</span>
                    </div>

                    {splitAmount1 + splitAmount2 === finalSellingPrice ? (
                      <span className="font-bold flex items-center gap-1 text-emerald-800 dark:text-emerald-200">
                        ✓ 100% Balanced
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSplitAmount2(Math.max(0, finalSellingPrice - splitAmount1))}
                        className="underline font-bold text-amber-800 dark:text-amber-200 hover:text-amber-900"
                      >
                        Diff: ₹{Math.abs(finalSellingPrice - (splitAmount1 + splitAmount2))} (Auto-Balance)
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">TheFundu Warranty (Days)</label>
                <select
                  value={warrantyDays}
                  onChange={(e) => setWarrantyDays(Number(e.target.value))}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value={180}>180 Days (6 Months TheFundu Standard)</option>
                  <option value={365}>365 Days (12 Months Annual Comprehensive)</option>
                  <option value={90}>90 Days (Quarterly Guarantee)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Live Customer Tax Invoice (TheFundu Standard Retail PDF) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 space-y-2">
            <div className="flex items-center justify-between pb-1 print:hidden">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-fundu-600" />
                <span>Live PDF Invoice Preview (A4 Formatted)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1 text-[11px] h-6 px-2.5 shadow-xs"
                  title="Download and save Tax Invoice PDF"
                >
                  <Download className="h-3 w-3" />
                  <span>Download PDF</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  className="gap-1 text-[11px] h-6 px-2"
                >
                  <Printer className="h-3 w-3" />
                  <span>Print</span>
                </Button>
              </div>
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
                  mode: paymentMode === "Split" ? `Split (${splitMethod1} + ${splitMethod2})` : paymentMode,
                  txnId: paymentMode === "Cash" ? "Store Cash Counter" : txnId,
                  splitPayment: paymentMode === "Split" ? {
                    mode1: splitMode1,
                    method1: splitMethod1,
                    amount1: splitAmount1,
                    txnId1: splitMode1 === "Cash" ? "Store Cash Counter" : (splitTxnId1.trim() || `GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`),
                    mode2: splitMode2,
                    method2: splitMethod2,
                    amount2: splitAmount2,
                    txnId2: splitMode2 === "Cash" ? "Store Cash Counter" : (splitTxnId2.trim() || `PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`),
                    cashAmount: splitMode1 === "Cash" ? splitAmount1 : splitMode2 === "Cash" ? splitAmount2 : 0,
                    onlineAmount: splitMode1 !== "Cash" ? splitAmount1 : splitMode2 !== "Cash" ? splitAmount2 : 0,
                    onlineMode: splitMode1 !== "Cash" ? splitMethod1 : splitMethod2,
                    onlineTxnId: splitMode1 !== "Cash" ? (splitTxnId1.trim() || `GPAY${cleanStoreCode}2611-${nextInvoiceSerial}`) : (splitTxnId2.trim() || `PPAY${cleanStoreCode}2611-${nextInvoiceSerial}`),
                  } : undefined,
                }}
                invoiceNumber={invoiceNumber}
                invoiceDate={formattedInvoiceDate}
                invoiceTime={formattedInvoiceTime}
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

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    recoverAllSales();
                  }}
                  className="text-xs gap-1.5 font-bold border-blue-300 text-blue-700 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                  title="Saare khoye hue bills aur sold phones ka record wapas restore karein"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Restore / Recover Bills</span>
                </Button>
                <Button
                  variant="fundu"
                  size="sm"
                  onClick={() => setActiveTab("generator")}
                  className="text-xs gap-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ Create New Bill</span>
                </Button>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              {sales.length === 0 ? (
                <div className="py-20 text-center text-slate-500">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3.5 text-slate-400">
                    <ReceiptText className="h-8 w-8 text-fundu-500" />
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Abhi tak koi bill nahi kata gaya hai (0 Bills Recorded)
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
                    Saare dummy bills ledger se successfully hata diye gaye hain. Pehla tax bill generate karne ke liye upar &apos;+ Create New Bill&apos; button par click karein.
                  </p>
                  <Button
                    variant="fundu"
                    size="sm"
                    onClick={() => setActiveTab("generator")}
                    className="mt-5 gap-1.5 font-semibold text-xs h-9 px-4"
                  >
                    <FileText className="h-4 w-4" />
                    <span>+ Pehla Bill Generate Karein</span>
                  </Button>
                </div>
              ) : filteredHistorySales.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <ReceiptText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Koi matching bill nahi mila</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Search query ya filter adjust karein.
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
                              {s.time && <span className="text-[10px] text-slate-400 font-mono">• {s.time}</span>}
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
                                <span>KYC NO: {s.customerAadhaar}</span>
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
                                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[170px]" title={`${s.splitPayment.method1 || s.splitPayment.mode1 || "Part 1"}: ₹${(s.splitPayment.amount1 ?? s.splitPayment.cashAmount ?? 0).toLocaleString()}`}>
                                  • {s.splitPayment.method1 || s.splitPayment.mode1 || (s.splitPayment.cashAmount ? "Cash" : "Part 1")}: ₹{(s.splitPayment.amount1 ?? s.splitPayment.cashAmount ?? 0).toLocaleString()}
                                </div>
                                <div className="text-[9.5px] font-mono text-slate-500 pl-2 font-medium">
                                  Txn 1: {s.splitPayment.txnId1 || (s.splitPayment.mode1 === "Cash" ? "Cash Counter" : "N/A")}
                                </div>
                                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[170px]" title={`${s.splitPayment.method2 || s.splitPayment.mode2 || s.splitPayment.onlineMode || "Part 2"}: ₹${(s.splitPayment.amount2 ?? s.splitPayment.onlineAmount ?? 0).toLocaleString()}`}>
                                  • {s.splitPayment.method2 || s.splitPayment.mode2 || s.splitPayment.onlineMode || "Part 2"}: ₹{(s.splitPayment.amount2 ?? s.splitPayment.onlineAmount ?? 0).toLocaleString()}
                                </div>
                                <div className="text-[9.5px] font-mono text-slate-500 pl-2 font-medium">
                                  Txn 2: {s.splitPayment.txnId2 || (s.splitPayment.mode2 === "Cash" ? "Cash Counter" : s.splitPayment.onlineTxnId || "N/A")}
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

                              {/* 1-Click Download PDF */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedHistoryOrder(s);
                                  setIsHistoryModalOpen(true);
                                  setTimeout(() => {
                                    window.print();
                                  }, 300);
                                }}
                                className="h-7 text-xs px-2 gap-1 font-bold border-blue-300 text-blue-700 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 shadow-2xs"
                                title="Download & Save this Bill directly as PDF"
                              >
                                <Download className="w-3 h-3 text-blue-600" />
                                <span>Download PDF</span>
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
          invoiceTime={selectedHistoryOrder.time}
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
