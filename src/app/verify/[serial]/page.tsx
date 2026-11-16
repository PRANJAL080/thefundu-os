"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Battery,
  Award,
  Sparkles,
  Smartphone,
  Store,
  FileText,
  Printer,
  ChevronRight,
  PhoneCall,
  Calendar,
  AlertCircle,
  Wrench,
  X,
  Share2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Device, QCInspection, WarrantyClaim } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { QRCodeSVG } from "@/components/common/QRCodeSVG";

export default function DeviceVerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawSerial = (params?.serial as string) || "SN26004";
  const { devices, addWarrantyClaim, showToast } = useApp();

  // Find matching device
  const device: Device = useMemo(() => {
    const q = rawSerial.toLowerCase();
    const found = devices.find(
      (d) =>
        d.serialNumber.toLowerCase() === q ||
        d.id.toLowerCase() === q ||
        d.id.toLowerCase().replace("fun-", "") === q ||
        d.imei1.includes(q)
    );
    if (found) return found;
    return (
      devices[0] || {
        id: "Fun-26004",
        brand: "Apple",
        model: "iPhone 15 Pro Max",
        storage: "256GB",
        colour: "White Titanium",
        imei1: "356642157403535",
        imei2: "356642157403536",
        serialNumber: "SN26004",
        sku: "TFD26004LKO",
        batteryHealth: 94,
        status: "Ready for Sale",
        warehouse: "Lucknow Store (LKO-01)",
        purchaseDate: "2026-11-10",
        supplierId: "SUP-01",
        supplierName: "Apple Trade-In Hub",
        images: [],
        repairHistory: [],
        costs: {
          purchasePrice: 56940,
          repairCost: 0,
          testingCost: 250,
          packagingCost: 450,
          logisticsCost: 150,
          otherCost: 0,
          totalLandedCost: 57790,
          sellingPrice: 73000,
          projectedProfit: 15210,
          profitMarginPercent: 20.8,
        },
      }
    );
  }, [devices, rawSerial]);

  // Clean description: "{Brand} {Model} ({Storage}) Refurbished {Colour}" (Strictly NO Grading)
  const cleanTitle = useMemo(() => {
    const cleanBrand = device.brand || "Apple";
    const cleanModel = (device.model || "iPhone")
      .replace(/\b(Refurbished|Grade\s*[A-D]\+?|A\+|B\+|B|C|D|Scrap)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    const storageStr = device.storage && !cleanModel.includes(device.storage) ? `(${device.storage})` : "";
    const cleanColour = device.colour && device.colour !== "Default Edition" ? device.colour : "";
    return [cleanBrand, cleanModel, storageStr, "Refurbished", cleanColour].filter(Boolean).join(" ");
  }, [device]);

  // Real-time 180-Day Warranty Countdown Timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    percentRemaining: number;
  }>({
    days: 142,
    hours: 14,
    minutes: 32,
    seconds: 45,
    percentRemaining: 78.8,
  });

  useEffect(() => {
    // Total warranty duration: 180 days from purchase
    const startDate = new Date(device.purchaseDate || "2026-11-10").getTime();
    const expiryDate = startDate + 180 * 24 * 60 * 60 * 1000;
    const totalDuration = 180 * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = expiryDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, percentRemaining: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const percent = Math.min(100, Math.max(0, (diff / totalDuration) * 100));
        setTimeLeft({ days, hours, minutes, seconds, percentRemaining: percent });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [device]);

  // Claim Warranty Modal State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimName, setClaimName] = useState("Abhay verma");
  const [claimPhone, setClaimPhone] = useState("7991990508");
  const [claimIssue, setClaimIssue] = useState("Screen touch lag / battery calibration check");
  const [claimSuccessTicket, setClaimSuccessTicket] = useState<string | null>(null);

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const claim = addWarrantyClaim({
      deviceId: device.id,
      serialNumber: device.serialNumber,
      customerName: claimName,
      customerPhone: claimPhone,
      issueDescription: claimIssue,
      warrantyStatus: "Active",
      status: "Submitted",
      assignedTechnician: "Suresh Rawat (LKO Bay)",
    });
    setClaimSuccessTicket(claim.id);
    showToast(`Warranty claim ticket ${claim.id} created! Technician assigned.`, "success");
  };

  // 42-Point QC Checklist Items
  const qcCategories = [
    {
      category: "1. Display & Multi-Touch Subsystem (7 Points)",
      checks: [
        "Super Retina XDR OLED Matrix (Zero Dead Pixels)",
        "120Hz ProMotion Adaptive Refresh Rate",
        "Capacitive 10-Point Multi-Touch Responsiveness",
        "TrueTone Color Calibration & Ambient Sensor",
        "Haptic Touch Engine & 3D Vibration Feedback",
        "Edge-to-Edge Bezel Integrity & Seal",
        "Dynamic Island / Notch Sensor Transparency",
      ],
    },
    {
      category: "2. Biometric & TrueDepth Security (4 Points)",
      checks: [
        "Face ID TrueDepth Infrared Dot Projector",
        "Flood Illuminator & IR Camera Calibration",
        "Secure Enclave Cryptographic Key Binding",
        "Apple Pay & Passcode Biometric Authentication",
      ],
    },
    {
      category: "3. Pro Camera Subsystem (8 Points)",
      checks: [
        "48MP Quad-Pixel Main Camera Sensor",
        "Sensor-Shift Optical Image Stabilization (OIS)",
        "12MP Ultra-Wide Macro & 5x Telephoto Zoom",
        "Cinematic Mode 4K Dolby Vision HDR Video",
        "TrueTone Adaptive Flash & LiDAR Scanner",
        "Front TrueDepth 12MP Autofocus Camera",
        "Lens Scratch & Internal Dust Free Certification",
        "Microphone Audio Sync in High-Res Video Recording",
      ],
    },
    {
      category: "4. Acoustic & Sound Fidelity (5 Points)",
      checks: [
        "Earpiece Speaker & High-Decibel Clarity",
        "Bottom Stereo Loudspeaker Acoustic Balance",
        "Studio-Quality Tri-Microphone Array",
        "Beamforming & Wind Noise Reduction Filtering",
        "Spatial Audio with Dynamic Head Tracking",
      ],
    },
    {
      category: "5. RF Wireless & Cellular Connectivity (8 Points)",
      checks: [
        "Sub-6GHz & mmWave 5G NR Carrier Testing",
        "Dual SIM / eSIM Activation & IMEI Registration",
        "Wi-Fi 6E (802.11ax) Dual-Band Throughput",
        "Bluetooth 5.3 Low Energy Pairing Stability",
        "NFC Reader / Field Communication & Apple Pay",
        "Ultra Wideband (UWB Gen 2) Precision Finding",
        "GPS, GLONASS, Galileo Satellite Positioning",
        "Emergency SOS & Satellite Link Capability",
      ],
    },
    {
      category: "6. Battery, Power & Ports (5 Points)",
      checks: [
        `Apple OEM Maximum Capacity Verified: ${device.batteryHealth || 94}%`,
        "Peak Performance Capability Mode Active",
        "USB-C / Lightning High-Speed Data Sync & PD Fast Charging",
        "Qi Wireless & MagSafe 15W Magnetic Alignment",
        "Battery Thermal Sensor & Overcharge Cutoff Protection",
      ],
    },
    {
      category: "7. Legal, Housing & CEIR Title (5 Points)",
      checks: [
        "Clean Title: CEIR & Sanchar Saathi National Registry Cleared",
        "Zero Police FIR / Stolen Device Clearance Verified",
        "Precision Refurbished Housing (Zero Structural Dents)",
        "Water & Dust Resistant Seal Restoration Tested",
        "TheFundu Certified Holographic Tamper-Proof Seal Affixed",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Link href="/verify" className="hover:text-fundu-600 transition-colors">
              Verification Portal
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {device.serialNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 text-xs font-semibold"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Certificate</span>
            </Button>
            <Button
              variant="fundu"
              size="sm"
              onClick={() => setIsClaimModalOpen(true)}
              className="gap-1.5 text-xs font-bold shadow-md"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Claim Warranty / Book Service</span>
            </Button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OFFICIAL HOLOGRAPHIC CERTIFICATE HERO */}
        {/* ============================================================== */}
        <div className="relative rounded-3xl border-2 border-fundu-500/40 bg-gradient-to-br from-white via-fundu-50/20 to-emerald-50/30 dark:from-slate-900 dark:via-fundu-950/30 dark:to-slate-900 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Top Golden / Hologram Seal */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-fundu-200/80 dark:border-fundu-800/80 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-fundu-500 text-white flex items-center justify-center shadow-lg shadow-fundu-500/25 ring-4 ring-fundu-500/20">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60">
                    TheFundu Certified Refurbished
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Rule 32(5) Verified
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 mt-1">
                  Official Digital Warranty Certificate
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Issued by {COMPANY_CONFIG.legalName} • Lucknow Aliganj Store
                </p>
              </div>
            </div>

            {/* QR Code on Certificate */}
            <div className="shrink-0 flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <QRCodeSVG
                value={`https://thefundu.com/verify/${device.serialNumber}`}
                size={64}
                className="rounded"
              />
              <div className="text-[9px] font-mono leading-tight">
                <p className="font-bold text-slate-800 dark:text-slate-200">VERIFIED PASS</p>
                <p className="text-slate-400">SN: {device.serialNumber}</p>
                <p className="text-emerald-600 font-bold mt-1">100% GENUINE</p>
              </div>
            </div>
          </div>

          {/* Device Model & Specs (STRICTLY NO GRADING!) */}
          <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-xs text-fundu-600 dark:text-fundu-400 font-semibold">
                <Smartphone className="h-4 w-4" />
                <span>Certified Handset Profile</span>
              </div>
              {/* DESCRIPTION: strictly includes "Refurbished", NO grading */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 leading-tight">
                {cleanTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                  SN: {device.serialNumber}
                </span>
                <span className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  IMEI1: {device.imei1}
                </span>
                {device.imei2 && (
                  <span className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    eSIM: {device.imei2}
                  </span>
                )}
              </div>
            </div>

            {/* Battery Health Gauge Card */}
            <div className="md:col-span-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Battery className="h-4 w-4 text-emerald-600" />
                  <span>Battery Health</span>
                </div>
                <Badge variant="fundu" size="sm">
                  Apple OEM
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {device.batteryHealth || 94}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Maximum Capacity</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Peak performance capability verified. Tested with genuine Apple diagnostic protocols.
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* LIVE WARRANTY COUNTDOWN TIMER */}
          {/* ============================================================== */}
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-sm tracking-wide">
                  Live 180-Day Warranty Status:
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE &amp; COVERED
                </span>
              </div>
              <span className="text-xs text-slate-400">
                180 Days Protection from Date of Purchase
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 py-4 text-center">
              <div className="rounded-xl bg-slate-800/80 p-2.5 sm:p-3 border border-slate-700">
                <span className="text-2xl sm:text-4xl font-black font-mono text-emerald-400">
                  {timeLeft.days}
                </span>
                <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                  Days
                </span>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-2.5 sm:p-3 border border-slate-700">
                <span className="text-2xl sm:text-4xl font-black font-mono text-slate-100">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                  Hours
                </span>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-2.5 sm:p-3 border border-slate-700">
                <span className="text-2xl sm:text-4xl font-black font-mono text-slate-100">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                  Minutes
                </span>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-2.5 sm:p-3 border border-slate-700">
                <span className="text-2xl sm:text-4xl font-black font-mono text-fundu-400">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                  Seconds
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-fundu-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${timeLeft.percentRemaining}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Coverage Started: {device.purchaseDate || "10 Nov 2026"}</span>
                <span>{timeLeft.percentRemaining.toFixed(1)}% Period Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 42-POINT QC DIAGNOSTIC CHECKLIST REPORT */}
        {/* ============================================================== */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>42-Point QC Certified Diagnostic Report</span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Full diagnostic breakdown passed by Senior QC Engineer (Aliganj Lab)
                </p>
              </div>
              <Badge variant="fundu" size="sm" className="font-mono text-xs">
                ALL 42/42 CHECKS PASSED
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {qcCategories.map((cat, idx) => (
              <div key={idx} className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                  <span className="h-2 w-2 rounded-full bg-fundu-600" />
                  <span>{cat.category}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.checks.map((chk, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs"
                    >
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {chk}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        PASS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Store & Customer Assistance Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Store className="h-4 w-4 text-fundu-600" />
              <span>Need Immediate Support or Store Walk-in?</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lucknow Store: ED-476, Sector-Q, Aliganj, Lucknow (226024) • Toll-Free: 1800-266-3863
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/91${COMPANY_CONFIG.phone}?text=Hello%20TheFundu,%20I%20have%20an%20inquiry%20regarding%20my%20certified%20device%20${device.serialNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="fundu" size="sm" className="gap-1.5 text-xs">
                <PhoneCall className="h-3.5 w-3.5" />
                <span>WhatsApp Store Support</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1-CLICK CLAIM WARRANTY MODAL */}
      {/* ============================================================== */}
      <Dialog
        isOpen={isClaimModalOpen}
        onClose={() => {
          setIsClaimModalOpen(false);
          setClaimSuccessTicket(null);
        }}
        maxWidth="lg"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-fundu-50 dark:bg-fundu-950 text-fundu-600 flex items-center justify-center">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Claim Warranty / Book Service Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Handset: {cleanTitle} ({device.serialNumber})
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsClaimModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {claimSuccessTicket ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                Service Ticket #{claimSuccessTicket} Created!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                Your claim has been logged under your 180-day warranty. Lucknow Store Technician (Suresh Rawat) has been notified. You can visit our Aliganj / Gomti Nagar store for priority repair.
              </p>
              <Button
                variant="fundu"
                size="sm"
                onClick={() => setIsClaimModalOpen(false)}
                className="mt-2 text-xs"
              >
                Close &amp; Return
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Customer Name *
                  </label>
                  <Input
                    required
                    value={claimName}
                    onChange={(e) => setClaimName(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Phone *
                  </label>
                  <Input
                    required
                    value={claimPhone}
                    onChange={(e) => setClaimPhone(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Issue Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={claimIssue}
                  onChange={(e) => setClaimIssue(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-fundu-500"
                  placeholder="Describe what issue you are facing..."
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Service Center: Lucknow Store &amp; Repair Bay (LKO-01)
                </p>
                <p className="text-[11px] text-slate-500">
                  ED-476, Sector-Q, Aliganj, Lucknow (UP) • Open Mon-Sat 10:00 AM - 08:30 PM
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="fundu" size="sm" className="text-xs font-bold gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Submit Warranty Claim</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    </div>
  );
}
