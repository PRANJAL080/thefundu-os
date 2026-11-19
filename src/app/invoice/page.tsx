"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Device, SalesOrder, SalesChannelCode, SaleTypeCode } from "@/lib/types";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CompanyInvoiceSheet } from "@/components/invoice/CompanyInvoiceSheet";
import { InvoiceSettingsModal } from "@/components/invoice/InvoiceSettingsModal";
import { formatINR } from "@/lib/utils";
import { exportGSTRule32AuditCSV } from "@/lib/exportGSTRule32";

export default function InvoiceGeneratorPage() {
  const {
    devices,
    warehouses,
    selectedStoreId,
    setSelectedStoreId,
    invoiceSettings,
    addSale,
    showToast,
    isCashierMode,
  } = useApp();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Active Store Outlet (Dynamic multi-store support)
  const currentStore =
    warehouses.find((w) => w.id === selectedStoreId || w.code === selectedStoreId) ||
    warehouses[0] ||
    COMPANY_CONFIG.primaryStore;

  const storeCode = currentStore?.code || "LKO-01";
  const cleanStoreCode = storeCode.replace(/-/g, "");

  // Selected device for invoicing (defaults to Fun-26001 or first device)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || "Fun-26001");
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0];

  // Customer State
  const [customerName, setCustomerName] = useState("Abhay verma");
  const [customerPhone, setCustomerPhone] = useState("7991990508");
  const [customerEmail, setCustomerEmail] = useState("abhayverma7380@gmail.com");
  const [customerAddress, setCustomerAddress] = useState(
    "Gomti nagar, Gomti nagar , Gomti nagar , Lucknow, Uttar Pradesh, 226010, Lucknow, Uttar Pradesh, India, 226010"
  );
  const [customerGstin, setCustomerGstin] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("Uttar Pradesh");

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
  const [paymentMethod, setPaymentMethod] = useState("csh_razor_pay");
  const [paymentMode, setPaymentMode] = useState<string>("UPI");
  // Split Payment (Cash + Online / UPI) breakdown
  const [splitCashAmount, setSplitCashAmount] = useState<number>(10000);
  const [splitOnlineAmount, setSplitOnlineAmount] = useState<number>(20000);
  const [splitOnlineMode, setSplitOnlineMode] = useState<string>("UPI");

  const [txnId, setTxnId] = useState("2dyGed5aMTsykarE1a4V");
  const [gatewayTxnId, setGatewayTxnId] = useState("pay_TwvXY8jF1sg5xl");
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
    if (newMode === "Split") {
      const half = Math.round(finalSellingPrice / 2);
      setSplitCashAmount(half);
      setSplitOnlineAmount(Math.max(0, finalSellingPrice - half));
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

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
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
    showToast(`WhatsApp confirmation dispatched for ${customerName}!`, "success");
  };

  const handleSaveAndIssue = () => {
    if (!selectedDevice) return;
    addSale({
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      channel,
      typeOfSale,
      invoiceNumber,
      deviceId: selectedDevice.id,
      deviceModel: `${selectedDevice.brand} ${selectedDevice.model} (${selectedDevice.storage}) Refurbished ${selectedDevice.colour && selectedDevice.colour !== "Default Edition" ? selectedDevice.colour : ""}`.replace(/\s+/g, " ").trim(),
      imei: selectedDevice.imei1,
      sellingPrice: sellingPriceY,
      discount: discountD,
      finalAmount: finalSellingPrice,
      paymentMethod: paymentMode === "Split" ? "Split (Cash + Online)" : (paymentMode as any),
      splitPayment: paymentMode === "Split" ? {
        cashAmount: splitCashAmount,
        onlineAmount: splitOnlineAmount,
        onlineMode: splitOnlineMode,
        onlineTxnId: txnId,
      } : undefined,
      paymentStatus: "Completed",
      deliveryStatus: "Delivered",
      warrantyMonths: Math.round(warrantyDays / 30),
    });
    showToast(`Tax Invoice ${invoiceNumber} created and recorded under Rule 32(5)!`, "success");
  };

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

      {/* TWO COLUMN WORKSPACE: Config on Left, Live Customer Invoice on Right */}
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
                  <span>1. Select Device from Inventory</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {devices.length} Units Available
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Choose Serialized Phone *</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.brand} {d.model} ({d.storage})
                    </option>
                  ))}
                </select>
              </div>

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
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-fundu-600" />
                <span>3. Buyer / Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Customer Full Name *</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Mobile Number *</label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email Address</label>
                  <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Delivery Address *</label>
                <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
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
                  <label className="font-semibold block mb-1">Payment Method / Gateway</label>
                  <Input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                </div>
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
                        Online Payment Mode
                      </label>
                      <select
                        value={splitOnlineMode}
                        onChange={(e) => setSplitOnlineMode(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                      >
                        <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                        <option value="Card">Credit / Debit Card</option>
                        <option value="NetBanking">Net Banking / NEFT / IMPS</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-[11px] text-slate-700 dark:text-slate-300">
                        Online UPI / Txn Ref ID
                      </label>
                      <Input
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder="UPI Ref / UTR / Auth code"
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

              {paymentMode !== "Split" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Transaction ID</label>
                    <Input value={txnId} onChange={(e) => setTxnId(e.target.value)} />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Gateway Txn ID</label>
                    <Input value={gatewayTxnId} onChange={(e) => setGatewayTxnId(e.target.value)} />
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
                  address: customerAddress,
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
                  txnId,
                  gatewayTxnId,
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

      {/* Invoice & Multi-Store Settings Modal */}
      <InvoiceSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
