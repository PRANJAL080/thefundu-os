"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Plus,
  Search,
  DollarSign,
  FileCheck2,
  Upload,
  UserCheck,
  Store,
  Printer,
  Sparkles,
  Award,
  Lock,
  Layers,
  ChevronRight,
  Camera,
  Image as ImageIcon,
  Trash2,
  CreditCard,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { BuybackRecord, SMARTPHONE_BRANDS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate, compressImage } from "@/lib/utils";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { BuybackKycReportModal } from "@/components/buyback/BuybackKycReportModal";

// Base price map for algorithmic valuation
const MODEL_BASE_PRICES: Record<string, number> = {
  "iPhone 15 Pro Max": 72000,
  "iPhone 15 Pro": 62000,
  "iPhone 15": 48000,
  "iPhone 14 Pro Max": 58000,
  "iPhone 14 Pro": 50000,
  "iPhone 14": 38000,
  "iPhone 13 Pro Max": 46000,
  "iPhone 13 Pro": 40000,
  "iPhone 13": 32000,
  "iPhone 13 mini": 28000,
  "iPhone 12 Pro Max": 35000,
  "iPhone 12 Pro": 30000,
  "iPhone 12": 24000,
  "iPhone 12 mini": 20000,
  "iPhone 11": 16000,
  "Samsung Galaxy S24 Ultra": 68000,
  "OnePlus 12": 42000,
};

export default function BuybackDeskPage() {
  const { buybacks, addBuyback, showToast } = useApp();

  // Step 1: Device Selection
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("iPhone 13");
  const [storage, setStorage] = useState("128GB");
  const [colour, setColour] = useState("Midnight Blue");
  const [imei1, setImei1] = useState("359078245981122");
  const [imei2, setImei2] = useState("359078245981123");
  const [batteryHealth, setBatteryHealth] = useState(87);

  // Step 2: Physical & Diagnostic Condition
  const [screenCondition, setScreenCondition] = useState<"Flawless" | "Minor Scratches" | "Cracked">("Minor Scratches");
  const [bodyCondition, setBodyCondition] = useState<"Flawless" | "Minor Scratches" | "Dented">("Flawless");
  const [isFaceIdWorking, setIsFaceIdWorking] = useState(true);
  const [areCamerasWorking, setAreCamerasWorking] = useState(true);
  const [isChargingWorking, setIsChargingWorking] = useState(true);
  const [hasOriginalBox, setHasOriginalBox] = useState(true);
  const [hasOriginalBill, setHasOriginalBill] = useState(true);

  // Step 3: Legal & Police Verification
  const [sellerName, setSellerName] = useState("Rohit Shukla");
  const [sellerPhone, setSellerPhone] = useState("9839012345");
  const [sellerEmail, setSellerEmail] = useState("rohit.shukla@gmail.com");
  const [sellerAddress, setSellerAddress] = useState("ED-476, Sector-Q, Aliganj, Lucknow, UP 226024");
  const [sellerIdType, setSellerIdType] = useState<"Aadhaar" | "PAN" | "Driving License">("Aadhaar");
  const [sellerIdNumber, setSellerIdNumber] = useState("5421-8902-1244");
  const [sellerIdPhotoFront, setSellerIdPhotoFront] = useState<string>("");
  const [sellerIdPhotoBack, setSellerIdPhotoBack] = useState<string>("");
  const [sellerPhoto, setSellerPhoto] = useState<string>("");
  const [ownershipSigned, setOwnershipSigned] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<"UPI" | "Cash" | "Bank Transfer">("UPI");

  // Report Modal State
  const [selectedReportRecord, setSelectedReportRecord] = useState<BuybackRecord | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // File Input Refs
  const aadhaarFrontRef = React.useRef<HTMLInputElement | null>(null);
  const aadhaarBackRef = React.useRef<HTMLInputElement | null>(null);
  const customerPhotoRef = React.useRef<HTMLInputElement | null>(null);

  const handleKycImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.75);
      setter(compressed);
      showToast(`${label} uploaded and attached to verification file!`, "success");
    } catch {
      showToast(`Failed to upload ${label}. Please try again.`, "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Dynamic Valuation Algorithm
  const valuation = useMemo(() => {
    const base = MODEL_BASE_PRICES[model] || 25000;
    let deductions = 0;

    // Screen deduction
    if (screenCondition === "Minor Scratches") deductions += 1200;
    if (screenCondition === "Cracked") deductions += 5500;

    // Body deduction
    if (bodyCondition === "Minor Scratches") deductions += 800;
    if (bodyCondition === "Dented") deductions += 2500;

    // Functional deductions
    if (!isFaceIdWorking) deductions += 2500;
    if (!areCamerasWorking) deductions += 3000;
    if (!isChargingWorking) deductions += 1200;
    if (batteryHealth < 80) deductions += 2000;

    // Box & Bill bonuses
    let bonuses = 0;
    if (hasOriginalBox) bonuses += 500;
    if (hasOriginalBill) bonuses += 1000;

    const netOffered = Math.max(3000, base - deductions + bonuses);

    return {
      baseMarketValue: base,
      deductionsTotal: deductions,
      bonusesTotal: bonuses,
      finalOfferedPrice: netOffered,
    };
  }, [
    model,
    screenCondition,
    bodyCondition,
    isFaceIdWorking,
    areCamerasWorking,
    isChargingWorking,
    batteryHealth,
    hasOriginalBox,
    hasOriginalBill,
  ]);

  const handleFinalizeBuyback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownershipSigned) {
      showToast("Please agree to the Legal Ownership Transfer Declaration!", "error");
      return;
    }

    const functionalIssues: string[] = [];
    if (!isFaceIdWorking) functionalIssues.push("Face ID / Biometric Defect");
    if (!areCamerasWorking) functionalIssues.push("Camera System Defect");
    if (!isChargingWorking) functionalIssues.push("Charging Port Defect");
    if (batteryHealth < 80) functionalIssues.push("Battery Health Below 80%");

    const record = addBuyback(
      {
        brand,
        model,
        storage,
        colour,
        imei1,
        imei2,
        batteryHealth,
        screenCondition,
        bodyCondition,
        functionalIssues,
        hasOriginalBox,
        hasOriginalBill,
        baseMarketValue: valuation.baseMarketValue,
        deductionsTotal: valuation.deductionsTotal,
        finalOfferedPrice: valuation.finalOfferedPrice,
        payoutStatus: "Completed",
        payoutMethod,
        sellerName,
        sellerPhone,
        sellerEmail,
        sellerAddress,
        sellerIdType,
        sellerIdNumber,
        sellerIdPhotoFront,
        sellerIdPhotoBack,
        sellerPhoto,
        policeVerificationStatus: "Cleared",
        ceirStatus: "Clean",
        ownershipDeclarationSigned: true,
        evaluatedBy: "Abhay Verma (Store Manager)",
        storeLocation: "Lucknow Store (LKO-01)",
      },
      true // auto inward to inventory!
    );

    setSelectedReportRecord(record);
    setIsReportOpen(true);

    showToast(
      `Buyback ${record.id} finalized! Payout of ${formatINR(valuation.finalOfferedPrice)} initiated & phone inwarded to inventory. Aadhaar Report generated!`,
      "success"
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ArrowRightLeft className="h-6 w-6 text-fundu-600" />
              <span>Customer Buyback &amp; Trade-In Valuation Desk</span>
            </h1>
            <Badge variant="fundu" size="sm">
              Exchange Engine
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            TheFundu customer phone valuation engine with instant diagnostics, Government CEIR portal clean title clearance, and 1-click inventory inwarding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 text-xs">
            <Store className="h-3.5 w-3.5 text-fundu-600" />
            <span>Store: Lucknow (LKO-01)</span>
          </Badge>
        </div>
      </div>

      {/* TWO COLUMN GRID: Left = Evaluation Form, Right = Valuation & CEIR Declaration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Handset Specifications & Diagnostics (7 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-fundu-600" />
                <span>1. Handset Model &amp; Hardware Identity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-800 dark:bg-slate-900 font-medium"
                  >
                    {SMARTPHONE_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1">Model Name</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900"
                  >
                    {Object.keys(MODEL_BASE_PRICES).map((m) => (
                      <option key={m} value={m}>
                        {m} (Base: ₹{MODEL_BASE_PRICES[m].toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Storage</label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Colour</label>
                  <Input
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Battery Health %</label>
                  <Input
                    type="number"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(Number(e.target.value))}
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">IMEI 1 (15 Digits) *</label>
                  <Input
                    value={imei1}
                    onChange={(e) => setImei1(e.target.value)}
                    placeholder="359078245981122"
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">IMEI 2 / eSIM (Optional)</label>
                  <Input
                    value={imei2}
                    onChange={(e) => setImei2(e.target.value)}
                    placeholder="359078245981123"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condition Evaluation Questionnaire */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-600" />
                <span>2. Physical Condition &amp; Functional Diagnostics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              {/* Screen Condition */}
              <div>
                <label className="font-semibold block mb-1.5">Screen / Display Glass Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "Flawless", desc: "No scratches / Clean OLED" },
                    { val: "Minor Scratches", desc: "Micro hairlines (-₹1,200)" },
                    { val: "Cracked", desc: "Glass broken / Lines (-₹5,500)" },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setScreenCondition(s.val as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        screenCondition === s.val
                          ? "border-fundu-600 bg-fundu-50/50 dark:bg-fundu-950/40 text-fundu-900 dark:text-fundu-200 ring-2 ring-fundu-500/20 font-bold"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <p className="font-semibold text-xs">{s.val}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Condition */}
              <div>
                <label className="font-semibold block mb-1.5">Outer Body &amp; Enclosure Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "Flawless", desc: "No dents / Like new" },
                    { val: "Minor Scratches", desc: "Normal pocket wear (-₹800)" },
                    { val: "Dented", desc: "Bent / heavy impact (-₹2,500)" },
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setBodyCondition(b.val as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        bodyCondition === b.val
                          ? "border-fundu-600 bg-fundu-50/50 dark:bg-fundu-950/40 text-fundu-900 dark:text-fundu-200 ring-2 ring-fundu-500/20 font-bold"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <p className="font-semibold text-xs">{b.val}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{b.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Functional Checkboxes */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Functional Checkpoints:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFaceIdWorking}
                      onChange={(e) => setIsFaceIdWorking(e.target.checked)}
                      className="rounded border-slate-300 text-fundu-600"
                    />
                    <span>Face ID / Touch ID Working</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={areCamerasWorking}
                      onChange={(e) => setAreCamerasWorking(e.target.checked)}
                      className="rounded border-slate-300 text-fundu-600"
                    />
                    <span>Front &amp; Back Cameras OK</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChargingWorking}
                      onChange={(e) => setIsChargingWorking(e.target.checked)}
                      className="rounded border-slate-300 text-fundu-600"
                    />
                    <span>Charging Port &amp; Speakers OK</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={batteryHealth >= 80}
                      onChange={(e) => setBatteryHealth(e.target.checked ? 88 : 74)}
                      className="rounded border-slate-300 text-fundu-600"
                    />
                    <span>Battery Health ≥ 80%</span>
                  </label>
                </div>
              </div>

              {/* Box & Bill Bonuses */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-emerald-700 dark:text-emerald-300">
                  <input
                    type="checkbox"
                    checked={hasOriginalBox}
                    onChange={(e) => setHasOriginalBox(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Original Box Available (+₹500)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-emerald-700 dark:text-emerald-300">
                  <input
                    type="checkbox"
                    checked={hasOriginalBill}
                    onChange={(e) => setHasOriginalBill(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Original Purchase Bill (+₹1,000)</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Live Valuation + CEIR & Police Clearance (5 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dynamic Valuation Summary */}
          <Card className="border-2 border-fundu-500/30 bg-gradient-to-br from-fundu-50/20 via-white to-emerald-50/30 dark:from-slate-900 dark:via-fundu-950/20 dark:to-slate-900 shadow-lg">
            <CardHeader className="pb-2 border-b border-fundu-200/60 dark:border-fundu-800/60">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Calculated Buyback Offer</span>
                <Badge variant="fundu" size="sm">
                  Instant Payout
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-baseline justify-between shadow-2xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    Net Valuation Offered
                  </p>
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatINR(valuation.finalOfferedPrice)}
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <p>Base: {formatINR(valuation.baseMarketValue)}</p>
                  <p className="text-rose-600">- {formatINR(valuation.deductionsTotal)}</p>
                  <p className="text-emerald-600">+ {formatINR(valuation.bonusesTotal)}</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="font-semibold block mb-1 text-[11px]">
                  Customer Payout Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["UPI", "Cash", "Bank Transfer"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayoutMethod(m)}
                      className={`py-1.5 px-2 rounded-lg border text-center text-xs font-semibold transition-all ${
                        payoutMethod === m
                          ? "border-fundu-600 bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 ring-2 ring-fundu-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CEIR & Police Verification Declaration Form */}
          <Card className="border border-slate-200 dark:border-slate-800 shadow-md">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>3. Police &amp; CEIR Legal Clearance</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" /> CEIR Clean
                </span>
              </CardTitle>
              <CardDescription className="text-[11px]">
                Statutory anti-stolen device clearance &amp; Aadhaar/PAN ownership declaration under Indian law.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Seller Full Name *</label>
                <Input
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Mobile No *</label>
                  <Input
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Govt ID Type</label>
                  <select
                    value={sellerIdType}
                    onChange={(e) => setSellerIdType(e.target.value as any)}
                    className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Residential Address *</label>
                <Input
                  required
                  placeholder="e.g. ED-476, Sector-Q, Aliganj, Lucknow"
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">{sellerIdType} Number *</label>
                <Input
                  required
                  placeholder="e.g. 5421-8902-1244"
                  value={sellerIdNumber}
                  onChange={(e) => setSellerIdNumber(e.target.value)}
                  className="h-8 text-xs font-mono font-bold tracking-wider"
                />
              </div>

              {/* Aadhaar Photo Attachment Section */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                    <span>Attach Aadhaar Card Proof</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Printed in Police Report</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Front */}
                  <input
                    type="file"
                    ref={aadhaarFrontRef}
                    onChange={(e) => handleKycImageUpload(e, setSellerIdPhotoFront, "Aadhaar Card Front")}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    {sellerIdPhotoFront ? (
                      <div className="relative rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-700 aspect-video group bg-white dark:bg-slate-800">
                        <img src={sellerIdPhotoFront} alt="Front" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSellerIdPhotoFront("")}
                            className="p-1 rounded bg-rose-600 text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                          Aadhaar Front ✓
                        </span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => aadhaarFrontRef.current?.click()}
                        className="w-full h-14 border-dashed border-slate-300 flex flex-col items-center justify-center text-[10px] gap-1 hover:border-fundu-500"
                      >
                        <Camera className="h-3.5 w-3.5 text-slate-500" />
                        <span>Upload Aadhaar Front</span>
                      </Button>
                    )}
                  </div>

                  {/* Back */}
                  <input
                    type="file"
                    ref={aadhaarBackRef}
                    onChange={(e) => handleKycImageUpload(e, setSellerIdPhotoBack, "Aadhaar Card Back")}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    {sellerIdPhotoBack ? (
                      <div className="relative rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-700 aspect-video group bg-white dark:bg-slate-800">
                        <img src={sellerIdPhotoBack} alt="Back" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSellerIdPhotoBack("")}
                            className="p-1 rounded bg-rose-600 text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                          Aadhaar Back ✓
                        </span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => aadhaarBackRef.current?.click()}
                        className="w-full h-14 border-dashed border-slate-300 flex flex-col items-center justify-center text-[10px] gap-1 hover:border-fundu-500"
                      >
                        <Camera className="h-3.5 w-3.5 text-slate-500" />
                        <span>Upload Aadhaar Back</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Legal Declaration Checkbox */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={ownershipSigned}
                    onChange={(e) => setOwnershipSigned(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-fundu-600"
                  />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                    <strong>Statutory Ownership Declaration:</strong> I solemnly declare that I am the sole, legitimate legal owner of IMEI <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{imei1}</span>. The device is not stolen, blacklisted, or subject to any active police investigation. I legally transfer full ownership title to <strong>{COMPANY_CONFIG.legalName}</strong>.
                  </span>
                </label>
              </div>

              <Button
                type="button"
                variant="fundu"
                size="lg"
                onClick={handleFinalizeBuyback}
                className="w-full h-11 text-xs font-bold gap-2 shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finalize Buyback &amp; Inward to Stock ({formatINR(valuation.finalOfferedPrice)})</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RECENT BUYBACK & EXCHANGE LEDGER */}
      {/* ============================================================== */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-fundu-600" />
                <span>Recent Buyback &amp; Trade-In Ledger</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Historical buybacks with CEIR police clearance certificates and inventory tracking.
              </CardDescription>
            </div>
            <Badge variant="fundu" size="sm">
              {buybacks.length} Exchanges Recorded
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Buyback ID</th>
                <th className="p-3">Handset Model</th>
                <th className="p-3">IMEI 1</th>
                <th className="p-3">Customer (Seller)</th>
                <th className="p-3 text-right">Offered Value</th>
                <th className="p-3">CEIR Check</th>
                <th className="p-3">Payout</th>
                <th className="p-3">Inward Stock ID</th>
                <th className="p-3 text-center">Aadhaar Police Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {buybacks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No buyback records yet. Use the form above to evaluate and buy back a handset.
                  </td>
                </tr>
              ) : (
                buybacks.map((bb) => (
                <tr key={bb.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {bb.id}
                  </td>
                  <td className="p-3 font-semibold">
                    {bb.brand} {bb.model} ({bb.storage})
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">
                    {bb.imei1}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{bb.sellerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {bb.sellerPhone} • {bb.sellerIdType}: {bb.sellerIdNumber}
                    </p>
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(bb.finalOfferedPrice)}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      {bb.ceirStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {bb.payoutMethod} ({bb.payoutStatus})
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs text-fundu-600 font-semibold">
                    {bb.inwardDeviceId || "Auto-Inwarded"}
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedReportRecord(bb);
                        setIsReportOpen(true);
                      }}
                      className="h-7 text-xs font-semibold gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/40"
                      title="Print Official Second-Hand Mobile Purchase Voucher with Aadhaar KYC"
                    >
                      <Printer className="h-3 w-3" />
                      <span>Print KYC Report</span>
                    </Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Official Buyback & Aadhaar Police CEIR Report Modal */}
      <BuybackKycReportModal
        record={selectedReportRecord}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
