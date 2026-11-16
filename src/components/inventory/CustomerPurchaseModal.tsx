"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  User,
  CreditCard,
  Building2,
  Calendar,
  X,
  Camera,
  UploadCloud,
  Trash2,
  Save,
  DollarSign,
  Tag,
  Hash,
  AlertCircle,
  FileCheck2,
  Store,
  Globe,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { BuybackRecord, Device, DeviceStatus, WarehouseLocation } from "@/lib/types";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { formatINR, compressImage } from "@/lib/utils";

interface CustomerPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (buybackRecord: BuybackRecord, newDevice: Device) => void;
}

const COMMON_BRANDS = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Google",
  "Xiaomi",
  "Vivo",
  "Oppo",
  "Realme",
  "Motorola",
  "Nothing",
  "iQOO",
];

const STORAGE_OPTIONS = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];

export function CustomerPurchaseModal({
  isOpen,
  onClose,
  onSuccess,
}: CustomerPurchaseModalProps) {
  const { addDevice, addBuyback, devices, warehouses, showToast } = useApp();

  // Tab State: "customer" | "device" | "deal"
  const [step, setStep] = useState<"customer" | "device" | "deal">("customer");

  // Step 1: Customer KYC & Source
  const [channelSource, setChannelSource] = useState<"Walk-in Store" | "Online Seller">("Walk-in Store");
  const [customerName, setCustomerName] = useState("Rohit Shukla");
  const [customerPhone, setCustomerPhone] = useState("9839012345");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("ED-476, Sector-Q, Aliganj, Lucknow, UP 226024");
  const [idType, setIdType] = useState<"Aadhaar" | "PAN" | "Driving License">("Aadhaar");
  const [idNumber, setIdNumber] = useState("5421-8902-1244");
  const [aadhaarFront, setAadhaarFront] = useState<string>("");
  const [aadhaarBack, setAadhaarBack] = useState<string>("");
  const [customerPhoto, setCustomerPhoto] = useState<string>("");

  // Step 2: Device Specs & ID
  const [customFunId, setCustomFunId] = useState(`Fun-${26000 + (devices?.length || 0) + 1}`);
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("iPhone 13");
  const [storage, setStorage] = useState("128GB");
  const [colour, setColour] = useState("Midnight Blue");
  const [imei1, setImei1] = useState("35" + Math.floor(1000000000000 + Math.random() * 9000000000000));
  const [imei2, setImei2] = useState("");
  const [serialNumber, setSerialNumber] = useState("F2LZ" + Math.random().toString(36).substring(2, 6).toUpperCase());
  const [batteryHealth, setBatteryHealth] = useState<number>(87);
  const [devicePhoto, setDevicePhoto] = useState<string>("");

  // Step 3: Deal & Payout
  const [purchasePrice, setPurchasePrice] = useState<number>(26000);
  const [sellingPrice, setSellingPrice] = useState<number>(32999);
  const [payoutMethod, setPayoutMethod] = useState<"UPI" | "Cash" | "Bank Transfer">("UPI");
  const [initialStatus, setInitialStatus] = useState<DeviceStatus>("In Stock");
  const [warehouse, setWarehouse] = useState<WarehouseLocation>(warehouses[0]?.name || "Lucknow Store (LKO-01)");
  const [ownershipSigned, setOwnershipSigned] = useState(true);

  // File Input Refs
  const frontRef = React.useRef<HTMLInputElement | null>(null);
  const backRef = React.useRef<HTMLInputElement | null>(null);
  const photoRef = React.useRef<HTMLInputElement | null>(null);
  const devicePhotoRef = React.useRef<HTMLInputElement | null>(null);

  const handleImagePick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.75);
      setter(compressed);
      showToast(`${label} attached successfully!`, "success");
    } catch {
      showToast(`Could not upload ${label}. Please try another file.`, "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast("Customer / Seller Name is required.", "error");
      setStep("customer");
      return;
    }

    if (!idNumber.trim()) {
      showToast("Customer Aadhaar / ID number is required.", "error");
      setStep("customer");
      return;
    }

    if (!imei1 || imei1.length < 14) {
      showToast("Primary IMEI 1 (15 digits) is required.", "error");
      setStep("device");
      return;
    }

    if (!model.trim()) {
      showToast("Phone model is required.", "error");
      setStep("device");
      return;
    }

    if (!ownershipSigned) {
      showToast("Customer must accept the Statutory Ownership Declaration.", "error");
      setStep("deal");
      return;
    }

    const buyPrice = Number(purchasePrice || 0);
    const sellPrice = Number(sellingPrice || buyPrice * 1.25);
    const totalLandedCost = buyPrice + 1300;
    const projectedProfit = sellPrice - totalLandedCost;
    const profitMarginPercent = sellPrice > 0 ? Number(((projectedProfit / sellPrice) * 100).toFixed(1)) : 0;

    // 1. Create the Device directly in Inventory
    const newDevice = addDevice({
      id: customFunId.trim(),
      brand: brand.trim(),
      model: model.trim(),
      storage,
      ram: "6GB",
      colour: colour.trim(),
      imei1: imei1.trim(),
      imei2: imei2.trim(),
      serialNumber: serialNumber.trim(),
      sku: `${brand.substring(0, 3).toUpperCase()}-${model.replace(/\s+/g, "").substring(0, 5).toUpperCase()}-${storage}`,
      batteryHealth: brand === "Apple" ? Number(batteryHealth) : undefined,
      status: initialStatus,
      warehouse,
      supplierName: `${channelSource === "Walk-in Store" ? "Walk-in Store" : "Online"} Customer Buyback (${customerName.trim()})`,
      images: devicePhoto ? [devicePhoto] : [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
      ],
      customerKyc: {
        sellerName: customerName.trim(),
        sellerPhone: customerPhone.trim(),
        sellerEmail: customerEmail.trim(),
        sellerAddress: customerAddress.trim(),
        sellerIdType: idType,
        sellerIdNumber: idNumber.trim(),
        sellerIdPhotoFront: aadhaarFront,
        sellerIdPhotoBack: aadhaarBack,
        sellerPhoto: customerPhoto,
        payoutAmount: buyPrice,
        payoutMethod,
        payoutDate: new Date().toISOString().split("T")[0],
        ceirStatus: "Clean",
        ownershipDeclarationSigned: true,
      },
      costs: {
        purchasePrice: buyPrice,
        repairCost: 0,
        testingCost: 500,
        packagingCost: 400,
        logisticsCost: 200,
        otherCost: 200,
        totalLandedCost,
        sellingPrice: sellPrice,
        projectedProfit,
        profitMarginPercent,
      },
    });

    // 2. Also record in Buybacks registry for police & CEIR compliance
    const buybackRecord = addBuyback(
      {
        inwardDeviceId: newDevice.id,
        brand: newDevice.brand,
        model: newDevice.model,
        storage: newDevice.storage,
        colour: newDevice.colour,
        imei1: newDevice.imei1,
        imei2: newDevice.imei2,
        serialNumber: newDevice.serialNumber,
        batteryHealth: newDevice.batteryHealth,
        screenCondition: "Flawless",
        bodyCondition: "Flawless",
        functionalIssues: [],
        hasOriginalBox: true,
        hasOriginalBill: false,
        baseMarketValue: Math.round(buyPrice * 1.15),
        deductionsTotal: Math.round(buyPrice * 0.15),
        finalOfferedPrice: buyPrice,
        payoutStatus: "Completed",
        payoutMethod,
        sellerName: customerName.trim(),
        sellerPhone: customerPhone.trim(),
        sellerEmail: customerEmail.trim(),
        sellerAddress: customerAddress.trim(),
        sellerIdType: idType,
        sellerIdNumber: idNumber.trim(),
        sellerIdPhotoFront: aadhaarFront,
        sellerIdPhotoBack: aadhaarBack,
        sellerPhoto: customerPhoto,
        policeVerificationStatus: "Cleared",
        ceirStatus: "Clean",
        ownershipDeclarationSigned: true,
        evaluatedBy: "Abhay Verma (Store Head)",
        storeLocation: warehouse,
      },
      false // Already added above
    );

    showToast(`Handset ${newDevice.id} added directly to Inventory! Aadhaar Police Report generated.`, "success");
    onSuccess(buybackRecord, newDevice);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/60 dark:bg-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Customer Se Phone Khareedo (Aadhaar KYC Purchase)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Auto-Inward to Inventory
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Record customer identification with Aadhaar card photos, IMEI specs, purchase payout, and generate the official Police CEIR Report.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={() => setStep("customer")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              step === "customer"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>1. Customer &amp; Aadhaar KYC</span>
          </button>

          <button
            type="button"
            onClick={() => setStep("device")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              step === "device"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>2. Phone Model &amp; IMEI</span>
          </button>

          <button
            type="button"
            onClick={() => setStep("deal")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              step === "deal"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>3. Payout &amp; Legal Declaration</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* STEP 1: CUSTOMER AADHAAR KYC */}
          {step === "customer" && (
            <div className="space-y-4">
              {/* Purchase Channel / Source */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Customer Purchase Source / Channel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannelSource("Walk-in Store")}
                    className={`h-10 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      channelSource === "Walk-in Store"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    }`}
                  >
                    <Store className="h-4 w-4 text-emerald-600" />
                    <span>Walk-in Store Customer (Dukaan pe aaya)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannelSource("Online Seller")}
                    className={`h-10 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      channelSource === "Online Seller"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    }`}
                  >
                    <Globe className="h-4 w-4 text-emerald-600" />
                    <span>Online Customer (Website / Remote Sell)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer / Seller Full Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Rohit Shukla"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-xs h-9 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. 9839012345"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="text-xs h-9 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Government Photo ID Type
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as any)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {idType} Number (12 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. 5421-8902-1244"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="text-xs h-9 font-mono font-bold tracking-widest text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residential Address (Printed on Police KYC Report) <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. ED-476, Sector-Q, Aliganj, Lucknow, UP 226024"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              {/* Aadhaar Photo Upload Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span>Aadhaar Card Photo Proof Attachment</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Attach photo of customer Aadhaar front &amp; back. Embedded in the printable Police CEIR Report.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Front */}
                  <input
                    type="file"
                    ref={frontRef}
                    onChange={(e) => handleImagePick(e, setAadhaarFront, "Aadhaar Card Front")}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Aadhaar Card Front Photo
                    </label>
                    {aadhaarFront ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-400 aspect-video group bg-white">
                        <img src={aadhaarFront} alt="Aadhaar Front" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={() => setAadhaarFront("")}
                            className="h-7 text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <span className="absolute bottom-1.5 left-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Aadhaar Front Attached ✓
                        </span>
                      </div>
                    ) : (
                      <div
                        onClick={() => frontRef.current?.click()}
                        className="h-28 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50"
                      >
                        <Camera className="h-5 w-5 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Upload Aadhaar Front
                        </span>
                        <span className="text-[10px] text-slate-400">Click to choose file or snap photo</span>
                      </div>
                    )}
                  </div>

                  {/* Back */}
                  <input
                    type="file"
                    ref={backRef}
                    onChange={(e) => handleImagePick(e, setAadhaarBack, "Aadhaar Card Back")}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Aadhaar Card Back Photo (Address Proof)
                    </label>
                    {aadhaarBack ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-400 aspect-video group bg-white">
                        <img src={aadhaarBack} alt="Aadhaar Back" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={() => setAadhaarBack("")}
                            className="h-7 text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <span className="absolute bottom-1.5 left-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Aadhaar Back Attached ✓
                        </span>
                      </div>
                    ) : (
                      <div
                        onClick={() => backRef.current?.click()}
                        className="h-28 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50"
                      >
                        <Camera className="h-5 w-5 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Upload Aadhaar Back
                        </span>
                        <span className="text-[10px] text-slate-400">Address side of card</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PHONE MODEL & IMEI SPECS */}
          {step === "device" && (
            <div className="space-y-4">
              {/* Fun Code Section */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Inventory ID / Fun Code</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-blue-700/90 dark:text-blue-300 mt-0.5">
                    Stock identifier to assign to this phone in the inventory ledger.
                  </p>
                </div>
                <div className="w-full sm:w-60 shrink-0">
                  <Input
                    placeholder="e.g. Fun-26065"
                    value={customFunId}
                    onChange={(e) => setCustomFunId(e.target.value)}
                    className="text-xs h-9 font-mono font-bold tracking-wider bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100"
                    required
                  />
                </div>
              </div>

              {/* Brand and Model */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {COMMON_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Handset Model Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. iPhone 13 or Galaxy S23"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-xs h-9 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Storage, Colour, Battery Health */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Storage Variant
                  </label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {STORAGE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Colour / Finish
                  </label>
                  <Input
                    placeholder="e.g. Midnight, Space Black"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Battery Health % {brand === "Apple" ? "(Apple iOS)" : "(N/A)"}
                  </label>
                  <Input
                    type="number"
                    min={50}
                    max={100}
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(Number(e.target.value))}
                    className="text-xs h-9 font-mono font-bold"
                  />
                </div>
              </div>

              {/* IMEIs and Serial */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary IMEI 1 (15 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="352819001234567"
                    maxLength={15}
                    value={imei1}
                    onChange={(e) => setImei1(e.target.value.replace(/\D/g, ""))}
                    className="text-xs h-9 font-mono font-bold tracking-wider"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary IMEI 2 / eSIM
                  </label>
                  <Input
                    placeholder="Optional secondary"
                    maxLength={15}
                    value={imei2}
                    onChange={(e) => setImei2(e.target.value.replace(/\D/g, ""))}
                    className="text-xs h-9 font-mono tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Factory Serial Number
                  </label>
                  <Input
                    placeholder="SNBB-2601"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                    className="text-xs h-9 font-mono uppercase"
                  />
                </div>
              </div>

              {/* Handset Photo */}
              <input
                type="file"
                ref={devicePhotoRef}
                onChange={(e) => handleImagePick(e, setDevicePhoto, "Handset Photo")}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div
                  onClick={() => devicePhotoRef.current?.click()}
                  className="h-16 w-16 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 bg-white dark:bg-slate-800"
                >
                  {devicePhoto ? (
                    <img src={devicePhoto} alt="Phone" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Handset Photo (Optional)
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Click the box to snap or attach a photo of the phone from computer or mobile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DEAL, PRICING & LEGAL DECLARATION */}
          {step === "deal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Purchase Price Paid to Customer (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm font-semibold text-slate-400">₹</span>
                    <Input
                      type="number"
                      min={0}
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="pl-8 text-base font-bold font-mono h-10"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Amount paid to customer (your base acquisition cost).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                  <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Target Retail Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm font-semibold text-emerald-600">₹</span>
                    <Input
                      type="number"
                      min={0}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="pl-8 text-base font-bold font-mono text-emerald-700 dark:text-emerald-300 h-10 border-emerald-300 dark:border-emerald-700"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    Expected selling price to end customer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Mode Given to Customer
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="UPI">UPI Instant</option>
                    <option value="Cash">Cash Handover</option>
                    <option value="Bank Transfer">Bank Transfer / IMPS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Inventory Status
                  </label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value as any)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="In Stock">In Stock (Warehouse)</option>
                    <option value="Ready for Sale">Ready for Sale (Counter POS)</option>
                    <option value="QC Pending">QC Pending</option>
                    <option value="Under Repair">Under Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Receiving Store Outlet
                  </label>
                  <select
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Statutory Legal Declaration */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ownershipSigned}
                    onChange={(e) => setOwnershipSigned(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    required
                  />
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">
                      Statutory Anti-Theft &amp; Ownership Declaration (Under Section 411/414 IPC):
                    </strong>{" "}
                    Customer <strong>{customerName || "Customer"}</strong> confirms legal ownership of IMEI{" "}
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{imei1}</span>, that the phone is not stolen, blacklisted, or subject to any police inquiry, and transfers full legal ownership to{" "}
                    <strong>{COMPANY_CONFIG.legalName}</strong>.
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0">
          <div>
            {step === "customer" && (
              <span className="text-xs text-slate-400">Step 1 of 3: Customer KYC</span>
            )}
            {step === "device" && (
              <span className="text-xs text-slate-400">Step 2 of 3: Phone Specs &amp; IMEI</span>
            )}
            {step === "deal" && (
              <span className="text-xs text-slate-400">Step 3 of 3: Payout &amp; Inwarding</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step !== "customer" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(step === "deal" ? "device" : "customer")}
                className="text-xs"
              >
                Back
              </Button>
            )}

            {step !== "deal" ? (
              <Button
                type="button"
                variant="fundu"
                size="sm"
                onClick={() => {
                  if (step === "customer") {
                    if (!customerName.trim() || !idNumber.trim()) {
                      showToast("Please enter customer name and Aadhaar number.", "error");
                      return;
                    }
                    setStep("device");
                  } else if (step === "device") {
                    if (!model.trim() || !imei1.trim()) {
                      showToast("Please enter model name and IMEI 1.", "error");
                      return;
                    }
                    setStep("deal");
                  }
                }}
                className="text-xs px-4"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                variant="fundu"
                size="sm"
                className="gap-1.5 text-xs font-bold px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>Save, Add to Inventory &amp; Print Report</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
}
